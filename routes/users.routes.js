// routes/users.routes.js
import express from "express";
const router = express.Router();

// Import sub-routers (Paths adjusted)
import userAuthRoutes from "./userAuth.routes.js";
import blogRoutes from "./blog.routes.js";
import commentRoutes from "./comment.routes.js";

// Mount sub-routers
router.use("/", userAuthRoutes); // Handles /users/dashboard, /users/settings, etc.
router.use("/blogs", blogRoutes); // Handles /users/blogs, /users/blogs/create, /users/blogs/:id, etc.
router.use("/comments", commentRoutes); // Handles /users/comments/:commentId/like

export default router;