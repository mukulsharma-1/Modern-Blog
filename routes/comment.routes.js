// routes/comment.routes.js
import express from "express";
import Comment from "../models/comments.models.js"; // Path adjusted
import isAuthenticated from "../middleware/auth.middleware.js"; // Path adjusted

const router = express.Router();

// Toggle Comment Like/Unlike (Mounted as /users/comments/:commentId/like)
router.post("/:commentId/like", isAuthenticated, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      console.error(
        "Comment not found for like operation:",
        req.params.commentId
      );
      return res.redirect(req.header("Referer") || "/users/blogs");
    }

    const userId = req.session.userid;
    const userLikedIndex = comment.likedBy.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (userLikedIndex > -1) {
      comment.likedBy.splice(userLikedIndex, 1);
    } else {
      comment.likedBy.push(userId);
    }
    await comment.save();

    res.redirect(`/users/blogs/${comment.blog}`);
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.redirect(req.header("Referer") || "/users/blogs");
  }
});

export default router;
