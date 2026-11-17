const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUser = async (req, res, next) => {
  try {
    const token = 
      req.cookies?.token || 
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const user = await UserModel.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = { authUser };