const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Logic
exports.register = async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;

        if (!email && !phone) {
             return res.status(400).json({ message: "Please provide an email or phone number" });
        }

        // 1. Check if user already exists
        const existQuery = [];
        if (email) existQuery.push({ email });
        if (phone) existQuery.push({ phone });
        
        const existingUser = await User.findOne({ $or: existQuery });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone" });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email: email || undefined,
            phone: phone || undefined,
            password: hashedPassword,
            role: role || 'student'
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier) {
            return res.status(400).json({ message: "Please provide an email or phone number" });
        }

        // 1. Check if user exists by email or phone
        const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Compare passwords specifically
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // 3. Create a JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,     
            secure: process.env.NODE_ENV === 'production',      
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        // 4. Return user data (excluding password)
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: "Login successful",
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: "Logged out successfully" });
};



