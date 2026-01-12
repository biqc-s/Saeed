// Load Content from data.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Run Terminal Sequence
    runTerminalSequence();

    // 2. Initialize Background Particles
    initParticles();

    // 3. Populate Data (Hidden until sequence ends)
    populateData();
});

// Particle System
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = '#58a6ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create Particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();

            // Draw connections
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.strokeStyle = `rgba(88, 166, 255, ${0.1 - dist / 1000})`; // Fade out
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function populateData() {
    const data = portfolioData;

    // Header
    document.getElementById('nav-name').textContent = data.personalInfo.name;
    document.getElementById('nav-title').textContent = data.personalInfo.title;
    document.getElementById('about-text').textContent = data.personalInfo.bio;
    document.getElementById('year').textContent = new Date().getFullYear();

    // Services
    const servicesGrid = document.getElementById('services-grid');
    data.services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'card service-card';
        div.innerHTML = `
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p style="color: var(--secondary-color); margin: 15px 0;">${service.description}</p>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        servicesGrid.appendChild(div);
    });

    // Packages
    const packagesGrid = document.getElementById('packages-grid');
    data.packages.forEach(pkg => {
        const div = document.createElement('div');
        div.className = 'package-card' + (pkg.recommended ? ' recommended' : '');
        div.innerHTML = `
            <h3>${pkg.name}</h3>
            <div class="package-price">${pkg.price}</div>
            <ul>
                ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        packagesGrid.appendChild(div);
    });

    // Skills
    const skillsGrid = document.getElementById('skills-grid');
    data.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3 style="color: var(--accent-color);">${skill}</h3>`;
        skillsGrid.appendChild(div);
    });

    // Experience
    const expGrid = document.getElementById('experience-grid');
    data.experience.forEach(job => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${job.role}</h3>
            <p style="color: var(--secondary-color); font-size: 0.9rem;">${job.company} | ${job.duration}</p>
            <p style="margin-top: 10px;">${job.description}</p>
        `;
        expGrid.appendChild(div);
    });

    // Projects
    const projGrid = document.getElementById('projects-grid');
    data.projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${proj.name}</h3>
            <p style="margin: 10px 0;">${proj.description}</p>
            <div style="font-size: 0.85em; color: var(--accent-color);">
                ${proj.tech.map(t => `<span style="border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; margin-right: 5px; display: inline-block;">${t}</span>`).join('')}
            </div>
        `;
        projGrid.appendChild(div);
    });

    // Contact Info
    document.getElementById('contact-email').textContent = data.personalInfo.email;
    document.getElementById('contact-github').textContent = data.personalInfo.github;
    document.getElementById('contact-linkedin').textContent = data.personalInfo.linkedin;

    // Social Links
    const socialDiv = document.getElementById('social-links');
    const links = [
        { name: 'GitHub', url: data.personalInfo.github, icon: 'fab fa-github' },
        { name: 'LinkedIn', url: data.personalInfo.linkedin, icon: 'fab fa-linkedin' },
        { name: 'Email', url: 'mailto:' + data.personalInfo.email, icon: 'fas fa-envelope' }
    ];

    links.forEach(link => {
        if (link.url && !link.url.includes('example.com')) {
            const a = document.createElement('a');
            a.href = link.url.startsWith('http') || link.url.startsWith('mailto') ? link.url : 'https://' + link.url;
            a.target = '_blank';
            a.style.margin = '0 15px';
            a.style.fontSize = '1.5rem';
            a.innerHTML = `<i class="${link.icon}"></i> <span style="font-size: 0.8rem; display: block; margin-top: 5px;">${link.name}</span>`;
            socialDiv.appendChild(a);
        }
    });

    // Setup Contact Form
    setupContactForm();
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend call)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Show success message
            status.className = 'form-status success';
            status.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);

            // Log form data (for demonstration)
            console.log('Form submitted:', formData);
        }, 1500);
    });
}

async function runTerminalSequence() {
    const terminal = document.getElementById('terminal-text');
    const intro = document.getElementById('terminal-intro');
    const main = document.getElementById('main-content');

    const commands = [
        "> Initializing system...",
        "> Loading modules: [HTML5, CSS3, JS_Core]...",
        "> Connecting to database...",
        "> Accessing user profile: " + portfolioData.personalInfo.name + "...",
        "> ACCESS GRANTED."
    ];

    for (let cmd of commands) {
        await typeLine(terminal, cmd);
        await wait(500);
    }

    await wait(800);

    // Transition
    intro.style.transition = 'opacity 0.8s ease';
    intro.style.opacity = '0';

    setTimeout(() => {
        intro.style.display = 'none';
        main.classList.add('visible');
    }, 800);
}

function typeLine(element, text) {
    return new Promise(resolve => {
        const p = document.createElement('div');
        p.className = 'command-line';
        const span = document.createElement('span');
        span.className = 'prompt';
        span.textContent = "$";

        const content = document.createElement('span');
        p.appendChild(span);
        p.appendChild(content);

        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        p.appendChild(cursor); // Cursor at end of line being typed

        element.appendChild(p);

        let i = 0;
        const interval = setInterval(() => {
            content.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                cursor.remove(); // Remove cursor from finished line
                resolve();
            }
        }, 30); // Typing speed
    });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
