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

        let mouseX = w / 2;
        let mouseY = h / 2;
        let trail = [];

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            trail.push({x: mouseX, y: mouseY, time: Date.now()});
            if (trail.length > 35) trail.shift();
        });

        document.addEventListener('mouseleave', () => { trail = []; });

        function animate() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);
            stars.forEach(star => { star.update(); star.draw(); });
            if (Math.random() < 0.012) shootingStars.push(new ShootingStar());
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                if (s.active) { s.update(); s.draw(); } else shootingStars.splice(i, 1);
            }
            const now = Date.now();
            while (trail.length && now - trail[0].time > 700) trail.shift();
           // if (trail.length > 3) {
//     ctx.save();
//     ctx.shadowBlur = 24; ctx.shadowColor = '#a8ceff'; ctx.strokeStyle = '#e8f3ff'; ctx.lineCap = 'round';
//     for (let i = 1; i < trail.length; i++) {
//         const alpha = i / (trail.length - 1);
//         const width = 1.8 + (i / trail.length) * 3.2;
//         ctx.globalAlpha = alpha * 0.95;
//         ctx.lineWidth = width;
//         ctx.beginPath();
//         ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
//         ctx.lineTo(trail[i].x, trail[i].y);
//         ctx.stroke();
//     }
//     ctx.restore();
//     ctx.save();
//     ctx.globalAlpha = 1; ctx.shadowBlur = 35; ctx.shadowColor = '#ffffff';
//     ctx.fillStyle = '#f0f8ff';
//     ctx.fillRect(mouseX - 1.1, mouseY - 1.1, 2.2, 2.2);
//     ctx.restore();
// }
            requestAnimationFrame(animate);
        }
        animate();

        "use strict";

        const setupData = { mouse: { n: "?", d: "?" }, kb: { n: "?", d: "?" }, pc: { n: "?", d: "?" } };
        const splashes = ["0% Mountains, 100% Gvozno.","Precision is key.","Elevation: Higher than any plateau.","Not a geographical object. Just a legend.","Trust the process.","Not found on maps."];

        function tab(id, btn) {
            document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
            btn.classList.add('active'); btn.setAttribute('aria-selected','true');
            const content = document.getElementById('spec-content');
            content.style.opacity = 0;
            const onEnd = () => {
                document.getElementById('spec-name').textContent = setupData[id].n;
                document.getElementById('spec-detail').textContent = setupData[id].d;
                content.style.opacity = 1;
                content.removeEventListener('transitionend', onEnd);
            };
            content.addEventListener('transitionend', onEnd);
            setTimeout(() => { if(content.style.opacity === '0') { document.getElementById('spec-name').textContent = setupData[id].n; document.getElementById('spec-detail').textContent = setupData[id].d; content.style.opacity = 1; } }, 300);
        }

        function showRandomSplash() {
            const el = document.getElementById('splash-text');
            if (!el) return;
            if (Math.random() <= 0.01) {
                el.textContent = "You're lucky";
                el.style.color = "#ffd700";
                el.style.textShadow = "0 0 10px rgba(255, 215, 0, 0.5)";
            } else {
                el.textContent = splashes[Math.floor(Math.random() * splashes.length)];
                el.style.color = "var(--dim)";
                el.style.textShadow = "none";
            }
        }

        const featuredData = [{ image: "preview11.jpg", title: "Skotos 2", desc: "Easy-to-build 2X1 duo/trio base design with a high-capacity open core. TC is protected by 3 walls.", link: "https://youtu.be/EnRoB-LnUzM" }];
        let currentSlide = 0, isAnimating = false;

        function updateFeatured() {
            if (isAnimating) return;
            const imageEl = document.getElementById('featured-image');
            const contentEl = document.querySelector('.featured-content');
            const watchLink = document.getElementById('watch-link');
            if (!imageEl || !contentEl || !watchLink) return;
            isAnimating = true;
            imageEl.style.opacity = '0'; contentEl.style.opacity = '0';
            setTimeout(() => {
                const slide = featuredData[currentSlide];
                imageEl.style.backgroundImage = `url('${slide.image}')`;
                document.getElementById('featured-title').textContent = slide.title;
                document.getElementById('featured-desc').textContent = slide.desc;
                document.getElementById('counter').textContent = `${currentSlide + 1}/${featuredData.length}`;
                watchLink.href = slide.link;
                imageEl.style.opacity = '1'; contentEl.style.opacity = '1';
                setTimeout(() => { isAnimating = false; }, 400);
            }, 350);
        }

        function changeSlide(dir) {
            currentSlide = (currentSlide + dir + featuredData.length) % featuredData.length;
            updateFeatured();
        }

        function calculateMaxHeight() {
            const contentEl = document.querySelector('.featured-content');
            if (!contentEl) return;
            const originalSlide = currentSlide;
            const originalOpacity = contentEl.style.opacity;
            contentEl.style.opacity = '0';
            contentEl.style.height = 'auto';
            let maxH = 0, index = 0;
            function measureNext() {
                if (index >= featuredData.length) {
                    contentEl.style.height = maxH + 'px';
                    contentEl.style.opacity = originalOpacity || '1';
                    currentSlide = originalSlide;
                    updateFeatured();
                    return;
                }
                const slide = featuredData[index];
                document.getElementById('featured-title').textContent = slide.title;
                document.getElementById('featured-desc').textContent = slide.desc;
                setTimeout(() => { const h = contentEl.scrollHeight; if (h > maxH) maxH = h; index++; measureNext(); }, 50);
            }
            measureNext();
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => tab(btn.getAttribute('data-tab'), btn));
            });
            const firstBtn = document.querySelector('.tab-btn.active');
            if (firstBtn) tab(firstBtn.getAttribute('data-tab'), firstBtn);

            showRandomSplash();

            const encoded = "aGltc2VsZkBndm96bm8uY29t";
            const target = document.getElementById('email-place');
            if (target) {
                const email = atob(encoded);
                const link = document.createElement('a');
                link.href = `mailto:${email}`;
                link.className = 'footer-email';
                link.textContent = email;
                target.appendChild(link);
            }

            const prevBtn = document.getElementById('prev');
            const nextBtn = document.getElementById('next');
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => changeSlide(-1));
                nextBtn.addEventListener('click', () => changeSlide(1));
            }

            calculateMaxHeight();
        });