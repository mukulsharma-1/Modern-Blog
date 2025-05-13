import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is Required"],
      minlength: [2, "Name has to be 2 or more Characters"],
      maxlength: [50, "Name Can't Exceed more than 50 Characters"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is Required"],
      minlength: [3, "Username has to be 3 or more Characters"],
      maxlength: [50, "Username can't exceed more than 50 Characters"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "Password Must be 5 or more Characters"],
      maxlength: [16, "Password Can't Exceed more than 16 Characters"], // Enforcing length on raw input
    },
    bio: {
      type: String,
    },
    blogs: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Validate raw password length BEFORE hashing
    if (this.isNew && this.password.length > 16) {
      return next(new Error("Password Can't Exceed more than 16 Characters"));
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});


// Method to verify password
userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
