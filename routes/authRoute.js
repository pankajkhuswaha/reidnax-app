const express = require("express");
const {
  createUser,
  loginUserCtrl,
  verifyUser,
} = require("../controller/userCtrl");

const router = express.Router();

router.get("/verify", verifyUser);
router.post("/register", createUser);
router.post("/login", loginUserCtrl);

module.exports = router;
