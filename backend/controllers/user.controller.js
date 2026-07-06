const user = require("../models/user.model.js");
const { use } = require("../routes/user.route.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sentEmail.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if ((!name, !email, !password)) {
      return res.status(404).json({ message: "All Feilds are require" });
    }

    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const User = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    if (User) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const message = `
        <h2>Welcome to ShopNest, ${name}!</h2>
        <p>Thank you registering on our platform.</p>
        <p>Your one-time varification/discount OTP is: <strong>${otp}</strong></p>
        `;

      await sendEmail({
        email: User.email,
        subject: "Welcome to ShopNest -Your OTP",
        message,
      });

      res.status(201).json({
        _id: User._id,
        name: User.name,
        email: User.email,
        token: generateToken(User._id),
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in SignUp user", error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if ((!email, !password)) {
      return res.status(404).json({ message: "All Feilds are required" });
    }

    const User = await user.findOne({ email });

    if (User && (await bcrypt.compare(password, User.password))) {
      res.json({
        _id: User._id,
        name: User.name,
        email: User.email,
        role: User.role,
        token: generateToken(User._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in LogIn user", error);
  }
};

const AllUsers = async (req, res) => {
  try {
    const AllUsers = await user.find({}).select("-password");
    res.json(AllUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.log("Error in Get All users", error);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const User = await user.findById(req.params.id);
    if (User) {
      User.role = req.body.role || User.role;
      const updateUser = await User.save();
      res.json(updateUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Err:", error);
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  signup,
  login,
  AllUsers,
  updateUserRole,
  logout,
};
