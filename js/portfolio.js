/* Portfolio & Lightbox Controller - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Portfolio Category Filtering
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                // Animate grid change
                gsap.to(portfolioCards, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    stagger: 0.02,
                    onComplete: () => {
                        portfolioCards.forEach(card => {
                            const category = card.getAttribute('data-category');
                            if (filterValue === 'all' || category === filterValue) {
                                card.style.display = 'block';
                                gsap.to(card, {
                                    opacity: 1,
                                    scale: 1,
                                    duration: 0.5,
                                    ease: 'power3.out'
                                });
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        
                        // Recalculate ScrollTrigger positions
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                    }
                });
            });
        });
    }

    // 2. Cinematic Details Lightbox Modal
    let activeIndex = -1;
    let projectsData = [];

    // Capture project details from cards and list items
    const initProjectsData = () => {
        projectsData = [];
        const uniqueVideos = new Set();
        
        // Query both card forms and list rows
        const rawElements = document.querySelectorAll('.showcase-card, .portfolio-card, .portfolio-list-item');
        
        rawElements.forEach((el) => {
            const videoUrl = el.getAttribute('data-video') || '';
            const artist = el.getAttribute('data-artist') || 'Unknown Artist';
            const titleEl = el.querySelector('.card-title') || el.querySelector('h3');
            const title = titleEl ? titleEl.innerText : 'Untitled';
            
            if (videoUrl && !uniqueVideos.has(videoUrl)) {
                uniqueVideos.add(videoUrl);
                
                projectsData.push({
                    index: projectsData.length,
                    title: title,
                    artist: artist,
                    category: el.getAttribute('data-category') || 'Production',
                    year: el.getAttribute('data-year') || '2026',
                    videoUrl: videoUrl,
                    director: el.getAttribute('data-director') || 'Vortex Directors',
                    label: el.getAttribute('data-label') || 'Independent',
                    dp: el.getAttribute('data-dp') || 'Vortex DP',
                    desc: el.getAttribute('data-desc') || 'A premium visual production exploring identity, sound, and lighting.',
                    visible: true
                });
            }
            
            // Set up click listener on every card/list item to open modal
            el.addEventListener('click', (e) => {
                e.preventDefault();
                // Find matching project in our unique list
                const matchIndex = projectsData.findIndex(p => p.videoUrl === videoUrl);
                if (matchIndex !== -1) {
                    activeIndex = matchIndex;
                    openCinemaModal(projectsData[matchIndex]);
                }
            });
        });
    };
    
    initProjectsData();
    
    // Update data list visibility flags when filtered
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    projectsData.forEach((proj) => {
                        // find corresponding elements (both card and list)
                        const elements = document.querySelectorAll(`[data-video="${proj.videoUrl}"]`);
                        let isVisible = false;
                        elements.forEach(el => {
                            if (el.style.display !== 'none') isVisible = true;
                        });
                        proj.visible = isVisible;
                    });
                }, 400);
            });
        });
    }

    // Insert modal container markup in the body
    const modalMarkup = document.createElement('div');
    modalMarkup.id = 'cinema-modal';
    modalMarkup.className = 'cinema-modal';
    modalMarkup.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-container">
            <button class="modal-close-btn" aria-label="Close Project"><i class="fas fa-times"></i></button>
            
            <div class="modal-content">
                <div class="modal-video-container">
                    <video id="modal-video" controls autoplay muted playsinline src=""></video>
                </div>
                
                <div class="modal-details-grid">
                    <div class="modal-info-side">
                        <span class="modal-category"></span>
                        <h2 class="modal-title"></h2>
                        <p class="modal-description"></p>
                    </div>
                    
                    <div class="modal-credits-side">
                        <div class="credits-grid">
                            <div class="credit-item">
                                <span class="credit-label">Artist</span>
                                <span class="credit-val modal-artist"></span>
                            </div>
                            <div class="credit-item">
                                <span class="credit-label">Director</span>
                                <span class="credit-val modal-director"></span>
                            </div>
                            <div class="credit-item">
                                <span class="credit-label">Director of Photography</span>
                                <span class="credit-val modal-dp"></span>
                            </div>
                            <div class="credit-item">
                                <span class="credit-label">Record Label</span>
                                <span class="credit-val modal-label"></span>
                            </div>
                            <div class="credit-item">
                                <span class="credit-label">Year</span>
                                <span class="credit-val modal-year"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-nav-container">
                    <button class="modal-nav-btn prev-btn"><i class="fas fa-arrow-left"></i> Previous Project</button>
                    <button class="modal-nav-btn next-btn">Next Project <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalMarkup);

    // Modal CSS inject dynamic
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .cinema-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 2000;
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .cinema-modal.active {
            display: flex;
            opacity: 1;
        }
        .modal-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
        }
        .modal-container {
            position: relative;
            width: 90%;
            max-width: 1200px;
            margin: auto;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 2001;
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            padding: var(--spacing-md);
            scrollbar-width: thin;
        }
        .modal-container::-webkit-scrollbar {
            width: 6px;
        }
        .modal-container::-webkit-scrollbar-thumb {
            background-color: var(--border);
        }
        .modal-close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: var(--text);
            font-size: 1.5rem;
            cursor: none;
            z-index: 2002;
            transition: var(--transition-fast);
        }
        .modal-close-btn:hover {
            color: var(--accent);
            transform: scale(1.1);
        }
        .modal-video-container {
            width: 100%;
            aspect-ratio: 16/9;
            background-color: #000;
            margin-bottom: var(--spacing-md);
        }
        .modal-video-container video {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .modal-details-grid {
            display: grid;
            grid-template-columns: 3fr 2fr;
            gap: var(--spacing-lg);
            border-bottom: 1px solid var(--border);
            padding-bottom: var(--spacing-md);
            margin-bottom: var(--spacing-md);
        }
        .modal-category {
            color: var(--accent);
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
            display: block;
        }
        .modal-title {
            font-size: 2.5rem;
            margin-bottom: var(--spacing-sm);
        }
        .modal-description {
            font-size: 1rem;
            line-height: 1.6;
        }
        .credits-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--spacing-xs);
        }
        .credit-item {
            border-bottom: 1px solid var(--border);
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
        }
        .credit-label {
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        .credit-val {
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text);
        }
        .modal-nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: var(--spacing-xs);
        }
        .modal-nav-btn {
            background: none;
            border: 1px solid var(--border);
            color: var(--text);
            padding: 0.8rem 1.5rem;
            font-family: var(--font-body);
            font-weight: 500;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: none;
            transition: var(--transition-fast);
        }
        .modal-nav-btn:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
        @media(max-width: 768px) {
            .modal-details-grid {
                grid-template-columns: 1fr;
                gap: var(--spacing-md);
            }
            .modal-title {
                font-size: 1.8rem;
            }
            .modal-nav-container {
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            .modal-nav-btn {
                width: 100%;
                text-align: center;
            }
        }
        /* RTL Modal adjustments */
        [data-rtl="true"] .modal-close-btn {
            right: auto;
            left: 15px;
        }
        [data-rtl="true"] .modal-nav-btn i {
            transform: scaleX(-1);
        }
    `;
    document.head.appendChild(modalStyles);

    const modal = document.getElementById('cinema-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = modal.querySelector('.modal-close-btn');
    const modalBg = modal.querySelector('.modal-bg');
    
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');

    // Populate and open modal
    const openCinemaModal = (proj) => {
        if (!proj) return;
        
        modal.querySelector('.modal-category').innerText = proj.category;
        modal.querySelector('.modal-title').innerText = `${proj.artist} - ${proj.title}`;
        modal.querySelector('.modal-description').innerText = proj.desc;
        
        modal.querySelector('.modal-artist').innerText = proj.artist;
        modal.querySelector('.modal-director').innerText = proj.director;
        modal.querySelector('.modal-dp').innerText = proj.dp;
        modal.querySelector('.modal-label').innerText = proj.label;
        modal.querySelector('.modal-year').innerText = proj.year;
        
        // Load video
        modalVideo.src = proj.videoUrl;
        modalVideo.load();
        modalVideo.play().catch(() => {});
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
        
        // Custom animation
        gsap.fromTo(modal.querySelector('.modal-container'), 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );
    };

    const closeCinemaModal = () => {
        modalVideo.pause();
        modalVideo.src = '';
        
        gsap.to(modal.querySelector('.modal-container'), {
            y: 50,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    };

    // Modal click listeners
    modalClose.addEventListener('click', closeCinemaModal);
    modalBg.addEventListener('click', closeCinemaModal);

    // Keyboard ESC listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCinemaModal();
        }
    });

    // Modal navigation
    const navigateProject = (direction) => {
        let newIndex = activeIndex;
        let count = 0;
        
        do {
            newIndex = (newIndex + direction + projectsData.length) % projectsData.length;
            count++;
        } while (!projectsData[newIndex].visible && count < projectsData.length);
        
        if (projectsData[newIndex].visible) {
            activeIndex = newIndex;
            // Transition effect
            gsap.to(modal.querySelector('.modal-container'), {
                opacity: 0.1,
                y: 10,
                duration: 0.25,
                onComplete: () => {
                    openCinemaModal(projectsData[activeIndex]);
                }
            });
        }
    };

    prevBtn.addEventListener('click', () => navigateProject(-1));
    nextBtn.addEventListener('click', () => navigateProject(1));

    // 3. Grid vs List Layout Switcher
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    const gridView = document.getElementById('featured-grid') || document.getElementById('portfolio-grid');
    const listView = document.getElementById('featured-list') || document.getElementById('portfolio-list-view');

    const setViewMode = (mode) => {
        localStorage.setItem('vortex-view-mode', mode);
        
        if (mode === 'list') {
            if (gridBtn) gridBtn.classList.remove('active');
            if (listBtn) listBtn.classList.add('active');
            
            if (gridView) {
                gsap.to(gridView, { opacity: 0, duration: 0.3, onComplete: () => {
                    gridView.style.display = 'none';
                    if (listView) {
                        listView.style.display = 'flex';
                        gsap.fromTo(listView, { opacity: 0 }, { opacity: 1, duration: 0.4 });
                    }
                }});
            }
        } else {
            if (gridBtn) gridBtn.classList.add('active');
            if (listBtn) listBtn.classList.remove('active');
            
            if (listView) {
                gsap.to(listView, { opacity: 0, duration: 0.3, onComplete: () => {
                    listView.style.display = 'none';
                    if (gridView) {
                        gridView.style.display = gridView.id === 'portfolio-grid' ? 'grid' : 'grid';
                        // Keep grid display consistent
                        gridView.style.display = '';
                        gsap.fromTo(gridView, { opacity: 0 }, { opacity: 1, duration: 0.4 });
                    }
                }});
            }
        }

        // Refresh scroll trigger layouts
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 350);
    };

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => setViewMode('grid'));
        listBtn.addEventListener('click', () => setViewMode('list'));

        // Load saved view mode or default to grid
        const savedViewMode = localStorage.getItem('vortex-view-mode') || 'grid';
        setViewMode(savedViewMode);
    }

    // 4. Mouse-Following Hover Reveal Previews (Editorial List Layout)
    const listItems = document.querySelectorAll('.portfolio-list-item');
    const hoverMedia = document.getElementById('project-hover-media');
    
    if (listItems.length > 0 && hoverMedia && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(hoverMedia, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
        
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const videoSrc = item.getAttribute('data-video');
                const video = hoverMedia.querySelector('video');
                if (video && videoSrc) {
                    video.src = videoSrc;
                    video.load();
                    video.play().catch(() => {});
                }
                
                hoverMedia.style.display = 'block';
                gsap.to(hoverMedia, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(hoverMedia, {
                    opacity: 0,
                    scale: 0.6,
                    duration: 0.3,
                    ease: 'power3.out',
                    onComplete: () => {
                        hoverMedia.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Play Showreel Button Handler
    const playShowreelBtn = document.getElementById('play-showreel-btn');
    if (playShowreelBtn) {
        playShowreelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const showreelProject = {
                title: "Vortex Cinematic Showreel",
                artist: "Vortex Cinema",
                category: "Studio Showreel",
                year: "2026",
                videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0c008779857d1013e20d706bc75553b&profile_id=139&oauth2_token_id=57447761",
                director: "Sofia Coppola",
                label: "VORTEX. STUDIO",
                dp: "Alan Cruz",
                desc: "The official award-winning production showreel compiling select visual concepts, artist performances, and lighting sequences.",
                visible: true
            };
            openCinemaModal(showreelProject);
        });
    }
});
