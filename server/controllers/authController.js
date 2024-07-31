import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ email: result.email, id: result._id }, "test");

    const { password: _, ...userWithoutPassword } = result._doc;

    res.status(201).json({
      message: "User Created Successfully",
      data: { userWithoutPassword, token },
    });
  } catch (error) {
    res.status(500).json({ message: "Error While Creating User" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test"
    );

    const { password: _, ...user } = existingUser._doc;

    res.status(201).json({
      message: "Login Successful",
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({ message: "Error While Logging In" });
  }
};
