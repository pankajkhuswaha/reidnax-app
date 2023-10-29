const express = require("express");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const PORT = 8000;
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRoute");


mongoose.set("strictQuery", true);
dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use(notFound);
app.use(errorHandler);
const os = require("os");



// const ipAddress = Object.values(os.networkInterfaces())
//   .flat()
//   .find(({ family, internal }) => family === "IPv4" && !internal).address;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
