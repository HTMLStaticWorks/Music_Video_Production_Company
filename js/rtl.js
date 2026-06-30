/* RTL Layout Direction Engine - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');
    
    // Check local storage
    const savedRTL = localStorage.getItem('vortex-rtl') === 'true';
    
    // Apply initial state
    setRTL(savedRTL);

    // Toggle RTL on click
    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentRTL = document.documentElement.getAttribute('data-rtl') === 'true';
            setRTL(!currentRTL);
        });
    });
});

function setRTL(isRTL) {
    document.documentElement.setAttribute('data-rtl', isRTL ? 'true' : 'false');
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem('vortex-rtl', isRTL ? 'true' : 'false');
    
    // Update all RTL toggle buttons
    const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');
    rtlToggles.forEach(toggle => {
        const textSpan = toggle.querySelector('.rtl-text');
        if (textSpan) {
            textSpan.textContent = isRTL ? 'LTR' : 'RTL';
        }
        toggle.setAttribute('aria-label', isRTL ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
    });

    // Refresh layout metrics
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }, 150);
}
