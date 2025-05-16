document.addEventListener("DOMContentLoaded", () => {
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

  if (darkModeToggle) { // Add check to ensure toggle exists
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
  }


  // Footer newsletter form handling
  const footerNewsletterForm = document.getElementById("footerNewsletterForm");
  if (footerNewsletterForm) { // Add check to ensure form exists
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
          // Replace alert with a modal or message box for better UX
          alert(data.message); // Consider replacing alert
          e.target.reset();
        } catch (error) {
          console.error("Error:", error);
          // Replace alert with a modal or message box for better UX
          alert("Something went wrong. Please try again."); // Consider replacing alert
        }
      });
  }


  // hamburger-menu
  // --- Hamburger Menu Toggle ---
  const hamburgerButton = document.getElementById("hamburgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIconOpen = document.getElementById("menuIconOpen");
  const menuIconClose = document.getElementById("menuIconClose");

  if (hamburgerButton && mobileMenu && menuIconOpen && menuIconClose) {
    hamburgerButton.addEventListener("click", () => {
      const isExpanded =
        hamburgerButton.getAttribute("aria-expanded") === "true" || false;
      hamburgerButton.setAttribute("aria-expanded", !isExpanded);

      // Toggle visibility and animation classes
      if (isExpanded) {
        // Close menu
        mobileMenu.classList.add("max-h-0", "opacity-0");
        mobileMenu.classList.remove(
          "max-h-screen",
          "opacity-100",
          "pt-2",
          "pb-3"
        ); // Use max-h-screen or a specific large enough value

        menuIconOpen.classList.remove("hidden");
        menuIconClose.classList.add("hidden");
      } else {
        // Open menu
        mobileMenu.classList.remove("max-h-0", "opacity-0");
        mobileMenu.classList.add("max-h-screen", "opacity-100", "pt-2", "pb-3");

        menuIconOpen.classList.add("hidden");
        menuIconClose.classList.remove("hidden");
      }
    });
  }
  // --- End Hamburger Menu Toggle ---

  // Login error clearing on input/focus
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailErrorSpan = document.getElementById("emailError");
  const passwordErrorSpan = document.getElementById("passwordError");

  // Function to remove error styling and message
  function clearError(inputElement, errorSpan) {
    if (errorSpan) {
      // Check if the error span exists
      errorSpan.style.display = "none"; // Hide the error message
    }

    // Remove error classes and add default focus classes
    inputElement.classList.remove(
      "border-red-500",
      "ring-red-500",
      "ring-2"
    );
    // Assuming 'border-gray-300' and 'focus:ring-primary' are your defaults
    // Add back the default border and focus ring classes only if they are not already present
    if (!inputElement.classList.contains('border-gray-300')) {
         inputElement.classList.add("border-gray-300");
    }
     if (!inputElement.classList.contains('focus:ring-primary')) {
         inputElement.classList.add("focus:ring-primary");
    }
  }

  // Add event listener for input on email field
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      clearError(emailInput, emailErrorSpan);
    });
    // Also clear on focus in case there's a pre-filled error without interaction
    emailInput.addEventListener("focus", function () {
      clearError(emailInput, emailErrorSpan);
    });
  }

  // Add event listener for input on password field
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      clearError(passwordInput, passwordErrorSpan);
    });
    // Also clear on focus
    passwordInput.addEventListener("focus", function () {
      clearError(passwordInput, passwordErrorSpan);
    });
  }


  //---CAUTION: NEEDS BUGS FIXING AFTER THIS BELOW---

  // Registration form handling
  const registerForm = document.getElementById("registerForm");
  if (registerForm) { // Add check to ensure form exists
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Validate passwords match
        if (data.password !== data.confirmPassword) {
          // Replace alert with a modal or message box for better UX
          alert("Passwords do not match!"); // Consider replacing alert
          return;
        }

        try {
          // Here you would typically send the registration data to your server
          console.log("Registration attempt:", data);
          // Replace alert with a modal or message box for better UX
          alert("Registration functionality will be implemented soon!"); // Consider replacing alert
          e.target.reset();
        } catch (error) {
          console.error("Error:", error);
          // Replace alert with a modal or message box for better UX
          alert("Something went wrong. Please try again."); // Consider replacing alert
        }
      });
  }

  // Login form handling - REMOVED THIS BLOCK

  // Add animation to posts
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


  // Contact form handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) { // Add check to ensure form exists
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
          // Here you would typically send the form data to your server
          console.log("Form submitted:", data);
          // Replace alert with a modal or message box for better UX
          alert("Thank you for your message! We will get back to you soon."); // Consider replacing alert
          e.target.reset();
        } catch (error) {
          console.error("Error:", error);
          // Replace alert with a modal or message box for better UX
          alert("Something went wrong. Please try again."); // Consider replacing alert
        }
      });
  }


  // Add animation to contact sections
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


  // Add animation to team members
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
