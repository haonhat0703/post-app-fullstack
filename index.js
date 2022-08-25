//{}[]
require("dotenv").config(); //.env
const express = require("express");
const app = express();

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const verifyToken = require("./middleware/index");

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false })); //get data from frontend
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "/public")));
//set link to css, js for frontend

const connectDB = async () => {
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@haopr.erovkzo.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/register.html"));
});

app.get("/home", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/home.html"));
});

//router
app.use("/api", userRouter);
app.use("/api/posts", postRouter);

//run server
app.listen(process.env.PORT, () =>
  console.log(`Server is runnging at port ${process.env.PORT}`)
);
