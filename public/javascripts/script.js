// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // --- Dark mode toggle ---
  const darkModeToggle = document.getElementById("darkModeToggle");
  const sunIcon = document.querySelector("#darkModeToggle svg:first-child");
  const moonIcon = document.querySelector("#darkModeToggle svg:last-child");

  // Function to apply the correct dark mode state and icon visibility
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      // Use CSS classes for icon visibility (hidden/block with dark:)
      // The stroke attributes below are likely redundant if CSS handles colors based on .dark
      if (moonIcon) moonIcon.setAttribute("stroke", "#A0AEC0"); // Silvery moon
      if (sunIcon) sunIcon.setAttribute("stroke", "#FDB813"); // Bright yellow sun
    } else {
      document.documentElement.classList.remove("dark");
      // Use CSS classes for icon visibility
      // The stroke attributes below are likely redundant if CSS handles colors based on .dark
      if (sunIcon) sunIcon.setAttribute("stroke", "#FDB813"); // Sun stays bright yellow
      if (moonIcon) moonIcon.setAttribute("stroke", "#A0AEC0"); // Moon stays silvery gray
    }
  }

  // Initial dark mode check on page load
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.theme;

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    applyDarkMode(true);
  } else {
    applyDarkMode(false);
  }

  // Add event listener to the toggle button
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      // Toggle the dark mode state
      applyDarkMode(!isDarkMode);
      // Save the preference to local storage
      localStorage.theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";

      // Optional: Add checks before logging if icons might not exist on all pages
      if (sunIcon) console.log("Sun color:", sunIcon.getAttribute("stroke"));
      if (moonIcon) console.log("Moon color:", moonIcon.getAttribute("stroke"));
    });
  }

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

      // Toggle 'is-open' class for CSS animation
      mobileMenu.classList.toggle("is-open");

      // Toggle icon visibility
      menuIconOpen.classList.toggle("hidden");
      menuIconClose.classList.toggle("hidden");
    });
  }
  // --- End Hamburger Menu Toggle ---

  // --- Login error clearing on input/focus ---
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailErrorSpan = document.getElementById("emailError");
  const passwordErrorSpan = document.getElementById("passwordError");

  // Function to remove error styling and message
  function clearError(inputElement, errorSpan) {
    if (errorSpan && errorSpan.style.display !== "none") {
      // Only hide if visible
      errorSpan.style.display = "none"; // Hide the error message
    }

    if (inputElement) {
      // Ensure input element exists
      // Remove error classes
      inputElement.classList.remove("border-red-500", "ring-red-500", "ring-2");
      // Add back default border and focus ring classes
      // Check if classes are already present before adding to avoid redundancy
      if (!inputElement.classList.contains("border-gray-300")) {
        inputElement.classList.add("border-gray-300");
      }
      if (!inputElement.classList.contains("focus:ring-primary")) {
        inputElement.classList.add("focus:ring-primary");
      }
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
  // --- End Login error clearing ---

  // --- Footer newsletter form handling ---
  const footerNewsletterForm = document.getElementById("footerNewsletterForm");
  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = e.target.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : ""; // Add check
      if (!email) {
        // Optionally show an error message if email is empty
        alert("Please enter your email address."); // Consider replacing alert
        return; // Stop if email is empty
      }

      try {
        const response = await fetch("/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
          // Attempt to parse JSON error response if available, otherwise use status text
          const errorText = await response.text(); // Get response body as text
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (jsonError) {
            // If not JSON, use the status text or generic message
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        // Replace alert with a modal or message box for better UX
        alert(data.message); // Consider replacing alert
        e.target.reset(); // Clear the form on success
      } catch (error) {
        console.error("Error during newsletter signup:", error);
        // Replace alert with a modal or message box for better UX
        alert("Something went wrong. Please try again. " + error.message); // Show error message
      }
    });
  }
  // --- End Footer newsletter form handling ---

  // --- Registration form handling ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Client-side password match validation (Server-side is also required!)
      if (data.password !== data.confirmPassword) {
        // Replace alert with a modal or message box for better UX
        alert("Passwords do not match!"); // Consider replacing alert
        // Optionally highlight the password fields
        return; // Stop submission
      }

      // NOTE: Client-side validation is for UX. Server-side validation is CRITICAL.
      // The fetch call to the backend registration endpoint should be implemented here.
      try {
        // Example fetch (uncomment and implement server endpoint):
        /*
          const response = await fetch("/register", { // Adjust endpoint if needed
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          // Check if response is ok before trying to parse JSON
           if (!response.ok) {
              const errorText = await response.text();
              let errorMessage = `HTTP error! status: ${response.status}`;
               try {
                   const errorJson = JSON.parse(errorText);
                   // Assuming backend sends validation errors in a 'errors' field or a 'message'
                   errorMessage = errorJson.message || (errorJson.errors ? Object.values(errorJson.errors).map(err => err.msg).join(', ') : errorMessage);
               } catch (jsonError) {
                   errorMessage = response.statusText || errorMessage;
               }
               throw new Error(errorMessage);
           }

          const result = await response.json();
          alert(result.message || "Registration successful!"); // Consider replacing alert
          e.target.reset(); // Clear the form on success
          // Redirect to login or dashboard on success
          // window.location.href = '/login'; // Or dashboard
          */
        console.log("Registration attempt (client-side):", data);
        // Replace alert with a modal or message box for better UX
        alert("Registration functionality will be implemented soon!"); // Consider replacing alert
        e.target.reset(); // Clear the form even if not submitting to backend yet
      } catch (error) {
        console.error("Error during registration (client-side):", error);
        // Replace alert with a modal or message box for better UX
        alert(
          "Something went wrong during registration. Please try again. " +
            error.message
        ); // Show error message
      }
    });
  }
  // --- End Registration form handling ---

  // Login form handling - REMOVED THIS BLOCK (as noted in original code)
  // If you want asynchronous login, you need to reimplement a fetch-based handler here.
  // Otherwise, the form will submit traditionally to the backend POST /login route.

  // --- Add animation to posts ---
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
  // --- End Add animation to posts ---

  // --- Contact form handling ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // NOTE: Add client-side validation for contact form fields if needed.

      try {
        // Here you would typically send the form data to your server
        // Example fetch (uncomment and implement server endpoint):
        /*
          const response = await fetch("/contact", { // Adjust endpoint if needed
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          // Check if response is ok before trying to parse JSON
          if (!response.ok) {
              const errorText = await response.text();
              let errorMessage = `HTTP error! status: ${response.status}`;
               try {
                   const errorJson = JSON.parse(errorText);
                   errorMessage = errorJson.message || errorMessage;
               } catch (jsonError) {
                   errorMessage = response.statusText || errorMessage;
               }
               throw new Error(errorMessage);
           }

           const result = await response.json();
           alert(result.message || "Message sent successfully!"); // Consider replacing alert
           e.target.reset(); // Clear the form on success
          */
        console.log("Contact form submitted (client-side):", data);
        // Replace alert with a modal or message box for better UX
        alert("Thank you for your message! We will get back to you soon."); // Consider replacing alert
        e.target.reset(); // Clear the form even if not submitting to backend yet
      } catch (error) {
        console.error("Error during contact form submission:", error);
        // Replace alert with a modal or message box for better UX
        alert("Something went wrong. Please try again. " + error.message); // Show error message
      }
    });
  }
  // --- End Contact form handling ---

  // --- Add animation to contact sections ---
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
  // --- End Add animation to contact sections ---

  // --- Add animation to team members ---
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
  // --- End Add animation to team members ---

  // --- Attach event listeners for delete buttons on dashboard ---
  // This needs to run after the DOM is loaded, which is handled by DOMContentLoaded
  const deleteButtons = document.querySelectorAll(".delete-blog-button"); // Use the class added in dashboard.ejs
  deleteButtons.forEach((button) => {
    const blogId = button.getAttribute("data-blog-id"); // Get ID from data attribute
    if (blogId) {
      // Ensure blogId exists
      // Remove the inline onclick handler if it still exists (good practice)
      button.onclick = null;
      button.addEventListener("click", (event) => {
        // Prevent default button behavior if it's inside a form or has a default action
        event.preventDefault();
        deleteBlog(blogId);
      });
    }
  });
  // --- End Attach event listeners for delete buttons ---
}); // End DOMContentLoaded

