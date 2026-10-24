const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    skills: { type: [String], required: true },
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);