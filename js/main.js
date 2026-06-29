/* Core Application Coordinator - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Vortex Cinema Engine Active');

    // 1. Page Transition Out on Click Link
    const internalLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Ensure link is a valid html destination in our project
            if (href && (href.endsWith('.html') || href === '/' || href.includes('index') || href.includes('portfolio') || href.includes('about') || href.includes('contact') || href.includes('home2'))) {
                e.preventDefault();
                
                // Construct transition overlay node
                const transitionOverlay = document.createElement('div');
                transitionOverlay.id = 'page-transition';
                transitionOverlay.className = 'page-transition';
                document.body.appendChild(transitionOverlay);

                // Add transition overlay styling in head
                if (!document.getElementById('transition-style')) {
                    const style = document.createElement('style');
                    style.id = 'transition-style';
                    style.textContent = `
                        .page-transition {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            background-color: var(--bg);
                            z-index: 100000;
                            transform: translateY(100%);
                            transition: background-color 0.5s ease;
                        }
                    `;
                    document.head.appendChild(style);
                }

                // Slide Up and redirect
                gsap.to(transitionOverlay, {
                    yPercent: -100,
                    duration: 0.7,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            }
        });
    });

    // 2. Active Class Marker on Menu link based on window location
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const menuItems = document.querySelectorAll('.nav-links li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
});
