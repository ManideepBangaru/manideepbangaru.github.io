class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particles-bg');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 100;
        this.mouse = { x: 0, y: 0 };
        
        this.setParticleCount();
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
    }

    setCanvasSize() {
        const content = document.querySelector('.content');
        const rect = content.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                originalRadius: Math.random() * 2 + 1
            });
        }
    }

    drawParticles() {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Draw particle with increased size and opacity
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = isDarkTheme 
                ? 'rgba(6, 182, 212, 0.8)'   // Increased opacity for dark theme
                : 'rgba(2, 132, 199, 0.8)';  // Increased opacity for light theme
            this.ctx.fill();

            // Draw connections with increased visibility
            for (let j = i + 1; j < this.particles.length; j++) {
                let p2 = this.particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = isDarkTheme 
                        ? `rgba(6, 182, 212, ${0.4 * (1 - dist/150)})` // Increased line opacity
                        : `rgba(2, 132, 199, ${0.4 * (1 - dist/150)})`;
                    this.ctx.lineWidth = 1.0; // Increased line width
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Update position with slightly faster movement
            p.x += p.vx * 1.2;
            p.y += p.vy * 1.2;

            // Bounce off walls
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        }
    }

    setParticleCount() {
        const width = window.innerWidth;
        if (width <= 480) {
            this.numberOfParticles = 15;  // Even fewer particles for mobile
        } else if (width <= 768) {
            this.numberOfParticles = 30;  // Fewer particles for tablets
        } else {
            this.numberOfParticles = 50; // Original amount for desktop
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.setParticleCount();
            this.setCanvasSize();
            this.createParticles();
        });
    }

    handleMouseMove() {
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
}); 