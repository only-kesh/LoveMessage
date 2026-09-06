const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const messageCard = document.getElementById('message-card');

let width, height;
let isStarted = false;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Heart Math Equation
function getHeartPosition(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
        x: width / 2 + x * scale,
        y: height / 2.3 + y * scale
    };
}

// Particle Class
class HeartParticle {
    constructor(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.x = width / 2 + (Math.random() - 0.5) * 50;
        this.y = height / 2 + (Math.random() - 0.5) * 50;
        this.size = Math.random() * 2.5 + 1;
        this.speed = Math.random() * 0.04 + 0.015;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, ${Math.random() * 30 + 60}%)`;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.offset = Math.random() * Math.PI * 2;
    }

    update(time) {
        // Move towards target smoothly
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;

        // Subtle heartbeat breathing movement
        const beat = Math.sin(time * 3) * 3;
        this.renderX = this.x + Math.cos(this.offset) * beat;
        this.renderY = this.y + Math.sin(this.offset) * beat;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ff2a6d';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Floating Ambient Fireflies
class AmbientParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.vy = -Math.random() * 0.5 - 0.2;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.6 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < 0 || this.x < 0 || this.x > width) {
            this.reset();
            this.y = height;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ff75a0';
        ctx.shadowColor = '#ff75a0';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const heartParticles = [];
const ambientParticles = [];

function init() {
    heartParticles.length = 0;
    ambientParticles.length = 0;

    const scale = Math.min(width, height) / 38;
    const totalHeartParticles = width < 600 ? 350 : 550;

    for (let i = 0; i < totalHeartParticles; i++) {
        const t = Math.PI * 2 * (i / totalHeartParticles);
        const pos = getHeartPosition(t, scale);
        
        // Add random scatter around the line for density
        const scatterX = pos.x + (Math.random() - 0.5) * (scale * 2.5);
        const scatterY = pos.y + (Math.random() - 0.5) * (scale * 2.5);
        
        heartParticles.push(new HeartParticle(scatterX, scatterY));
    }

    for (let i = 0; i < 60; i++) {
        ambientParticles.push(new AmbientParticle());
    }
}

init();

let startTime = Date.now();

function animate() {
    const time = (Date.now() - startTime) / 1000;

    ctx.fillStyle = 'rgba(5, 0, 3, 0.25)';
    ctx.fillRect(0, 0, width, height);

    // Ambient floating sparks
    ambientParticles.forEach(p => {
        p.update();
        p.draw();
    });

    if (isStarted) {
        // Draw assemble heart particles
        heartParticles.forEach(p => {
            p.update(time);
            p.draw();
        });
    }

    requestAnimationFrame(animate);
}

function startSurprise() {
    isStarted = true;
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.style.display = 'none';
    }, 800);

    // Reveal Romantic Card after heart forms
    setTimeout(() => {
        messageCard.classList.add('show');
    }, 2000);
}

animate();