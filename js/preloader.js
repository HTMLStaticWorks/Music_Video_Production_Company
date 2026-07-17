/* Standard Preloader Engine - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #0A0A0A;
        z-index: 99999;
        transition: opacity 0.4s ease;
        pointer-events: none;
    `;
    document.body.appendChild(preloader);

    // Fast fade out
    requestAnimationFrame(() => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            document.body.classList.add('preloaded-ready');
            window.dispatchEvent(new Event('preloaderComplete'));
            
            setTimeout(() => {
                preloader.remove();
            }, 400);
        }, 50);
    });
});
