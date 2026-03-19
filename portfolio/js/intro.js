/**
 * Intro Animation - Golden Lines
 * Creates an elegant minimal lux entry experience with dropping golden lines
 */

class IntroAnimation {
    constructor() {
        this.canvas = document.getElementById('intro-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lines = [];
        this.animationId = null;
        this.isAnimating = true;

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createLines();
        this.bindEvents();
        this.animate();
        this.simulateLoading();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createLines() {
        // Create vertical golden lines at different positions
        const linePositions = [0.15, 0.35, 0.5, 0.65, 0.85]; // Percentages of width
        this.lines = [];

        linePositions.forEach((pos, index) => {
            this.lines.push({
                x: this.canvas.width * pos,
                y: 0,
                targetY: this.canvas.height,
                currentY: -this.canvas.height,
                width: 1,
                opacity: 0.4,
                speed: 2 + Math.random() * 2,
                delay: index * 150,
                started: false,
                color: `rgba(212, 175, 55, 0.4)` // Gold color
            });
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createLines();
        });

        // Enter button click
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => this.exitIntro());
        }
    }

    drawLines() {
        // Draw black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add subtle radial gradient overlay for depth
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const currentTime = Date.now();

        // Draw and animate lines
        this.lines.forEach((line) => {
            // Check if line should start animating
            if (!line.started) {
                if (currentTime > line.delay + this.startTime) {
                    line.started = true;
                }
                return;
            }

            // Animate line dropping down
            if (line.currentY < line.targetY) {
                line.currentY += line.speed;
            }

            // Draw the line with gradient
            const lineGradient = this.ctx.createLinearGradient(
                line.x, line.currentY - this.canvas.height,
                line.x, line.currentY
            );
            lineGradient.addColorStop(0, 'rgba(212, 175, 55, 0)');
            lineGradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.6)');
            lineGradient.addColorStop(0.7, 'rgba(247, 231, 206, 0.4)');
            lineGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

            this.ctx.strokeStyle = lineGradient;
            this.ctx.lineWidth = line.width;
            this.ctx.beginPath();
            this.ctx.moveTo(line.x, Math.max(0, line.currentY - this.canvas.height));
            this.ctx.lineTo(line.x, line.currentY);
            this.ctx.stroke();

            // Add a glowing dot at the bottom of the line
            if (line.currentY < this.canvas.height) {
                this.ctx.beginPath();
                this.ctx.arc(line.x, line.currentY, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
                this.ctx.fill();

                // Add glow effect
                this.ctx.beginPath();
                this.ctx.arc(line.x, line.currentY, 8, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
                this.ctx.fill();
            }
        });
    }

    animate() {
        if (!this.isAnimating) return;

        if (!this.startTime) {
            this.startTime = Date.now();
        }

        this.drawLines();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    simulateLoading() {
        const introScreen = document.getElementById('intro');
        const loaderBar = document.querySelector('.loader-bar');
        let progress = 0;

        // Add loaded class to trigger letter animations
        setTimeout(() => {
            introScreen.classList.add('loaded');
        }, 100);

        // Simulate loading progress
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
            }
            loaderBar.style.width = progress + '%';
        }, 200);
    }

    exitIntro() {
        const introScreen = document.getElementById('intro');
        const mainContent = document.getElementById('main-content');

        // Hide intro
        introScreen.classList.add('hidden');

        // Show main content
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 100);

        // Stop animation after transition
        setTimeout(() => {
            this.isAnimating = false;
            cancelAnimationFrame(this.animationId);
        }, 800);

        // Remove no-scroll from body
        document.body.classList.remove('no-scroll');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-scroll');
    new IntroAnimation();
});
