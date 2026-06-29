/* Animation & Motion Orchestrator - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll (if available)
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync ScrollTrigger with Lenis
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 2. Sticky Navbar - Hide on Scroll Down / Reveal on Scroll Up
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.header-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 50) {
                nav.classList.remove('nav-hidden');
            } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
                // Scrolling down
                nav.classList.add('nav-hidden');
            } else {
                // Scrolling up
                nav.classList.remove('nav-hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    // 3. Scroll Progress Indicator
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (documentHeight > 0) {
                const scrolledPercent = (window.scrollY / documentHeight) * 100;
                progressBar.style.width = `${scrolledPercent}%`;
            }
        });
    }

    // 4. Character-by-Character Text Reveals
    const splitElements = document.querySelectorAll('.text-reveal-char');
    splitElements.forEach(el => {
        const text = el.innerText.trim();
        el.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.opacity = '0';
                charSpan.style.transform = 'translate3d(0, 80px, 0) skewY(8deg)';
                charSpan.className = 'char-span';
                wordSpan.appendChild(charSpan);
            });
            
            el.appendChild(wordSpan);
            
            // Add space between words
            if (wordIdx < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.textContent = '\u00A0';
                spaceSpan.style.display = 'inline-block';
                el.appendChild(spaceSpan);
            }
        });

        // Trigger reveal on enter viewport
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(el.querySelectorAll('.char-span'), {
                opacity: 1,
                y: 0,
                skewY: 0,
                duration: 1,
                stagger: 0.02,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        } else {
            // Fallback: simple opacity reveal
            el.querySelectorAll('.char-span').forEach((span, idx) => {
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'none';
                }, idx * 20);
            });
        }
    });

    // 5. Standard Scroll Fade reveals
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach(el => {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });

    // 6. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate hover offset relative to center of the button
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 7. Statistics Count-up Animation
    const statistics = document.querySelectorAll('.stat-number');
    statistics.forEach(stat => {
        const targetString = stat.getAttribute('data-target');
        const isMillion = targetString.endsWith('M+');
        const isPlus = targetString.endsWith('+');
        const numericVal = parseInt(targetString.replace(/[M\+]/g, ''));
        
        stat.innerText = '0';

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(stat, {
                innerText: numericVal,
                duration: 2.5,
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    const progressVal = Math.floor(stat.innerText);
                    if (isMillion) {
                        stat.innerText = `${progressVal}M+`;
                    } else if (isPlus) {
                        stat.innerText = `${progressVal}+`;
                    } else {
                        stat.innerText = progressVal;
                    }
                }
            });
        } else {
            // Fallback
            stat.innerText = targetString;
        }
    });

    // 8. Remove skeleton placeholders once media loads natively, with SVG fallback on error
    const mediaElements = document.querySelectorAll('img, video');
    mediaElements.forEach(media => {
        const clearSkeleton = () => media.classList.remove('skeleton');
        
        if (media.tagName === 'IMG') {
            const handleImgError = () => {
                clearSkeleton();
                const width = media.getAttribute('width') || 800;
                const height = media.getAttribute('height') || 450;
                const title = media.getAttribute('alt') || 'VORTEX CINEMA';
                
                const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                        <rect width="100%" height="100%" fill="#121212" />
                        <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/4}" fill="none" stroke="#E6B930" stroke-width="1" opacity="0.1" />
                        <rect x="${width/2 - 20}" y="${height/2 - 20}" width="40" height="40" fill="none" stroke="#E6B930" stroke-width="1" opacity="0.2" transform="rotate(45 ${width/2} ${height/2})" />
                        <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#E6B930" letter-spacing="2">${title.toUpperCase()}</text>
                        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#8E8E8E" letter-spacing="1">CINEMATIC SHOWCASE</text>
                    </svg>
                `.trim().replace(/\n/g, '').replace(/"/g, "'");
                
                media.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
            };

            if (media.complete) {
                if (media.naturalWidth === 0) {
                    handleImgError();
                } else {
                    clearSkeleton();
                }
            } else {
                media.addEventListener('load', clearSkeleton);
                media.addEventListener('error', handleImgError);
            }
        } else if (media.tagName === 'VIDEO') {
            if (media.readyState >= 2) {
                clearSkeleton();
            } else {
                media.addEventListener('loadeddata', clearSkeleton);
                media.addEventListener('error', clearSkeleton);
            }
        }
    });

    // Initialize video elements from card data-video
    const cards = document.querySelectorAll('.showcase-card');
    cards.forEach(card => {
        const videoVal = card.getAttribute('data-video');
        const video = card.querySelector('video');
        if (video && videoVal) {
            video.src = videoVal;
            video.preload = 'metadata';
        }
    });

    // 9. Video Autoplay on Card Hover (Desktop)
    document.body.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.showcase-card');
        if (card) {
            const video = card.querySelector('video');
            if (video && video.readyState >= 2) {
                video.play().catch(() => {});
            }
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.showcase-card');
        if (card) {
            const video = card.querySelector('video');
            if (video) {
                video.pause();
            }
        }
    });

    // 10. Mobile Menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 11. Horizontal Scroll Showcase (Home 2)
    const horizScrollContainer = document.querySelector('.horizontal-scroll-container');
    if (horizScrollContainer && typeof ScrollTrigger !== 'undefined' && window.innerWidth > 992) {
        gsap.to(horizScrollContainer, {
            x: () => -(horizScrollContainer.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: '.horizontal-scroll-sec',
                pin: true,
                scrub: 1,
                start: 'top top',
                end: () => `+=${horizScrollContainer.scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true
            }
        });
    }

    // 12. Process Timeline Animations (Home 2)
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
        timelineItems.forEach(item => {
            gsap.from(item.querySelector('.timeline-content'), {
                opacity: 0,
                y: 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
            gsap.from(item.querySelector('.timeline-badge'), {
                scale: 0,
                duration: 0.5,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // 13. Testimonials Slider (Swiper.js)
    if (document.querySelector('.swiper') && typeof Swiper !== 'undefined') {
        new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 40,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // 14. Equipment Accordion Toggle
    const accordionHeaders = document.querySelectorAll('.equip-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.equip-accordion-item');
            const body = item.querySelector('.equip-body');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.equip-accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.equip-body').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
});
