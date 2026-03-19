/**
 * Custom Cursor
 * Smooth animated cursor with hover effects
 */

class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.ring = document.querySelector('.cursor-ring');

        if (!this.dot || !this.ring) return;

        this.mouse = { x: 0, y: 0 };
        this.dotPos = { x: 0, y: 0 };
        this.ringPos = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .project-card, .skill-item, .timeline-content');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');

                // Add glow on buttons
                if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                    document.body.classList.add('cursor-glow');
                }
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover', 'cursor-glow');
            });
        });

        // Text input cursor
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

        textInputs.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-text');
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-text');
            });
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-click');
        });

        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            document.body.classList.add('cursor-hidden');
        });

        document.addEventListener('mouseenter', () => {
            document.body.classList.remove('cursor-hidden');
        });
    }

    animate() {
        // Smooth follow for dot (faster)
        this.dotPos.x += (this.mouse.x - this.dotPos.x) * 0.5;
        this.dotPos.y += (this.mouse.y - this.dotPos.y) * 0.5;

        // Smooth follow for ring (slower for trail effect)
        this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.15;
        this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.15;

        // Apply positions
        this.dot.style.left = this.dotPos.x + 'px';
        this.dot.style.top = this.dotPos.y + 'px';

        this.ring.style.left = this.ringPos.x + 'px';
        this.ring.style.top = this.ringPos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});