// --- deleteBlog function ---
// Moved the deleteBlog function here from dashboard.ejs for better organization
// It is now accessible globally within script.js
function deleteBlog(blogId) {
  if (confirm("Are you sure you want to delete this blog?")) {
    // Updated the fetch URL to match the users.routes.js delete route
    fetch(`/users/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Include CSRF token header if you are using CSRF protection
        // 'CSRF-Token': 'your-csrf-token'
      },
    })
      .then((response) => {
        // Check if the response status indicates success (e.g., 200, 204)
        if (response.ok) {
          // Optional: Remove the blog element from the DOM for a faster visual update
          // Requires adding id="blog-<%= blog._id %>" to the blog div in dashboard.ejs
          const blogElement = document.getElementById(`blog-${blogId}`);
          if (blogElement) {
            blogElement.remove();
          } else {
            // If element not found or not using the ID, fall back to reload
            window.location.reload();
          }
        } else {
          // Handle non-OK HTTP responses (e.g., 404, 403, 500)
          // Attempt to parse JSON error response from backend
          return response.text().then((text) => {
            // Get response body as text first
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
              const errorJson = JSON.parse(text);
              errorMessage = errorJson.message || errorMessage;
            } catch (jsonError) {
              // If not JSON, use the status text or a generic message
              errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage); // Throw an error to be caught by the catch block
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        // Replace alert with a modal or message box for better UX
        alert("Failed to delete blog. Please try again. " + error.message); // Show error message
      });
  }
}
// --- End deleteBlog function ---
