const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    date: { type: Date, required: true },
    developer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    registrationMode: {
        type: String,
        default: "approval"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Project", projectSchema);