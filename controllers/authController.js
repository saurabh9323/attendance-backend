const User = require("../models/user");
const { formatDate, formatTime } = require("../utils/format");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    let { username, password, email, phone, role } = req.body;
    username = username.replace(/\s+$/, "");
    email = email.replace(/\s+$/, "");

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const createDate = new Date();
    const formattedDate = formatDate(createDate);
    const formattedTime = formatTime(createDate);
    const user = new User({
      username,
      password: hashedpassword,
      email,
      phone,
      role,
      createDate: `${formattedDate} ${formattedTime}`,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.replace(/\s+$/, "");

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        phone: user.phone,
        email: user.email,
        createDate: user.createDate,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry
    });

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
