import User from "../models/User.js"
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import fs from "fs/promises"
import path from "path"
import gravatar from "gravatar"
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars")

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    const avatarURL = gravatar.url(email)
    if (user) {
      throw HttpError(409, "Email in use")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword })
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      }
    })
  }
  catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      throw HttpError(400, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      throw HttpError(400, "Email or password is wrong")
    }

    const payload = {
      id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" })
    await User.findByIdAndUpdate(user._id, { token })

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription
      }
    })

  }
  catch (error) {
    next(error)
  }


}

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json(result);
  }
  catch (error) {
    next(error)
  }
}

const getCurrent = async (req, res) => {
  try {

    const { email } = req.user
    const { subscription } = req.user

    res.json({
      email,
      subscription
    })
  }
  catch (error) {
    next(error)
  }
}
const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user
    const { path: oldPath, filename } = req.file;
    const uniqueFilename = `${_id}_${filename}`
    const newPath = path.join(avatarPath, uniqueFilename)
    await fs.rename(oldPath, newPath)
    const image = await Jimp.read(newPath)
    await image.resize(250, 250).writeAsync(newPath);
    const avatarURL = path.join("avatars", uniqueFilename)
    await User.findByIdAndUpdate(_id, { avatarURL })

    res.json({
      avatarURL
    })
  }
  catch (error) {
    next(error)
  }
}

export default {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar
}