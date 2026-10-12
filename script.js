/* =============================================
   SMBK PORTFOLIO — FULL MAZEDAAR JAVASCRIPT
   ============================================= */

'use strict';

// ==================== LOADER ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    initHeroCanvas();
    initTyped();
    animateHeroOnLoad();
  }, 2400);
});

// ==================== CURSOR ====================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let cursorX = mouseX, cursorY = mouseY;
let followerX = mouseX, followerY = mouseY;
let cursorVisible = false;

// Track mouse position with passive listener
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!cursorVisible) {
    cursorVisible = true;
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  }
}, { passive: true });

// Butter-smooth hardware-accelerated RAF loop with lerp
function renderCursor() {
  // Cursor inner dot follows almost instantaneously (crisp feel)
  cursorX += (mouseX - cursorX) * 0.75;
  cursorY += (mouseY - cursorY) * 0.75;
  cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

  // Follower ring follows smoothly (0.18 for responsive yet fluid feel)
  followerX += (mouseX - followerX) * 0.18;
  followerY += (mouseY - followerY) * 0.18;
  follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

  requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);

// Efficient event delegation for hover states (replaces dozens of individual listeners)
const hoverSelector = 'a, button, input, textarea, select, [data-tilt], label, ' +
  '.nav-link, .btn-primary, .btn-secondary, .btn-outline, .btn-hire, ' +
  '.social-link, .project-card, .cert-card, .soft-skill, ' +
  '.lang-bubble, .db-card, .contact-link-item, .skill-bar-item, ' +
  '.hamburger, #back-to-top, .overlay-btn, .project-link, ' +
  '.orbit-planet, .float-stat, .footer-socials a, .ai-skill-tag';

document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverSelector)) {
    cursor.classList.add('hovering');
    follower.classList.add('hovering');
  }
}, { passive: true });

document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverSelector)) {
    cursor.classList.remove('hovering');
    follower.classList.remove('hovering');
  }
}, { passive: true });

// Click burst effect
document.addEventListener('mousedown', () => {
  cursor.classList.add('clicking');
  follower.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicking');
  follower.classList.remove('clicking');
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  follower.style.opacity = '1';
});


// ==================== PARTICLES ====================
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 900 } },
    color: { value: ['#6366f1', '#06b6d4', '#818cf8'] },
    shape: { type: 'circle' },
    opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false } },
    size: { value: 2.5, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
    line_linked: {
      enable: true,
      distance: 130,
      color: '#6366f1',
      opacity: 0.15,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: true,
      out_mode: 'out'
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' }
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.5 } },
      push: { particles_nb: 3 }
    }
  },
  retina_detect: true
});

