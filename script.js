const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const enterButton = document.getElementById("enterButton");
const goldDust = document.getElementById("goldDust");

function createGoldDust() {
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("span");
    particle.className = "dust";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${9 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 12}s`;
    goldDust.appendChild(particle);
  }
}
createGoldDust();

function revealSections() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
}

enterButton.addEventListener("click", () => {
  intro.style.transition = "opacity .7s ease, transform .7s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.02)";
  window.setTimeout(() => {
    intro.style.display = "none";
    mainContent.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
    revealSections();
  }, 700);
});

// Open a memory in the full-screen photo viewer.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

// Birthday cake candles and celebration.
const wishButton = document.getElementById("wishButton");
const wishResult = document.getElementById("wishResult");
let wishMade = false;
wishButton.addEventListener("click", () => {
  document.querySelectorAll(".candle").forEach(candle => candle.classList.remove("lit"));
  wishMade = true;
  wishButton.textContent = "Your wish is on its way ✦";
  wishResult.textContent = "May your wish come true, Anil. Happy 29th! ✨";
  launchConfetti();
});
document.querySelectorAll(".candle").forEach(candle => {
  candle.addEventListener("click", () => candle.classList.toggle("lit"));
});

// Confetti is drawn on canvas, so no external library is needed.
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let pieces = [];
let frame = null;
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti() {
  pieces = Array.from({ length: 125 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.4,
    size: 3 + Math.random() * 5,
    speed: 2 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 2.4,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.12,
    alpha: 1
  }));
  if (frame) cancelAnimationFrame(frame);
  animateConfetti();
}
function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces.forEach(piece => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;
    piece.alpha -= 0.0028;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = Math.max(0, piece.alpha);
    ctx.fillStyle = Math.random() > 0.25 ? "#d6b36a" : "#f3e5c2";
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.8);
    ctx.restore();
  });
  pieces = pieces.filter(piece => piece.y < window.innerHeight + 30 && piece.alpha > 0);
  if (pieces.length) frame = requestAnimationFrame(animateConfetti);
  else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    frame = null;
  }
}

document.getElementById("replayButton").addEventListener("click", () => {
  closeLightbox();
  mainContent.classList.add("is-hidden");
  intro.style.display = "flex";
  intro.style.opacity = "1";
  intro.style.transform = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
});
