const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    userReference: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    projectReference: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: true 
    },

    registrationStatus: { 
        type: String, 
        enum: ["pending", "confirmed", "removed"], 
        default: "pending" 
    }
},
{
    timestamps: true
}
);

// User cant register more than once
registrationSchema.index(
    {
    userReference: 1,
    projectReference: 1
    }, 
    { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);