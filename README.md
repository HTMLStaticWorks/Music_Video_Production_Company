# Vortex Cinema Creative Agency Website

A world-class, premium, award-winning creative agency website for **Vortex Cinema**, built with exceptional attention to cinematic layouts, typography, micro-animations, and smooth storytelling rhythms.

This project is a multi-page static website built using **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)**.

---

## 📂 Project Structure

```text
Music-Video-Studio/
│
├── index.html            # Premium Home Direction 1
├── home2.html            # Editorial Home Direction 2 (Horizontal scroll + workflow timeline)
├── portfolio.html        # Complete project archive catalog with custom filters & modal overlays
├── about.html            # Studio story narrative, team bios, and technical gear accordions
├── contact.html          # Interactive booking form with float labels & checkmark confirmations
│
├── css/
│   ├── variables.css     # CSS Custom Properties (Theme palettes, spacing grid system, typographies)
│   ├── style.css         # Reset normalization, nav bar, grids, and primary layouts
│   ├── animations.css    # Keyframes, marquee, custom cursors, and skeleton transitions
│   └── responsive.css    # Device adaptive queries (mobile hamburger, accessibility rules)
│
└── js/
    ├── main.js           # Navigation state controller, link intercept page slide transitions
    ├── theme.js          # Dark/Light selector, persistent theme storage (localStorage)
    ├── rtl.js            # Mirror layout engine, LTR/RTL vector swaps
    ├── cursor.js         # GSAP mouse follower, cursor state maps (Default, Hover, View, Play, Drag)
    ├── preloader.js      # Fullscreen percent counter, reveal transitions
    ├── animations.js     # Lenis scroll syncing, text reveals, magnetic buttons, statistics ticks
    ├── portfolio.js      # Portfolio filter sorts and dynamic details modal rendering
    └── form.js           # Form float label styling, char limits, validation overlays
```

---

## 🛠️ High-Performance Libraries (Loaded via CDN)

*   **Lenis Scroll**: Smooth scroll orchestration.
*   **GSAP & ScrollTrigger**: Handles inertial staggers, counts, timelines, and custom cursor physics.
*   **Swiper.js**: High-performance quote sliders on `home2.html`.
*   **FontAwesome**: Vector icons for controls.

---

## ⚡ Key Premium Features

1.  **Custom Cursor Engine**
    *   Responsive dot & circle mouse follower.
    *   Contextual cursor states (`Default`, `Hover`, `View`, `Play`, `Drag`) that adapt dynamically when hovering over cards, videos, or sliders.
2.  **State Persistence**
    *   Persistent Dark/Light settings saved to `localStorage`.
    *   Persistent RTL mirror layout setting.
3.  **Smooth Page Slide Transition**
    *   All internal links intercept navigation to play a smooth page fade-out before opening the next static template.
4.  **Cinematic Lightbox details**
    *   Portfolio cards on `portfolio.html` support click-to-open cinema details overlays containing credits, tags, descriptions, next project selectors, and responsive controls.
5.  **Interactive Booking form**
    *   Inputs support floating label cues.
    *   Dynamic character constraints and validation overlays.
    *   Checkmark drawing confirmation sequence replaces form on submit without alert messages.

---

## 🚀 How to Run Locally

1.  Clone/download this directory.
2.  Open any `.html` page in your browser of choice (e.g. Chrome, Safari, Edge, Firefox).
3.  No compile or build steps required.
