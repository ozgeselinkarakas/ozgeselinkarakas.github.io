// ===== FLUORESCENCE MICROSCOPY BACKGROUND =====
// Bacteria-shaped particles (cocci + bacilli) on dark field — like GFP microscopy
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, organisms;

  const COUNT = window.innerWidth < 768 ? 28 : 55;
  const TYPES = ['coccus', 'diplococcus', 'bacillus', 'coccobacillus'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function makeOrganism() {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    return {
      type,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.004,
      r: randBetween(3, 7),
      opacity: randBetween(0.35, 0.9),
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: randBetween(0.008, 0.02),
    };
  }

  function make() { organisms = Array.from({ length: COUNT }, makeOrganism); }

  function drawOrganism(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.angle);

    const pulse = 1 + 0.06 * Math.sin(o.phase);
    const glow = Math.abs(Math.sin(o.phase)) * 12 + 4;
    const alpha = o.opacity;

    ctx.shadowBlur = glow;
    ctx.shadowColor = `rgba(100, 220, 120, ${alpha * 0.8})`;

    if (o.type === 'coccus') {
      ctx.beginPath();
      ctx.arc(0, 0, o.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80, 200, 100, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-o.r * 0.25, -o.r * 0.25, o.r * 0.35 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 255, 190, ${alpha * 0.5})`;
      ctx.fill();

    } else if (o.type === 'diplococcus') {
      const gap = o.r * 0.9;
      ctx.beginPath();
      ctx.arc(-gap * 0.5, 0, o.r * 0.85 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80, 200, 100, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(gap * 0.5, 0, o.r * 0.85 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80, 200, 100, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, o.r * 0.25 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140, 255, 160, ${alpha * 0.6})`;
      ctx.fill();

    } else if (o.type === 'bacillus') {
      const len = o.r * 2.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, len * pulse, o.r * 0.7 * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(60, 180, 90, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, len * 0.65 * pulse, o.r * 0.35 * pulse, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140, 255, 160, ${alpha * 0.35})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

    } else if (o.type === 'coccobacillus') {
      ctx.beginPath();
      ctx.ellipse(0, 0, o.r * 1.5 * pulse, o.r * 0.9 * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(70, 190, 95, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-o.r * 0.3, -o.r * 0.2, o.r * 0.4 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 255, 170, ${alpha * 0.45})`;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBiofilmLinks() {
    for (let i = 0; i < organisms.length; i++) {
      for (let j = i + 1; j < organisms.length; j++) {
        const a = organisms[i], b = organisms[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(60, 160, 80, ${0.18 * (1 - d / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function drawHexGrid() {
    const size = 52;
    const cols = Math.ceil(w / (size * 1.73)) + 2;
    const rows = Math.ceil(h / (size * 1.5)) + 2;
    ctx.strokeStyle = 'rgba(46, 125, 50, 0.055)';
    ctx.lineWidth = 0.8;
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * size * 1.73 + (row % 2 === 0 ? 0 : size * 0.865);
        const y = row * size * 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    drawHexGrid();
    if (frame % 3 === 0) drawBiofilmLinks();
    for (const o of organisms) {
      o.x += o.vx; o.y += o.vy;
      o.angle += o.spin;
      o.phase += o.pulseSpeed;
      if (o.x < -20) o.x = w + 20;
      if (o.x > w + 20) o.x = -20;
      if (o.y < -20) o.y = h + 20;
      if (o.y > h + 20) o.y = -20;
      drawOrganism(o);
    }
    frame++;
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
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    }, { threshold: 0.1 }).observe(el);
  });
