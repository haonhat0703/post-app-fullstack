const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2"); //hash password
const jwt = require("jsonwebtoken"); //create token

//POST api/login
//login
//public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //check pass and user
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing password and/or username" });

  //have account?
  try {
    //check username
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //have username => check password
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //All good => return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//POST api/register
//add user
//public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  //check pass and user
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing password and/or username" });

  //existing
  try {
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });

    //All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
