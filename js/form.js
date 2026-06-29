/* Premium Booking Form Controller - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    const formInputs = bookingForm.querySelectorAll('input, select, textarea');
    const successState = document.getElementById('form-success-state');

    // 1. Interactive floating focus highlights
    formInputs.forEach(input => {
        const group = input.closest('.form-group');
        if (!group) return;

        input.addEventListener('focus', () => {
            group.classList.add('focused');
            // Remove validation errors on refocus
            group.classList.remove('has-error');
            const errorMsg = group.querySelector('.error-msg');
            if (errorMsg) {
                gsap.to(errorMsg, { opacity: 0, y: -5, duration: 0.2, onComplete: () => errorMsg.remove() });
            }
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                group.classList.remove('focused');
            }
        });

        // Initialize state if field has content (auto-fill fallback)
        if (input.value !== '') {
            group.classList.add('focused');
        }
    });

    // 2. Character counter for message area
    const textarea = bookingForm.querySelector('textarea');
    const charCounter = document.getElementById('char-counter');
    if (textarea && charCounter) {
        textarea.addEventListener('input', () => {
            const count = textarea.value.length;
            charCounter.textContent = `${count} / 1000`;
            if (count > 900) {
                charCounter.style.color = 'var(--accent)';
            } else {
                charCounter.style.color = '';
            }
        });
    }

    // 3. Validation Handler
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        formInputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showValidationError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && input.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    showValidationError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        if (isValid) {
            submitBookingForm();
        }
    });

    function showValidationError(input, message) {
        const group = input.closest('.form-group');
        if (!group || group.classList.contains('has-error')) return;

        group.classList.add('has-error');

        // Create error element if it doesn't exist
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-msg';
        errorMsg.textContent = message;
        group.appendChild(errorMsg);

        // Animate error message fade-in
        gsap.fromTo(errorMsg, 
            { opacity: 0, y: -5 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
    }

    function submitBookingForm() {
        // Slide out the form and display the success state
        gsap.to(bookingForm, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                bookingForm.style.display = 'none';
                
                // Show Success container
                successState.style.display = 'block';
                gsap.fromTo(successState,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                );

                // Animate checkmark draw
                const checkCircle = successState.querySelector('.success-circle');
                const checkPath = successState.querySelector('.success-check');
                
                if (checkCircle && checkPath) {
                    gsap.fromTo(checkCircle, 
                        { scale: 0 }, 
                        { scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
                    );
                    gsap.fromTo(checkPath,
                        { strokeDashoffset: 50 },
                        { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', delay: 0.6 }
                    );
                }
            }
        });
    }
});
