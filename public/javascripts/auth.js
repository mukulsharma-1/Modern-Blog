// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.querySelector('form');
    if (!form) return;

    // Get all required inputs
    const requiredInputs = form.querySelectorAll('[required]');
    const submitButton = form.querySelector('button[type="submit"]');

    // Add input event listeners for real-time validation
    requiredInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            updateSubmitButton();
        });

        input.addEventListener('blur', function() {
            validateInput(this);
            updateSubmitButton();
        });
    });

    // Password validation for registration and change password forms
    const passwordInput = form.querySelector('input[type="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput, this);
            updateSubmitButton();
        });
    }

    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        requiredInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Additional password validation for registration and change password
        if (passwordInput && confirmPasswordInput) {
            if (!validatePasswordMatch(passwordInput, confirmPasswordInput)) {
                isValid = false;
            }
        }

        if (isValid) {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
            
            // Submit the form
            this.submit();
        }
    });
});

// Input validation function
function validateInput(input) {
    const errorElement = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : createErrorElement(input);

    if (!input.value.trim()) {
        showError(input, errorElement, 'This field is required');
        return false;
    }

    if (input.type === 'email' && !isValidEmail(input.value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    }

    if (input.type === 'password' && input.value.length < 6) {
        showError(input, errorElement, 'Password must be at least 6 characters long');
        return false;
    }

    if (input.name === 'username' && input.value.length < 3) {
        showError(input, errorElement, 'Username must be at least 3 characters long');
        return false;
    }

    hideError(input, errorElement);
    return true;
}

// Password match validation
function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    const errorElement = confirmPasswordInput.nextElementSibling?.classList.contains('error-message')
        ? confirmPasswordInput.nextElementSibling
        : createErrorElement(confirmPasswordInput);

    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, errorElement, 'Passwords do not match');
        return false;
    }

    hideError(confirmPasswordInput, errorElement);
    return true;
}

// Helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createErrorElement(input) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message text-red-500 text-sm mt-1';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    return errorElement;
}

function showError(input, errorElement, message) {
    input.classList.add('border-red-500');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(input, errorElement) {
    input.classList.remove('border-red-500');
    errorElement.style.display = 'none';
}

function updateSubmitButton() {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const requiredInputs = form.querySelectorAll('[required]');
    
    let isValid = true;
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });

    submitButton.disabled = !isValid;
}

// Add smooth transitions for error messages
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error-message {
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-10px);
        }
        .error-message[style*="display: block"] {
            opacity: 1;
            transform: translateY(0);
        }
        input:focus {
            transition: border-color 0.3s ease;
        }
        button[type="submit"] {
            transition: all 0.3s ease;
        }
        button[type="submit"]:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    </style>
`); 