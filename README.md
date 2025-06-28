# Modern Blog Website

A modern, responsive blog website built with EJS, Express, and TailwindCSS. Features include dark mode, glassmorphic design, and interactive animations.


## 🆕 Major Updates (as of June 28, 2025)

- **Project Structure Overhaul:**  
  Modularized folders for models, routes, middleware, and public assets.
- **Database Integration:**  
  Switched to MongoDB with Mongoose for data storage and modeling.
- **User Authentication:**  
  Added registration, login, password change, and session management using `express-session`, `connect-mongo`, and `bcryptjs`.
- **Blog & Comment System:**  
  Users can create, edit, and delete blogs; comment functionality added.
- **Error Handling:**  
  Custom 404 and 500 error pages.
- **Environment Variables:**  
  Uses `.env` for configuration via `dotenv`.
- **Modern Frontend:**  
  TailwindCSS for styling, with assets organized in `public/`.
- **Development Tools:**  
  Uses `nodemon` for development.

---

## Features

- User registration, login, and authentication
- Create, edit, delete blog posts
- Comment on blogs
- User dashboard and settings
- Responsive UI with TailwindCSS
- Session management with MongoDB
- Error handling (404, 500)
- Modular codebase for scalability

---

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

---

## Installation

1. **Clone the repository:**
   ```powershell
   git clone <repository-url>
   cd "08. Modern-Blog"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```
   Or for production:
   ```powershell
   npm start
   ```

5. **Open in browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---
## Project Structure

```
08. Modern-Blog/
├── dbconnection.js
├── package.json
├── README.md
├── server.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── blogs.models.js
│   ├── comments.models.js
│   └── users.models.js
├── public/
│   ├── images/
│   ├── javascripts/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── script.js
├── routes/
│   ├── auth.js
│   ├── blog.routes.js
│   ├── comment.routes.js
│   ├── index.routes.js
│   ├── userAuth.routes.js
│   └── users.routes.js
├── views/
│   ├── about.ejs
│   ├── contact.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── errors/
│   │   ├── 404.ejs
│   │   └── 500.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   └── users/
│       ├── blog_list.ejs
│       ├── change-password.ejs
│       ├── createBlogs.ejs
│       ├── dashboard.ejs
│       ├── settings.ejs
│       └──

## Technologies & Dependencies

- Node.js, Express.js
- MongoDB, Mongoose
- EJS (templating)
- TailwindCSS, PostCSS, Autoprefixer
- bcryptjs (password hashing)
- express-session, connect-mongo (sessions)
- dotenv (environment variables)
- nodemon (development)
- @heroicons/react, framer-motion (UI/UX enhancements)

---

## Customization

- **Add new pages:**  
  Create `.ejs` files in `views/` and add routes in `routes/`.
- **Modify styles:**  
  Edit Tailwind classes in EJS files or add custom CSS in `public/`.

---

### Adding New Pages

1. Create a new `.ejs` file in the `views` directory
2. Include the header and footer partials
3. Add the route in `server.js`

### Modifying Styles

The website uses TailwindCSS for styling. You can modify the styles by:

1. Editing the Tailwind configuration in the header partial
2. Adding custom CSS in the style tags
3. Modifying the Tailwind classes in the EJS files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---
## Acknowledgments

- TailwindCSS for the utility-first CSS framework
- EJS for the templating engine
- Express.js for the web framework 