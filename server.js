import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from "./routes/index.routes.js"
import usersRouter from "./routes/users.routes.js"
import dotenv from "dotenv"
import databaseConnection from './dbconnection.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { console } from 'inspector';

// Dotenv Configuration 
dotenv.config()
// DataBase Configuration 
databaseConnection()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.COOKIE_SEC?.toLocaleLowerCase() === "true",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Routes
app.use("/", indexRoutes)
app.use("/users", usersRouter)

// Error Handling-404
app.use((req, res) => {
  console.log("404 Triggered. Requested URL:", req.originalUrl); // Debugging
  res
    .status(404)
    .render("errors/404", {
      title: "Page Not Found",
      requestedUrl: req.originalUrl,
    });
});

// Error Handling-500
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res
    .status(500)
    .render("errors/500", {
      title: "Server Error",
      errorMessage: err.message || "Unknown error",
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 