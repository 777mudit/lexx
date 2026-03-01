import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['officer', 'admin', 'lawyer', 'judge'], 
    default: 'officer' 
  },
  badgeId: { type: String }
});


// 🔐 Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash if password is modified (or new)
  if (!this.isModified("password")) {
    return;
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});


// 🔎 Method to compare password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model("User", UserSchema);