// ==================== HERO THREE.JS CANVAS ====================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Geometry grid
  const gridHelper = new THREE.GridHelper(30, 30, 0x6366f1, 0x1a1a2e);
  gridHelper.position.y = -3;
  scene.add(gridHelper);

  // Floating dodecahedrons
  const shapes = [];
  const geoms = [
    new THREE.DodecahedronGeometry(0.4),
    new THREE.OctahedronGeometry(0.3),
    new THREE.TetrahedronGeometry(0.35),
    new THREE.IcosahedronGeometry(0.3),
  ];
  const matColors = [0x6366f1, 0x06b6d4, 0x818cf8, 0xf59e0b];

  for (let i = 0; i < 20; i++) {
    const g = geoms[Math.floor(Math.random() * geoms.length)];
    const mat = new THREE.MeshPhongMaterial({
      color: matColors[Math.floor(Math.random() * matColors.length)],
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const mesh = new THREE.Mesh(g, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.003
    };
    shapes.push(mesh);
    scene.add(mesh);
  }

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0x6366f1, 2, 20);
  point1.position.set(5, 5, 5);
  scene.add(point1);
  const point2 = new THREE.PointLight(0x06b6d4, 1.5, 20);
  point2.position.set(-5, -3, 3);
  scene.add(point2);

  // Mouse parallax
  let mouseX3D = 0, mouseY3D = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX3D = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY3D = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    shapes.forEach(m => {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.position.y += m.userData.vy;
      if (m.position.y > 6) m.position.y = -6;
      if (m.position.y < -6) m.position.y = 6;
    });
    camera.position.x += (mouseX3D * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (mouseY3D * 0.3 - camera.position.y) * 0.04;
    gridHelper.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ==================== TYPED.JS ====================
function initTyped() {
  new Typed('#typed-text', {
    strings: [
      'Full Stack Developer',
      'ASP.NET Core Engineer',
      'ERP/CRM Specialist',
      'AI & Data Enthusiast',
      'Power Platform Developer',
      'Problem Solver 🚀'
    ],
    typeSpeed: 55,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
}

// ==================== HERO ANIMATIONS ====================
function animateHeroOnLoad() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero text stagger
  gsap.from('.hero-badge', { duration: 0.8, opacity: 0, y: 30, ease: 'power3.out' });
  gsap.from('.hero-greeting', { duration: 0.8, opacity: 0, y: 30, delay: 0.2, ease: 'power3.out' });
  gsap.from('.hero-btns', { duration: 0.8, opacity: 0, y: 30, delay: 0.6, ease: 'power3.out' });
  gsap.from('.hero-socials', { duration: 0.8, opacity: 0, y: 30, delay: 0.8, ease: 'power3.out' });
  gsap.from('.hero-3d-card', {
    duration: 1.2, opacity: 0, x: 80, ease: 'power4.out', delay: 0.4
  });

  // ScrollTrigger animations
  // Skill bars
  ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        gsap.to(bar, { width: w + '%', duration: 1.6, ease: 'power3.out' });
      });
    }
  });

  // Counter animation
  ScrollTrigger.create({
    trigger: '#stats',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.counter').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isFloat = !Number.isInteger(target);
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = start + (target - start) * ease;
          el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = isFloat ? target.toFixed(1) : target;
        }
        requestAnimationFrame(update);
      });
    }
  });

  // Parallax sections
  gsap.utils.toArray('section').forEach(sec => {
    gsap.fromTo(sec.querySelector('.section-header'), {
      y: 0
    }, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Back to top & Scroll Progress
  const btt = document.getElementById('back-to-top');
  const bttFill = document.querySelector('.btt-bar-fill');
  if (btt) {
    btt.classList.toggle('visible', window.scrollY > 300);
    if (bttFill) {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
      bttFill.style.height = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }

  // Active nav
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Mobile Nav
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navbar.classList.toggle('mobile-open');
});
navOverlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navbar.classList.remove('mobile-open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbar.classList.remove('mobile-open');
  });
});
const navHireBtn = document.querySelector('.nav-cta .btn-hire');
if (navHireBtn) {
  navHireBtn.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbar.classList.remove('mobile-open');
  });
}

// Back to top
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== AOS ====================
AOS.init({
  duration: 900,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic'
});

// ==================== VANILLA TILT ====================
VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
  max: 10,
  speed: 400,
  glare: true,
  'max-glare': 0.2,
  gyroscope: true
});

// ==================== CONTACT FORM (FORMSPREE AJAX) ====================
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('.form-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      if (contactStatus) {
        contactStatus.className = 'contact-status error';
        contactStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
      }
      return;
    }

    // Set UI to loading state
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    }
    if (contactStatus) {
      contactStatus.className = 'contact-status sending';
      contactStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting your message to Syed...';
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://formspree.io/f/xaeqdljo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        if (btn) {
          btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
          btn.style.background = 'linear-gradient(135deg, #10b981, #047857)';
        }
        if (contactStatus) {
          contactStatus.className = 'contact-status success';
          contactStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you, ' + name + '! Your message has been sent to Syed\'s inbox.';
        }
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        let errorMsg = 'Oops! There was a problem submitting your form.';
        if (data.errors && data.errors.length) {
          errorMsg = data.errors.map(err => err.message).join(', ');
        }
        if (contactStatus) {
          contactStatus.className = 'contact-status error';
          contactStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMsg}`;
        }
      }
    } catch (err) {
      if (contactStatus) {
        contactStatus.className = 'contact-status error';
        contactStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network error. Please try again or reach out directly via WhatsApp/Email.';
      }
    } finally {
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
          btn.style.background = '';
        }
      }, 4000);

      setTimeout(() => {
        if (contactStatus && contactStatus.classList.contains('success')) {
          contactStatus.className = 'contact-status';
          contactStatus.innerHTML = '';
        }
      }, 8000);
    }
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ==================== MAGNETIC BUTTONS ====================
document.querySelectorAll('.btn-primary, .btn-secondary, .social-link').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ==================== ORBIT INTERACTION ====================
// Pause orbit on hover
document.querySelectorAll('.orbit-ring').forEach(ring => {
  ring.addEventListener('mouseenter', () => {
    ring.style.animationPlayState = 'paused';
    ring.querySelectorAll('.orbit-planet').forEach(p => p.style.animationPlayState = 'paused');
  });
  ring.addEventListener('mouseleave', () => {
    ring.style.animationPlayState = 'running';
    ring.querySelectorAll('.orbit-planet').forEach(p => p.style.animationPlayState = 'running');
  });
});

// ==================== SECTION GLOW ENTER ====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(sec => observer.observe(sec));

// ==================== RIPPLE EFFECT ====================
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      transform:scale(0);
      animation:ripple-anim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
@keyframes ripple-anim {
  to { transform:scale(2.5); opacity:0; }
}
`;
document.head.appendChild(style);

