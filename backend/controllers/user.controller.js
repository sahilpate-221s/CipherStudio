const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.models");

// user registration
exports.Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      lastLoggedIn: new Date(),
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always secure in production
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return res
      .status(201)
      .json({ token, message: "User registered successfully", user: { username: newUser.username, email: newUser.email, settings: newUser.settings } });



  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in sign up " });
  }
};



// user login
exports.Login = async (req, res) => 
{
    try{

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields in log in" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not found please log in " });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "password not matched please check your password " });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Update last logged in time
        user.lastLoggedIn = new Date();
        await user.save();

        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // Always secure in production
          sameSite: 'none',
          
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ token, message: "Login successful", user: { username: user.username, email: user.email, settings: user.settings } });

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({ message: "Server error  in log in " });
    }
}

// get user profile
exports.GetProfile = async (req, res) =>
{
    try{
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({ message: "Server error in get profile " });
    }

}

// user logout
exports.Logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token", {
          httpOnly: true,
          secure: true, // Always secure in production
          sameSite: 'none',
          
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error in logout" });
    }
}

// update user settings
exports.UpdateSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { settings } = req.body;

        if (!settings) {
            return res.status(400).json({ message: "Settings are required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { settings: { ...settings } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error in update settings" });
    }
}

