/* Premium Preloader Engine - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    // Inject preloader markup
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-logo">VORTEX<span>.</span></div>
        <div class="preloader-bar-bg">
            <div class="preloader-bar-fill"></div>
        </div>
        <div class="preloader-counter">0%</div>
    `;
    document.body.appendChild(preloader);

    const logo = preloader.querySelector('.preloader-logo');
    const barFill = preloader.querySelector('.preloader-bar-fill');
    const counter = preloader.querySelector('.preloader-counter');

    // Fade logo in at start
    gsap.to(logo, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' });

    let progress = 0;
    const duration = 1200; // Total loading time in ms
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const loadTimer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadTimer);
            
            // Finish animation
            barFill.style.width = '100%';
            counter.textContent = '100%';
            
            setTimeout(hidePreloader, 300);
        } else {
            barFill.style.width = `${Math.floor(progress)}%`;
            counter.textContent = `${Math.floor(progress)}%`;
        }
    }, intervalTime);

    function hidePreloader() {
        // Slide up preloader screen
        gsap.to(preloader, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => {
                preloader.remove();
                document.body.classList.add('preloaded-ready');
                
                // Dispatch custom event indicating that loader has finished
                window.dispatchEvent(new Event('preloaderComplete'));
            }
        });

        // Trigger reveal animations on structural elements
        gsap.from('.header-nav', {
            y: -50,
            opacity: 0,
            duration: 1.2,
            delay: 0.4,
            ease: 'power3.out'
        });
    }
});
