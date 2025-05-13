document.addEventListener('DOMContentLoaded', function() {
    // Add animation to the error number
    const errorNumber = document.querySelector('.text-9xl');
    if (errorNumber) {
        errorNumber.style.opacity = '0';
        errorNumber.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            errorNumber.style.transition = 'all 0.5s ease';
            errorNumber.style.opacity = '1';
            errorNumber.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add animation to the error message
    const errorMessage = document.querySelector('.text-3xl');
    if (errorMessage) {
        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            errorMessage.style.transition = 'all 0.5s ease';
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add animation to the description
    const description = document.querySelector('.text-gray-600');
    if (description) {
        description.style.opacity = '0';
        description.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            description.style.transition = 'all 0.5s ease';
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
        }, 500);
    }

    // Add animation to the buttons
    const buttons = document.querySelectorAll('.flex.justify-center.space-x-4 a, .flex.justify-center.space-x-4 button');
    buttons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 700 + (index * 100));
    });

    // Add hover effects to buttons
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add page transition effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}); 