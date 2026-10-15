const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: "please login first"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decoded._id)

        if(!user) {
            return res.status(404).json({ message: "user not found"})
        }

        req.user = user
        next()
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "authUser middleware: " + err.message
        })
    }
} 

module.exports = { authUser }