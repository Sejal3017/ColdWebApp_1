const mongoose = require("mongoose");

// User Schema
const userDetailSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
}, {
    collection: "UserInfo",
});

const User = mongoose.model("UserInfo", userDetailSchema);

// Section Schema
const sectionSchema = new mongoose.Schema({
    sectionName: {
      type: String,
      required: true,
    },
    studentNames: {
      type: [String],
      required: true,
    },
    userId: {  // New field to reference the user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  });

const Section = mongoose.model("SectionInfo", sectionSchema);

module.exports = { User, Section }; // Explicitly export models
