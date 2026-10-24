const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ userName }, { email}]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        req.session.userId = user._id;

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const logout = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Error destroying session:", error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }

        res.clearCookie("connect.sid");
        
        res.json({
            message: "Logout successful"
        });
    });
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select("-password");
        // ^ .select("-password") to prevent password from being included in the response
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error fetching current user:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = { register, login, logout, getCurrentUser };