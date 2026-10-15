const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email || !password) {
      return res.status(400).json({ message: "all feilds are required" });
    }

    const isUserExists = await UserModel.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: "user registered successfully",
      userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "no user exists with this mail" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        samesite: "strict"
    })

    res.status(200).json({
        message: "logged in successfully",
        user
    })
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    })

    res.status(200).json({
      success: true,
      message: "logged out successfully"
    })
  } catch(err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = { registerUser, loginUser, logout }
