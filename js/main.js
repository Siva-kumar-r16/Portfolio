// --- 1. THEME SWITCHER LOGIC ---
function initTheme() {
    const toggleSwitch = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (localStorage.getItem('theme') === 'light') {
        htmlElement.classList.add('light-mode');
    } else {
        localStorage.setItem('theme', 'dark');
        htmlElement.classList.remove('light-mode');
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', () => {
            htmlElement.classList.toggle('light-mode');
            if (htmlElement.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
        toggleSwitch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleSwitch.click();
            }
        });
    }
}

// --- 2. LIVE CLOCK (Local Current Time ONLY: e.g. 07:14:50 PM) ---
function initClock() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        const clockEl = document.getElementById('system-time');
        if (clockEl) {
            clockEl.textContent = timeString;
        }
    }
    setInterval(updateTime, 1000);
    updateTime();
}

// --- 3. MOBILE MENU TOGGLE ---
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('nav-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
        });
    }
}

// --- 4. GLYPH CANVAS & CUSTOM CURSOR ---
function initGlyphCanvas() {
    const canvas = document.getElementById('glyph-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let mouseX = -1000, mouseY = -1000;
    let lastDraw = 0;
    
    const isLowEnd = window.navigator.hardwareConcurrency <= 4 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const fpsInterval = isLowEnd ? 1000 / 30 : 1000 / 60;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('mouse-active')) {
            document.body.classList.add('mouse-active');
        }

        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        
        if (cursorDot && cursorOutline) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
            
            setTimeout(() => {
                cursorOutline.style.left = mouseX + 'px';
                cursorOutline.style.top = mouseY + 'px';
            }, 50);
        }
    });

    // Cursor hover effects on clickable elements
    document.querySelectorAll('a, button, .toggle-switch, .interactive-card, .clickable').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const outline = document.getElementById('cursor-outline');
            if (outline) {
                outline.style.width = '60px';
                outline.style.height = '60px';
                outline.style.borderColor = 'var(--accent-red)';
            }
        });
        el.addEventListener('mouseleave', () => {
            const outline = document.getElementById('cursor-outline');
            if (outline) {
                outline.style.width = '40px';
                outline.style.height = '40px';
                outline.style.borderColor = 'var(--text-main)';
            }
        });
    });

    function draw(timestamp) {
        requestAnimationFrame(draw);
        const elapsed = timestamp - lastDraw;
        if (elapsed < fpsInterval) return;
        lastDraw = timestamp - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, width, height);
        
        const dotSize = 2;
        const spacing = window.innerWidth < 768 ? 50 : 30;
        const rows = Math.ceil(height / spacing);
        const cols = Math.ceil(width / spacing);
        
        const style = getComputedStyle(document.body);
        const dotColor = style.getPropertyValue('--dot-color').trim();
        const accent = style.getPropertyValue('--accent-red').trim();
        ctx.fillStyle = dotColor;

        const hasMouse = mouseX > 0 && mouseY > 0;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * spacing;
                const y = j * spacing;
                
                if (hasMouse) {
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const maxDist = 150;
                        if (distance < maxDist) {
                            const scale = 1 + (maxDist - distance) / 20;
                            const alpha = 1 - (distance / maxDist);
                            ctx.beginPath();
                            ctx.arc(x, y, dotSize * scale, 0, Math.PI * 2);
                            ctx.fillStyle = accent;
                            ctx.globalAlpha = alpha;
                            ctx.fill();
                            ctx.globalAlpha = 1;
                            continue;
                        }
                    }
                }
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
                ctx.fill();
            }
        }
    }
    requestAnimationFrame(draw);
}

// --- 5. SCROLL REVEAL OBSERVER ---
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => sectionObserver.observe(el));
}

// --- 6. MARQUEE CLONING ---
function initMarquee() {
    const techTrack = document.getElementById('tech-track');
    const techSource = document.getElementById('tech-source');
    if (techTrack && techSource) {
        for (let i = 0; i < 3; i++) {
            techTrack.appendChild(techSource.cloneNode(true));
        }
    }
}

// --- 7. SKILL INTERACTIVITY ---
function initSkillInteractivity() {
    const skillWidgets = document.querySelectorAll('.skill-widget');
    const projectCards = document.querySelectorAll('.project-card');

    skillWidgets.forEach(widget => {
        widget.addEventListener('mouseenter', () => {
            const tech = widget.getAttribute('data-tech');
            projectCards.forEach(card => {
                const cardTech = card.getAttribute('data-tech') || "";
                if (cardTech.includes(tech)) {
                    card.classList.remove('card-dimmed');
                    card.style.transform = 'translateY(-5px)';
                    card.style.borderColor = 'var(--text-muted)';
                } else {
                    card.classList.add('card-dimmed');
                    card.style.transform = 'translateY(0)';
                    card.style.borderColor = 'var(--border-color)';
                }
            });
        });

        widget.addEventListener('mouseleave', () => {
            projectCards.forEach(card => {
                card.classList.remove('card-dimmed');
                card.style.transform = '';
                card.style.borderColor = '';
            });
        });
    });
}

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initMobileMenu();
    initGlyphCanvas();
    initScrollReveal();
    initMarquee();
    initSkillInteractivity();
});
