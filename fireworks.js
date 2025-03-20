class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    update() {
        if (!this.exploded) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.velocity.y += 0.1; // гравитация

            if (this.velocity.y >= 0) {
                this.explode();
                this.exploded = true;
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 / 50) * i;
            const velocity = 2 + Math.random() * 2;
            this.particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                this.color
            ));
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw(ctx));
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.01;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('50%', '50%').replace(')', `, ${this.alpha})`);
        ctx.fill();
    }
}

class FireworksManager {
    constructor() {
        this.fireworks = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addFirework(x, y) {
        this.fireworks.push(new Firework(x, y));
    }

    update() {
        // Очищаем только область фейерверков
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw(this.ctx);
            if (firework.exploded && firework.particles.length === 0) {
                this.fireworks.splice(index, 1);
            }
        });

        if (this.fireworks.length > 0) {
            requestAnimationFrame(() => this.update());
        }
    }
}

// Инициализация
const fireworksManager = new FireworksManager();

// Добавляем обработчик клика на цифру 30
document.querySelector('h1').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Создаем несколько фейерверков
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            fireworksManager.addFirework(
                x + (Math.random() - 0.5) * 100,
                y + (Math.random() - 0.5) * 100
            );
        }, i * 100);
    }
    
    fireworksManager.update();
}); 