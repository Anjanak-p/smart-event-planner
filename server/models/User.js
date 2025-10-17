import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please add a name"] 
  },
  email: { 
    type: String, 
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Please add a password"],
    minlength: 6
  }
}, {
  timestamps: true
});

// Add index for better query performance
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);