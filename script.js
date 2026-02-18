// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Form Handling (Formspree with AJAX)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Disable button and show sending state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const formData = new FormData(contactForm);

        // Dynamic subject to avoid Gmail threading
        const clientName = formData.get('nombre') || 'Cliente';
        formData.append('_subject', `Nueva Consulta de ${clientName} - NL Eventos`);
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success message
                contactForm.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid var(--accent-gold);">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 20px; display: block;"></i>
                        <h3 style="color: white; margin-bottom: 10px;">¡Mensaje Enviado!</h3>
                        <p style="color: var(--text-secondary);">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                        <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 20px;">Enviar otro mensaje</button>
                    </div>
                `;
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert('Ups! Hubo un problema al enviar el formulario.');
                }
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        } catch (error) {
            alert('Error de conexión. Por favor, intenta de nuevo más tarde.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
