import express from "express";
import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import Blog from "../models/blogs.models.js";
import Comment from "../models/comments.models.js";

const router = express.Router();

// Middleware: Require authentication before actions
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userid) {
    return res.redirect("/login");
  }
  next();
};

// **Dashboard Route Fix**
router.get("/dashboard", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userid).populate("blogs");

    if (!user) {
      return res.redirect("/login");
    }

    res.render("users/dashboard", {
      title: "Dashboard",
      user,
      blogs: user.blogs || [],
    });
  } catch (error) {
    next(error);
  }
});

// **Account Settings (GET)**
router.get("/settings", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userid);
    if (!user) return res.redirect("/login");

    res.render("users/settings", {
      title: "Account Settings",
      user,
      error: null,
      success: null,
    });
  } catch (error) {
    next(error);
  }
});

// **Account Settings (POST)**
router.post("/settings", isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userid,
      { username, email, bio },
      { new: true, runValidators: true }
    );

    res.render("users/settings", {
      title: "Account Settings",
      user: updatedUser,
      success: "Account updated successfully!",
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// **Change Password (GET)**
router.get("/change-password", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userid);
    if (!user) return res.redirect("/login");

    res.render("users/change-password", {
      title: "Change Password",
      user,
      error: null,
      success: null,
    });
  } catch (error) {
    next(error);
  }
});

// **Change Password (POST)**
router.post("/change-password", isAuthenticated, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session.userid);

    if (!user)
      return res.render("users/change-password", {
        title: "Change Password",
        user,
        error: "User not found",
        success: null,
      });

    if (!(await user.verifyPassword(currentPassword))) {
      return res.render("users/change-password", {
        title: "Change Password",
        user,
        error: "Current password is incorrect",
        success: null,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.render("users/change-password", {
        title: "Change Password",
        user,
        error: "Passwords do not match",
        success: null,
      });
    }

    if (newPassword.length > 16) {
      return res.render("users/change-password", {
        title: "Change Password",
        user,
        error: "Password must not exceed 16 characters",
        success: null,
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save({ validateBeforeSave: false });

    res.render("users/change-password", {
      title: "Change Password",
      user,
      error: null,
      success: "Password updated successfully!",
    });
  } catch (error) {
    next(error);
  }
});

// **Logout**
router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  } catch (error) {
    next(error);
  }
});


// **Create Blog (GET)**
router.get("/blogs/create", isAuthenticated, (req, res) => {
  // Retrieve error from session if it exists
  const error = req.session.blogError || null;
  req.session.blogError = null; // Clear error after passing it

  res.render("users/createBlogs", { title: "Create Blog", error });
});

// **Publish Blog (POST)**
router.post("/blogs/create", isAuthenticated, async (req, res, next) => {
  try {
      const { title, content } = req.body;
      if (!title || !content) {
          req.session.blogError = "Title and Content are required"; // Store error in session
          return res.redirect("/users/blogs/create"); // Redirect back
      }

      const newBlog = new Blog({ title, content, author: req.session.userid });
      await newBlog.save();
      res.redirect(`/users/blogs/${newBlog._id}`);
  } catch (error) {
      console.error("Blog Creation Error:", error);
      next(error);
  }
});


// **View Blog Details (Includes Comments)**
router.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author")
      .populate("comments");

    if (!blog)
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
      });

    blog.views += 1;
    await blog.save();

    res.render("users/view", { title: blog.title, blog });
  } catch (error) {
    next(error);
  }
});

// **Like a Blog**
router.post("/:id/like", isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
      });

    blog.likes += 1;
    await blog.save();

    res.redirect(`/users/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

// **Add Comment**
router.post("/:id/comments", isAuthenticated, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.redirect(`/users/${req.params.id}`);

    const comment = new Comment({
      content,
      user: req.session.userid,
      blog: req.params.id,
    });
    await comment.save();

    const blog = await Blog.findById(req.params.id);
    blog.comments.push(comment._id);
    await blog.save();

    res.redirect(`/users/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

// **Verify Session Persistence**
router.get("/test-session", (req, res) => {
  console.log("Testing session persistence...");
  res.json({ sessionData: req.session });
});

export default router;
