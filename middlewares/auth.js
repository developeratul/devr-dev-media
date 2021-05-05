const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyToken = jwt.verify(token, process.env.AUTH_SECRET);

    const user = await Users.findOne({ _id: verifyToken.id });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ err: "unauthorized" });
  }
};

module.exports = auth;
