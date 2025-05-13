import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      minlength: [2, "Comments must have at least 2 characters"],
      maxlength: [200, "Comments must not exceed 200 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    status: {
      // Added for moderation or soft deletion
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    likes: {
      // Added for engagement tracking
      type: Number,
      default: 0,
    },
    replies: [
      {
        // Added for nested replies
        type: Schema.Types.ObjectId,
        ref: "Comment", // References itself for replies
      },
    ],
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
