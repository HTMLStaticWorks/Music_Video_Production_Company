/* RTL Layout Direction Engine - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');

    // Check saved state
    const savedRTL = localStorage.getItem('vortex-rtl') === 'true';
    setRTL(savedRTL);

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isRTL = document.documentElement.getAttribute('data-rtl') === 'true';
            setRTL(!isRTL);
        });
    });
});

function setRTL(isRTL) {
    document.documentElement.setAttribute('data-rtl', isRTL ? 'true' : 'false');
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem('vortex-rtl', isRTL ? 'true' : 'false');

    // Update all RTL buttons text
    const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');
    rtlToggles.forEach(toggle => {
        toggle.textContent = isRTL ? 'LTR' : 'RTL';
        toggle.setAttribute('aria-label', isRTL ? 'Switch to Left to Right Layout' : 'Switch to Right to Left Layout');
    });
}
