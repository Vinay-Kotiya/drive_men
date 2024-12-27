const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  const token = req.cookies.token;
  //   res.send(token);
  if (!token) {
    // return res.status(401).json({ message: "Unauthorized token is empty" });
    res.redirect("/user/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(req.user);

    return next();
  } catch (error) {
    return res.status(400).send(error);
  }
}

module.exports = auth;
