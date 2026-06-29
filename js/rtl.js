/* RTL Layout Direction Engine - VORTEX CINEMA */

console.log('RTL Engine: Loaded');

(function() {
    // Check and apply saved state immediately to prevent layout flash
    const savedRTL = localStorage.getItem('vortex-rtl') === 'true';
    console.log('RTL Engine: Initial saved state is', savedRTL);
    setRTL(savedRTL);

    function initRTL() {
        const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');
        console.log('RTL Engine: Initializing buttons, found:', rtlToggles.length);
        
        // Sync button text/states
        updateButtons(savedRTL);

        rtlToggles.forEach((toggle, index) => {
            toggle.addEventListener('click', (e) => {
                console.log(`RTL Engine: Button clicked (index ${index})`);
                const isRTL = document.documentElement.getAttribute('data-rtl') === 'true';
                setRTL(!isRTL);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRTL);
    } else {
        initRTL();
    }

    function setRTL(isRTL) {
        console.log('RTL Engine: Setting layout direction to', isRTL ? 'RTL' : 'LTR');
        document.documentElement.setAttribute('data-rtl', isRTL ? 'true' : 'false');
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        localStorage.setItem('vortex-rtl', isRTL ? 'true' : 'false');
        updateButtons(isRTL);
    }

    function updateButtons(isRTL) {
        const rtlToggles = document.querySelectorAll('.rtl-toggle, .rtl-toggle-mob');
        rtlToggles.forEach(toggle => {
            const textSpan = toggle.querySelector('.rtl-text');
            if (textSpan) {
                textSpan.textContent = isRTL ? 'LTR' : 'RTL';
            }
            toggle.setAttribute('aria-label', isRTL ? 'Switch to Left to Right Layout' : 'Switch to Right to Left Layout');
        });
    }
})();
