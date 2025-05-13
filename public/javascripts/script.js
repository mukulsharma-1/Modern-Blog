// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const sunIcon = document.querySelector("#darkModeToggle svg:first-child");
const moonIcon = document.querySelector("#darkModeToggle svg:last-child");

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  moonIcon.setAttribute("stroke", "#A0AEC0"); // Set moon color in dark mode
  sunIcon.setAttribute("stroke", "#FDB813"); // Ensure sun color remains correct
} else {
  document.documentElement.classList.remove("dark");
  sunIcon.setAttribute("stroke", "#FDB813"); // Set sun color in light mode
  moonIcon.setAttribute("stroke", "#A0AEC0"); // Ensure moon color remains correct
}

darkModeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  const isDarkMode = document.documentElement.classList.contains("dark");
  localStorage.theme = isDarkMode ? "dark" : "light";

  // Force color updates
  if (isDarkMode) {
    moonIcon.setAttribute("stroke", "#A0AEC0"); // Silvery moon
    sunIcon.setAttribute("stroke", "#FDB813"); // Bright yellow sun
  } else {
    sunIcon.setAttribute("stroke", "#FDB813"); // Sun stays bright yellow
    moonIcon.setAttribute("stroke", "#A0AEC0"); // Moon stays silvery gray
  }

  console.log("Sun color:", sunIcon.getAttribute("stroke"));
  console.log("Moon color:", moonIcon.getAttribute("stroke"));
});

// Footer newsletter form handling
const footerNewsletterForm = document.getElementById("footerNewsletterForm");
footerNewsletterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  try {
    const response = await fetch("/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    alert(data.message);
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// Registration form handling
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Validate passwords match
  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Here you would typically send the registration data to your server
    console.log("Registration attempt:", data);
    alert("Registration functionality will be implemented soon!");
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// Login form handling
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    // Here you would typically send the login data to your server
    console.log("Login attempt:", data);
    alert("Login functionality will be implemented soon!");
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// Add animation to posts
document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll("article");
  posts.forEach((post, index) => {
    post.style.opacity = "0";
    post.style.transform = "translateY(20px)";
    setTimeout(() => {
      post.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      post.style.opacity = "1";
      post.style.transform = "translateY(0)";
    }, index * 100);
  });
});

// Contact form handling
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    // Here you would typically send the form data to your server
    console.log("Form submitted:", data);
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// Add animation to contact sections
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  sections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    setTimeout(() => {
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }, index * 200);
  });
});

// Add animation to team members
document.addEventListener("DOMContentLoaded", () => {
  const teamMembers = document.querySelectorAll(".text-center");
  teamMembers.forEach((member, index) => {
    member.style.opacity = "0";
    member.style.transform = "translateY(20px)";
    setTimeout(() => {
      member.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      member.style.opacity = "1";
      member.style.transform = "translateY(0)";
    }, index * 200);
  });
});
