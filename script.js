// ===== PARTICLE BACKGROUND (bio/food network) =====
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const COUNT = window.innerWidth < 768 ? 40 : 75;
  const LINK = 120;
  const GREEN = '76, 175, 80';
  const SOFT = '102, 187, 106';

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function make() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.8
    }));
  }

  const mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${SOFT}, 0.85)`;
      ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${GREEN}, 0.7)`;
      ctx.fill(); ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${GREEN}, ${0.2 * (1 - d / LINK)})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < LINK * 1.8) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${SOFT}, ${0.3 * (1 - d / (LINK * 1.8))})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize(); make(); draw();
  window.addEventListener('resize', () => { resize(); make(); });
})();

// ===== TYPING EFFECT =====
const phrases = [
  "Veterinary Medicine @ Ankara University",
  "Food Hygiene & Technology — PhD Student",
  "HACCP · ISO 22000 · Food Safety Systems",
  "Aquaponics · Poultry Technology · One Health"
];
const el = document.getElementById('typed-text');
let pi = 0, ci = 0, del = false;
function type() {
  const cur = phrases[pi];
  el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
  del ? ci-- : ci++;
  let t = del ? 40 : 85;
  if (!del && ci === cur.length) { t = 1800; del = true; }
  else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; t = 400; }
  setTimeout(type, t);
}
document.addEventListener('DOMContentLoaded', type);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

// ===== SCROLL REVEAL =====
document.querySelectorAll('.stack-card, .project-card, .project-group, .section-title, .phd-banner')
  .forEach(el => {
    el.classList.add('reveal');
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { e.target.classList.add('visible'); } }, { threshold: 0.1 })
      .observe(el);
  });
