// routes/blog.routes.js
import express from "express";
import User from "../models/users.models.js"; // Path adjusted
import Blog from "../models/blogs.models.js"; // Path adjusted
import Comment from "../models/comments.models.js"; // Path adjusted
import isAuthenticated from "../middleware/auth.middleware.js"; // Path adjusted

const router = express.Router();

// ... (Rest of the code for blog routes: /, /create, /:id, /:id/like, /:id/comments, /:id/edit, /:id/delete)
// Make sure all imports use the adjusted relative paths from `routes/` to `../models/` and `../middleware/`.

// List All Blogs by Any User (Mounted as /users/blogs)
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
      .populate("author", "username _id")
      .sort({ createdAt: -1 });

    res.render("users/blog_list", {
      title: "All Blogs",
      blogs: blogs || [],
      user: req.session.userData || null,
    });
  } catch (error) {
    next(error);
  }
});

// Create Blog (GET - Mounted as /users/blogs/create)
router.get("/create", isAuthenticated, (req, res) => {
  const error = req.session.blogError || null;
  req.session.blogError = null;

  res.render("users/createBlogs", {
    title: "Create Blog",
    error,
    user: req.session.userData || null,
  });
});

// Publish Blog (POST - Mounted as /users/blogs/create)
router.post("/create", isAuthenticated, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      req.session.blogError = "Title and Content are required";
      return res.redirect("/users/blogs/create");
    }

    const newBlog = new Blog({ title, content, author: req.session.userid });
    await newBlog.save();

    await User.findByIdAndUpdate(req.session.userid, {
      $push: { blogs: newBlog._id },
    });

    res.redirect(`/users/blogs/${newBlog._id}`);
  } catch (error) {
    console.error("Blog Creation Error:", error);
    next(error);
  }
});

// View Blog Details (Includes Comments - Mounted as /users/blogs/:id)
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username _id")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username _id",
        },
      });

    if (!blog)
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
        user: req.session.userData || null,
      });

    blog.views += 1;
    await blog.save();

    res.render("users/views", {
      title: blog.title,
      blog,
      user: req.session.userData || null,
      userLoggedIn: req.session.userid ? true : false,
    });
  } catch (error) {
    next(error);
  }
});

// Toggle Blog Like/Unlike (Mounted as /users/blogs/:id/like)
router.post("/:id/like", isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

    const userId = req.session.userid;
    const userLikedIndex = blog.likedBy.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (userLikedIndex > -1) {
      blog.likedBy.splice(userLikedIndex, 1);
    } else {
      blog.likedBy.push(userId);
    }
    await blog.save();
    res.redirect(`/users/blogs/${req.params.id}`);
  } catch (error) {
    console.error("Error toggling blog like:", error);
    res.redirect(req.header("Referer") || "/users/blogs");
  }
});

// Add Comment (Mounted as /users/blogs/:id/comments)
router.post("/:id/comments", isAuthenticated, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.redirect(`/users/blogs/${req.params.id}#comments-section`);
    }

    const comment = new Comment({
      content,
      user: req.session.userid,
      blog: req.params.id,
    });
    await comment.save();

    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.comments.push(comment._id);
      await blog.save();
    }

    res.redirect(`/users/blogs/${req.params.id}#comments-section`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.redirect(
      req.header("Referer") || `/users/blogs/${req.params.id}#comments-section`
    );
  }
});

// Edit Blog (GET - Mounted as /users/blogs/:id/edit)
router.get("/:id/edit", isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "_id");

    if (!blog) {
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
        user: req.session.userData || null,
      });
    }

    if (blog.author._id.toString() !== req.session.userid.toString()) {
      return res.status(403).render("errors/403", {
        title: "Unauthorized Access",
        message: "You are not authorized to edit this blog.",
        user: req.session.userData || null,
      });
    }

    res.render("users/edit_blog", {
      title: `Edit: ${blog.title}`,
      blog,
      error: null,
      user: req.session.userData || null,
    });
  } catch (error) {
    next(error);
  }
});

// Update Blog (POST - Mounted as /users/blogs/:id/edit)
router.post("/:id/edit", isAuthenticated, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id).populate("author", "_id");

    if (!blog) {
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
        user: req.session.userData || null,
      });
    }

    if (blog.author._id.toString() !== req.session.userid.toString()) {
      return res.status(403).render("errors/403", {
        title: "Unauthorized Access",
        message: "You are not authorized to update this blog.",
        user: req.session.userData || null,
      });
    }

    if (!title || !content) {
      return res.render("users/edit_blog", {
        title: `Edit: ${blog.title}`,
        blog,
        error: "Title and Content are required",
        user: req.session.userData || null,
      });
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    res.redirect(`/users/blogs/${blog._id}`);
  } catch (error) {
    next(error);
  }
});

// Delete Blog (POST - Mounted as /users/blogs/:id/delete)
router.post("/:id/delete", isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "_id");

    if (!blog) {
      return res.status(404).render("errors/404", {
        title: "Blog Not Found",
        requestedUrl: req.originalUrl,
        user: req.session.userData || null,
      });
    }

    if (blog.author._id.toString() !== req.session.userid.toString()) {
      return res.status(403).render("errors/403", {
        title: "Unauthorized Access",
        message: "You are not authorized to delete this blog.",
        user: req.session.userData || null,
      });
    }

    await Comment.deleteMany({ blog: blog._id });

    await User.findByIdAndUpdate(blog.author._id, {
      $pull: { blogs: blog._id },
    });

    await Blog.deleteOne({ _id: blog._id });

    res.redirect("/users/dashboard");
  } catch (error) {
    next(error);
  }
});

export default router;
