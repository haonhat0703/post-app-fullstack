const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzA2MmViOWQ4YWVhMGQ1YTFmMzc2ZGUiLCJpYXQiOjE2NjE0MTg3OTl9.XWnjUmpVXgZEPDv_bKdQ7_etw8MUuUOEuNC_pttb85s";

  if (!token) {
    res.redirect("/login");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.redirect("/login");
    return;
  }
};

module.exports = verifyToken;
