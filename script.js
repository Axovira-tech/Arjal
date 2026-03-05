document.addEventListener("DOMContentLoaded", () => {

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('main-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active-menu');
            navLinks.classList.toggle('active-menu');
        });

        // Close when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active-menu');
                navLinks.classList.remove('active-menu');
            });
        });
    }

    // --- Language Switcher ---
    const langBtn = document.getElementById('lang-btn');
    const currentLangText = document.getElementById('current-lang-text');
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        currentLangText.textContent = lang === 'en' ? 'English' : 'ಕನ್ನಡ';

        // Find all elements looking to show text
        const transElements = document.querySelectorAll('[data-en][data-kn]');
        transElements.forEach(el => {
            // Apply slight fade transition purely in JS/CSS if desired
            el.style.opacity = '0';
            setTimeout(() => {
                el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-kn');
                el.style.transition = 'opacity 0.3s ease';
                el.style.opacity = '1';
            }, 150);
        });

        // Optional: Change fonts based on language for better readability
        if (lang === 'kn') {
            document.documentElement.style.setProperty('--font-body', 'sans-serif');
        } else {
            document.documentElement.style.setProperty('--font-body', "'Outfit', sans-serif");
        }
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'kn' : 'en';
            setLanguage(newLang);
        });
    }

    // --- Particles Canvas JS (Fire Embers) ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = -(Math.random() * 1.5 + 0.5); // float upwards
                this.opacity = Math.random() * 0.8 + 0.2;

                // Fire colors: mostly gold/orange, some red
                const rand = Math.random();
                if (rand > 0.7) this.color = `rgba(255, 233, 166, ${this.opacity})`; // bright gold
                else if (rand > 0.3) this.color = `rgba(212, 175, 55, ${this.opacity})`; // mid gold
                else this.color = `rgba(200, 50, 20, ${this.opacity})`; // ember orange
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = Math.random() * 10 + 5;
                ctx.shadowColor = this.color;
                ctx.fill();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wobble effect
                this.x += Math.sin(this.y * 0.05) * 0.5;

                // Reset when off screen top
                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                }

                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
            for (let i = 0; i < numParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach(particle => {
                particle.update();
            });
        }

        initParticles();
        animateParticles();
    }

    // --- GSAP Animations (Unified Desktop/Mobile) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal sequence
        gsap.fromTo('.reveal-anim',
            { opacity: 0, y: 30, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.3, ease: 'power3.out' }
        );

        // Standard Scroll Reveal for Cards and sections
        gsap.utils.toArray('.reveal-card').forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    }
                }
            );
        });

        // specific scroll reveal for staggered card items (like schedule cards)
        gsap.utils.toArray('.parchment-cards-list').forEach(list => {
            const cards = list.querySelectorAll('.card-item');
            gsap.fromTo(cards,
                { opacity: 0, x: -30 },
                {
                    opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: {
                        trigger: list,
                        start: "top 85%"
                    }
                }
            );
        });
    }
});
