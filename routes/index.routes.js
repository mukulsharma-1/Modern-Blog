import express from "express";
import User from "../models/users.models.js";

const router = express.Router();

// Middleware: Ensure user session data is available in views
router.use((req, res, next) => {
  res.locals.user = req.session.userData || null;
  next();
});

// Middleware: Restrict access for logged-in users
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userid) {
    return res.redirect("/users/dashboard");
  }
  next();
};

// **Home Page**
router.get("/", async (req, res, next) => {
  try {
    res.render("index", {
      title: "Home",
      posts: [
        {
          title: "Getting Started with Web Development",
          excerpt:
            "Learn the basics of web development and start your journey...",
          date: "2024-03-15",
          author: "John Doe",
        },
        {
          title: "The Future of AI in Web Development",
          excerpt:
            "Exploring how artificial intelligence is shaping the future of web development...",
          date: "2024-03-14",
          author: "Jane Smith",
        },
      ],
    });
  } catch (error) {
    next(error);
  }
});

// **About & Contact Pages**
router.get("/about", async (req, res, next) => {
  try {
    res.render("about", { title: "About" });
  } catch (error) {
    next(error);
  }
});

router.get("/contact", async (req, res, next) => {
  try {
    res.render("contact", { title: "Contact" });
  } catch (error) {
    next(error);
  }
});

// **Login (GET)**
router.get("/login", redirectIfAuthenticated, async (req, res, next) => {
  try {
    res.render("login", { title: "Login" });
  } catch (error) {
    next(error);
  }
});

// **Login (POST)**
router.post("/login", redirectIfAuthenticated, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData || !(await userData.verifyPassword(password))) {
      return res.render("login", {
        title: "Login",
        error: "Invalid email or password",
      });
    }

    // Set session details
    req.session.userid = userData._id;
    req.session.userData = {
      fullname: userData.fullname,
      username: userData.username,
    };

    req.session.save((err) => {
      if (err) console.error("Session Save Error:", err);
      res.redirect("/users/dashboard");
    });
  } catch (error) {
    next(error);
  }
});



// **Registration (GET)**
router.get("/register", redirectIfAuthenticated, async (req, res, next) => {
  try {
    res.render("register", { title: "Register" });
  } catch (error) {
    next(error);
  }
});

// **Registration (POST)**
router.post("/register", redirectIfAuthenticated, async (req, res, next) => {
  try {
    const { fullname, username, email, password, blogs } = req.body;
    const newUser = new User({ fullname, username, email, password, blogs });

    const createdUser = await newUser.save();
    if (!createdUser) throw new Error("User registration failed");

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

// **Redirect /users to dashboard**
router.get("/users", async (req, res, next) => {
  try {
    res.redirect("/users/dashboard");
  } catch (error) {
    next(error);
  }
});

// **Newsletter Signup**
router.post("/newsletter", async (req, res, next) => {
  try {
    console.log("New newsletter signup:", req.body.email);
    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    next(error);
  }
});

export default router;
