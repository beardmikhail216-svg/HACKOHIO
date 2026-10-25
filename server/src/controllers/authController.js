const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
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
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }
        console.error("Error registering user:", error);
        
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


const login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email?.trim().toLowerCase();

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

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Wait for the old session to be regenerated.
        req.session.regenerate((err) => {
            if (err) {
                console.error("Error regenerating session:", err);
                return res.status(500).json({
                    message: "Could not create a session"
                });
            }

            // Set the ID on the new session.
            req.session.userId = user._id.toString();

            // Wait until the session is stored before responding.
            req.session.save((saveError) => {
                if (saveError) {
                    console.error("Error saving session:", saveError);
                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user._id,
                        userName: user.userName,
                        email: user.email,
                        role: user.role,
                        languages: user.languages,
                        frameworks: user.frameworks,
                        databases: user.databases,
                        interests: user.interests,
                        avatarIcon: user.avatarIcon,
                        avatarColor: user.avatarColor,
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error logging in user:", error);

        return res.status(500).json({
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
            // return res.status(404).json({
            //     message: "User not found"
            // });
            return req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.status(401).json({
                    message: "User not found"
                });
            });
        }

        res.json({
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                languages: user.languages,
                frameworks: user.frameworks,
                databases: user.databases,
                interests: user.interests,
                avatarIcon: user.avatarIcon,
                avatarColor: user.avatarColor,
            }
        });
    } catch (error) {
        console.error("Error fetching current user:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      userName,
      email,
      languages,
      frameworks,
      databases,
      interests,
      avatarIcon,
      avatarColor,
    } = req.body;

    if (typeof userName !== "string" || !userName.trim()) {
      return res.status(400).json({
        message: "Username is required.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedUserName = userName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    const duplicate = await User.findOne({
      _id: { $ne: user._id },
      $or: [
        { userName: normalizedUserName },
        { email: normalizedEmail },
      ],
    });

    if (duplicate) {
      return res.status(409).json({
        message: "That username or email is already in use.",
      });
    }

    const allowedIcons = [
      "user",
      "code",
      "rocket",
      "gamepad",
      "brain",
      "palette",
    ];

    const allowedColors = [
      "blue",
      "purple",
      "green",
      "orange",
      "pink",
      "gray",
    ];

    const validateArray = (value, fieldName) => {
      if (value === undefined) return true;

      if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === "string")
      ) {
        return false;
      }

      return true;
    };

    for (const [value, fieldName] of [
      [languages, "languages"],
      [frameworks, "frameworks"],
      [databases, "databases"],
      [interests, "interests"],
    ]) {
      if (!validateArray(value, fieldName)) {
        return res.status(400).json({
          message: `${fieldName} must be an array of strings.`,
        });
      }
    }

    if (
      avatarIcon !== undefined &&
      !allowedIcons.includes(avatarIcon)
    ) {
      return res.status(400).json({
        message: "Invalid avatar icon.",
      });
    }

    if (
      avatarColor !== undefined &&
      !allowedColors.includes(avatarColor)
    ) {
      return res.status(400).json({
        message: "Invalid avatar color.",
      });
    }

    user.userName = normalizedUserName;
    user.email = normalizedEmail;

    if (languages !== undefined) user.languages = languages;
    if (frameworks !== undefined) user.frameworks = frameworks;
    if (databases !== undefined) user.databases = databases;
    if (interests !== undefined) user.interests = interests;
    if (avatarIcon !== undefined) user.avatarIcon = avatarIcon;
    if (avatarColor !== undefined) user.avatarColor = avatarColor;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        languages: user.languages,
        frameworks: user.frameworks,
        databases: user.databases,
        interests: user.interests,
        avatarIcon: user.avatarIcon,
        avatarColor: user.avatarColor,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That username or email is already in use.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Error updating profile:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, logout, getCurrentUser, updateProfile };