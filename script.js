// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== PORTFOLIO FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        workCards.forEach(card => {
            card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            if (card.style.display === 'block') {
                card.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ============================================================
// ===== CONTACT FORM =====
// ============================================================

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const API_URL = 'http://localhost:5500/api/contact';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = '⚠️ Please fill in all required fields.';
        formStatus.className = 'error';
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        formStatus.textContent = '⚠️ Please enter a valid email address.';
        formStatus.className = 'error';
        return;
    }

    formStatus.textContent = '📨 Sending your message...';
    formStatus.className = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, budget: budget || 'Not specified', message })
        });

        const data = await response.json();

        if (data.success) {
            formStatus.innerHTML = '✅ Message sent! I\'ll reply within 24 hours.';
            formStatus.className = 'success';
            form.reset();
        } else {
            formStatus.innerHTML = '❌ ' + data.message;
            formStatus.className = 'error';
        }
    } catch (error) {
        formStatus.innerHTML = '❌ Something went wrong. Please try again.';
        formStatus.className = 'error';
    }
});

// ============================================================
// ===== SMOOTH SCROLL =====
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================================
// ===== COUNTER ANIMATION =====
// ============================================================

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                if (target && !num.dataset.animated) {
                    num.dataset.animated = 'true';
                    let start = 0;
                    const increment = target / 100;
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            start = target;
                            clearInterval(timer);
                        }
                        num.textContent = target === 100 ? Math.floor(start) + '%' : Math.floor(start) + '+';
                    }, 20);
                }
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ============================================================
// ===== SCROLL ANIMATIONS (Lightweight) =====
// ============================================================

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.service-card, .work-card, .testimonial-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    cardObserver.observe(el);
});

console.log('🚀 Rana Umar — Web Developer & Designer');
console.log('📧 umar70403@gmail.com');
console.log('🔗 https://www.linkedin.com/in/ranaumarajaz/');
console.log('🔗 https://github.com/umar523');