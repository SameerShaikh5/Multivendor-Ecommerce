import { TryCatch } from "../middlewares/errorMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import VendorProfile from "../models/VendorProfile.js";


export const register = TryCatch(async (req, res, next) => {
  const { name, email, contact, password } = req.body;

  // basic validation (replace with zod later)
  if (!name || !email || !password) {
    throw new ErrorHandler(400, "Please provide all required fields");
  }

  // check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ErrorHandler(400, "Email already exists!");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await User.create({
    name,
    email,
    contact,
    password: hashedPassword
  });

  // create jwt
  const token = jwt.sign(
    {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // set secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  })

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    data: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      contact: newUser.contact
    }
  });
});


export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // basic validation
  if (!email || !password) {
    throw new ErrorHandler(400, "Email and password are required!");
  }

  // check user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ErrorHandler(401, "Invalid email or password");
  }

  // create JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // send cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  })

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
      contact: user.contact
    }
  });
});

export const updateUser = TryCatch(
  async (req, res, next) => {

    const { name, contact } = req.body

    // handle zod validation


    const user = await User.findById(req.user._id)

    user.name = name
    user.contact = contact

    await user.save()


    return res.status(200).json({
      success: true,
      message: "User updated succesfully!",
      data: user
    })

  }
)


export const getUserProfile = TryCatch(
  async (req, res, next) => {
    const user = req.user

    if (!user) {
      throw new ErrorHandler(404, "User not found!")
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user
    })
  }
)


export const logout = TryCatch(async (req, res, next) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });

});


export const checkLogin = TryCatch(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorHandler(401, "Unauthorized"));
  }

  res.status(200).json({
    success: true,
    data: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      contact: req.user.contact
    },
  });

});