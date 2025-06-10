// models/blogs.models.js
import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [2, "Blog title has to be 2 or more Characters"],
      maxlength: [100, "Blog title can't exceed 100 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: [2, "Blog Content has to be 2 or more Characters"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);

export default Blog;
