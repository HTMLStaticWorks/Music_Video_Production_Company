/* Custom Cursor Engine - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    // Disabled custom cursor - keeping default browser arrow cursor
    return;

    // Auto-inject cursor markup
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'custom-cursor';
    cursorContainer.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-circle"></div>
    `;
    document.body.appendChild(cursorContainer);

    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');

    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for center dot
        gsap.set(dot, { x: mouseX, y: mouseY });
    });

    // Inertial smoothing for outer circle
    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
        circleX += (mouseX - circleX) * dt;
        circleY += (mouseY - circleY) * dt;
        
        gsap.set(circle, { x: circleX, y: circleY });
    });

    // Helper functions to manage cursor states
    const setCursorState = (stateClass) => {
        circle.className = `cursor-circle ${stateClass}`;
        dot.className = `cursor-dot ${stateClass ? 'hover-state' : ''}`;
    };

    const resetCursorState = () => {
        circle.className = 'cursor-circle';
        dot.className = 'cursor-dot';
    };

    // Global listeners using event delegation for dynamic content
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('a, button, .control-btn, input, textarea, select');
        if (target) {
            setCursorState('hover-state');
        }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('a, button, .control-btn, input, textarea, select');
        if (target) {
            resetCursorState();
        }
    }, true);

    // Context specific cursors
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('.view-target');
        if (target) setCursorState('view-state');
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('.view-target');
        if (target) resetCursorState();
    }, true);

    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('.play-target');
        if (target) setCursorState('play-state');
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('.play-target');
        if (target) resetCursorState();
    }, true);

    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('.drag-target');
        if (target) setCursorState('drag-state');
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('.drag-target');
        if (target) resetCursorState();
    }, true);
    
    // Custom active states for clicking/dragging
    window.addEventListener('mousedown', () => {
        gsap.to(circle, { scale: 0.8, duration: 0.2 });
    });
    window.addEventListener('mouseup', () => {
        gsap.to(circle, { scale: 1, duration: 0.2 });
    });
});
