// routes/userAuth.routes.js
import express from "express";
import User from "../models/users.models.js"; // Path adjusted
import bcrypt from "bcryptjs";
import isAuthenticated from "../middleware/auth.middleware.js"; // Path adjusted

const router = express.Router();

// ... (Rest of the code for dashboard, settings, change-password, logout, profile/:id, test-session)
// Make sure all imports use the adjusted relative paths from `routes/` to `../models/` and `../middleware/`.
// The content will be the same as previously provided, just verify paths.

// Dashboard Route
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

// Account Settings (GET)
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

// Account Settings (POST)
router.post("/settings", isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userid,
      { username, email, bio },
      { new: true, runValidators: true }
    );

    req.session.userData = updatedUser;

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

// Change Password (GET)
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

// Change Password (POST)
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

// Logout
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

// View User Profile
router.get("/profile/:id", isAuthenticated, async (req, res, next) => {
  try {
    const profileUser = await User.findById(req.params.id).populate("blogs");

    if (!profileUser) {
      return res.status(404).render("errors/404", {
        title: "User Not Found",
        requestedUrl: req.originalUrl,
        user: req.session.userData || null,
      });
    }

    res.render("users/profile", {
      title: `${profileUser.username}'s Profile`,
      profileUser: profileUser,
      currentUser: req.session.userData || null,
      blogs: profileUser.blogs || [],
    });
  } catch (error) {
    next(error);
  }
});

// Verify Session Persistence (for debugging)
router.get("/test-session", (req, res) => {
  console.log("Testing session persistence...");
  res.json({ sessionData: req.session });
});

export default router;
