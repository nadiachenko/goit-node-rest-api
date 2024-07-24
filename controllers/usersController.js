import User from "../models/User.js"
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import fs from "fs/promises"
import path from "path"
import gravatar from "gravatar"
import Jimp from "jimp";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars")

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      avatarURL,
      password: hashPassword,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blang" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

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
    if (!user.verify) {
      throw HttpError(400, "Email not verified")
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

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};


const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(400, "Email not found")
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
      to: email,
      subject: "ReVerify email",
      html: `<a target="_blang" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`
    };
    await sendEmail(verifyEmail)

    res.json({
      message: "Verification email sent"
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
    if (!req.file) {
      throw HttpError(400, "Pelase attach a file")
    }
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
  verify,
  resendVerify,
  getCurrent,
  logout,
  updateAvatar
}