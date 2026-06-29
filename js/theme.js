/* Theme Management System - VORTEX CINEMA */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-mob');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('vortex-theme') || 'dark';
    
    // Apply initial theme
    setTheme(savedTheme);

    // Toggle theme on click
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            
            // Dispatch custom event for page-specific theme triggers
            window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
        });
    });
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vortex-theme', theme);
    
    // Update all theme toggle icons
    const themeIcons = document.querySelectorAll('.theme-toggle i, .theme-toggle-mob i');
    themeIcons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
}