// ==================== FLOATING BACKGROUND SHAPES ====================
function createBgShapes() {
  const shapes = [
    { x: '10%', y: '20%', size: '300px', color: 'rgba(99,102,241,0.04)' },
    { x: '80%', y: '60%', size: '400px', color: 'rgba(6,182,212,0.04)' },
    { x: '50%', y: '40%', size: '250px', color: 'rgba(245,158,11,0.03)' },
  ];
  shapes.forEach(s => {
    const el = document.createElement('div');
    el.className = 'bg-shape';
    el.style.cssText = `
      left:${s.x};top:${s.y};
      width:${s.size};height:${s.size};
      background:${s.color};
      position:fixed;z-index:0;pointer-events:none;
      filter:blur(80px);border-radius:50%;
      animation:float-shape ${10 + Math.random()*10}s ease infinite alternate;
    `;
    document.body.appendChild(el);
  });
  const shapeStyle = document.createElement('style');
  shapeStyle.textContent = `
    @keyframes float-shape {
      from { transform:translate(0,0) scale(1); }
      to   { transform:translate(40px,30px) scale(1.1); }
    }
  `;
  document.head.appendChild(shapeStyle);
}
createBgShapes();

// ==================== SKILL BAR HOVER GLOW ====================
document.querySelectorAll('.skill-bar-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const bar = item.querySelector('.bar-fill');
    bar.style.boxShadow = '0 0 20px rgba(99,102,241,0.8)';
  });
  item.addEventListener('mouseleave', () => {
    const bar = item.querySelector('.bar-fill');
    bar.style.boxShadow = '0 0 10px rgba(99,102,241,0.5)';
  });
});

// ==================== GLITCH ON HOVER (NAV LOGO) ====================
const navLogo = document.querySelector('.nav-logo');
navLogo.addEventListener('mouseenter', () => {
  navLogo.style.animation = 'glitch 0.4s ease';
  setTimeout(() => navLogo.style.animation = '', 400);
});

// ==================== TILT ON HERO CARD (mouse) ====================
const heroCard = document.getElementById('hero-3d');
if (heroCard) {
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = (e.clientY - cy) / (rect.height / 2) * -12;
    const ry = (e.clientX - cx) / (rect.width / 2) * 12;
    heroCard.querySelector('.card-inner').style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.querySelector('.card-inner').style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });
}

// ==================== REVEAL ANIMATION for CERT CARDS ====================
const certCards = document.querySelectorAll('.cert-card');
certCards.forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
});

// ==================== PROJECT CARD CLICKS ====================
document.querySelectorAll('.project-card').forEach(card => {
  const link = card.querySelector('.overlay-btn') || card.querySelector('.project-link');
  const imgWrapper = card.querySelector('.project-img-wrapper');
  if (link && imgWrapper) {
    imgWrapper.addEventListener('click', (e) => {
      // If user directly clicked the <a> tag itself, allow normal browser behavior
      if (e.target.closest('a') === link) return;
      e.preventDefault();
      window.open(link.getAttribute('href'), '_blank', 'noopener,noreferrer');
    });
  }
});

// ==================== CONSOLE EASTER EGG ====================
console.log('%c🚀 SMBK Portfolio', 'font-size:24px;font-weight:bold;color:#6366f1;');
console.log('%cBuilt with 💙 by Syed Muhammad Khalid', 'font-size:14px;color:#06b6d4;');
console.log('%cGitHub: https://github.com/SMBK-04', 'font-size:12px;color:#818cf8;');
console.log('%cLinkedIn: https://linkedin.com/in/syed-muhammad-khalid1196', 'font-size:12px;color:#818cf8;');
