import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
// import { validationResult } from "express-validator";


export const createUser = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "allergies"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Please fill required ${field}` });
      }
    }

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // user exists → just token
      const token = jwt.sign({ id: user._id }, "verifyuser", { expiresIn: "7d" });

      return res.status(200).json({
        message: "User already exists, token generated",
        token
      });
    }

    // create new user
    user = await User.create(req.body);

    const token = jwt.sign({ id: user._id }, "verifyuser", { expiresIn: "7d" });

    return res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const userFind = async (req, res) => {
  try {
    const userfind = await User.find()
    if (!userfind) { return res.status(402).json({ message: 'user not found' }) }
    res.status(202).json({
      status: 'success',
      message: 'user find',
      data: userfind

    })
  } catch (error) {
    res.status(402).json({
      status: "fail",
      message: error.message
    })
  }
}