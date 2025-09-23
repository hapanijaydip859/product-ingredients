import mongoose from "mongoose";

const allergyOptions = ["Nuts", "Dairy", "Shellfish", "None"];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  allergies: {
    type: [String],
    enum: allergyOptions,
    default: ["None"],
  },

}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;
