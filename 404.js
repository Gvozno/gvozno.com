const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });
        
        const stars = [];
        class Star {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 0.85 + 0.55;
                this.vx = Math.random() * 0.11 + 0.055;
                this.vy = Math.random() * 0.18 + 0.095;
                this.phase = Math.random() * Math.PI * 2;
                this.twinkle = Math.random() * 0.0022 + 0.0011;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.phase += this.twinkle;
                if (this.x > w + 40 || this.y > h + 40 || this.x < -40 || this.y < -40) {
                    this.x = Math.random() * w;
                    this.y = Math.random() * h;
                }
            }
            draw() {
                const alpha = 0.62 + Math.sin(this.phase) * 0.35;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#f4f8ff';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#b8d4ff';
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }
        for (let i = 0; i < 148; i++) stars.push(new Star());
        
        const shootingStars = [];
        class ShootingStar {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w * 1.15 - w * 0.2;
                this.y = Math.random() * h * 0.3;
                this.len = Math.random() * 62 + 45;
                this.speed = Math.random() * 15 + 18;
                this.angle = Math.PI / 180 * (28 + Math.random() * 17);
                this.opacity = 1;
                this.active = true;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.opacity -= 0.017;
                if (this.opacity <= 0) this.active = false;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = '#e8f3ff';
                ctx.lineWidth = 2.7;
                ctx.shadowBlur = 25;
                ctx.shadowColor = '#a8ceff';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len * 0.75);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        function animate() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);
            stars.forEach(star => { star.update(); star.draw(); });
            if (Math.random() < 0.012) shootingStars.push(new ShootingStar());
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                if (s.active) { s.update(); s.draw(); } else shootingStars.splice(i, 1);
            }
            requestAnimationFrame(animate);
        }
        animate();