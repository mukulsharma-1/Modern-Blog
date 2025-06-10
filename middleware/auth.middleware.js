// middleware/auth.middleware.js
import User from "../models/users.models.js"; // Path adjusted

const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userid) {
    console.log("Session Missing - Redirecting to /login");
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }

  if (!req.session.userData || !req.session.userData._id) {
    User.findById(req.session.userid)
      .select("username email _id")
      .then((user) => {
        if (!user) {
          req.session.destroy(() => {
            res.clearCookie("connect.sid");
            return res.redirect("/login");
          });
        }
        req.session.userData = user;
        next();
      })
      .catch((err) => {
        console.error("Error fetching user data for session:", err);
        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          res.redirect("/login");
        });
      });
  } else {
    next();
  }
};

export default isAuthenticated;
