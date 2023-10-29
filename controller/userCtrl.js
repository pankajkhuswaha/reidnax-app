const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const { mongooseError } = require("../middlewares/errorHandler");

const verifyUser = asyncHandler(async (req, res) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        if (user) return res.send(user);
        res.status(404).json({
          error: "User not found with requested id",
          message: "User Not Found",
        });                                                       
      }
    } catch (error) {
      res.status.json({
        error: "Not Authorized token expired, Please Login again",
      });
    }
  } else {
    res.status(500).json({ error: "There is no token attached to header" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      error: "User already exists",
      message:
        "The specified user already exists. Please use a different email address or username.",
    });
  }
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    mongooseError(error, res);
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: " ! Sorry User not found" });
  }

  const isCorrectPassword = await user.isPasswordMatched(password);
  if (!isCorrectPassword) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = generateRefreshToken(user?._id);
  user.token = token;
  await user.save();
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   maxAge: 72 * 60 * 60 * 1000,
  // });
  res.json({
    token,
  });
});

module.exports = {
  createUser,
  loginUserCtrl,
  verifyUser,
};
