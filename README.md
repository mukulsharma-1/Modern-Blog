# Modern Blog Website

A modern, responsive blog website built with EJS, Express, and TailwindCSS. Features include dark mode, glassmorphic design, and interactive animations.

## Features

- 🎨 Modern and clean design with glassmorphic elements
- 🌓 Dark mode support
- 📱 Fully responsive for mobile and tablet devices
- ✨ Smooth animations and transitions
- 📧 Newsletter signup functionality
- 📝 Blog post display
- 👥 Team section
- 📞 Contact form
- 🔗 Social media integration

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modern-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Project Structure

```
modern-blog/
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── about.ejs
│   └── contact.ejs
├── public/
│   └── css/
├── server.js
├── package.json
└── README.md
```

## Technologies Used

- EJS (Embedded JavaScript)
- Express.js
- TailwindCSS
- Node.js
- JavaScript (ES6+)

## Customization

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

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TailwindCSS for the utility-first CSS framework
- EJS for the templating engine
- Express.js for the web framework 