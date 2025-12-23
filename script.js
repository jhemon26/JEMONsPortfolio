/* =========================
   script.js
   FULL FIXED VERSION
   ========================= */


/* =========================================================
   0) CENTER PAGE ON LOAD (TOP-CENTER)
   fixes desktop-width pages opening left on mobile
========================================================= */

function centerTopView() {
  // always go to top
  window.scrollTo(0, 0);

  const doc = document.documentElement;
  const maxLeft = doc.scrollWidth - doc.clientWidth;

  if (maxLeft > 0) {
    const center = Math.round(maxLeft / 2);
    doc.scrollLeft = center;
    document.body.scrollLeft = center;
  } else {
    doc.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  centerTopView();
  setTimeout(centerTopView, 60);
  setTimeout(centerTopView, 180);
  setTimeout(centerTopView, 400);
});

window.addEventListener("pageshow", () => {
  centerTopView();
  setTimeout(centerTopView, 120);
});

window.addEventListener("orientationchange", () => {
  setTimeout(centerTopView, 200);
});


/* =========================================================
   1) PAGE CHANGE (fade + centered start)
========================================================= */

function goToPage(page) {
  centerTopView();
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = page;
  }, 500);
}


/* =========================================================
   2) STARFIELD (general + IT) — MOBILE SAFE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (
    !document.body.classList.contains("general-dark") &&
    !document.body.classList.contains("it-page")
  ) return;

  const canvas = document.getElementById("starfield-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function layoutSize() {
    const doc = document.documentElement;
    return {
      w: Math.max(doc.clientWidth, doc.scrollWidth, window.innerWidth),
      h: Math.max(window.innerHeight, doc.clientHeight)
    };
  }

  function resize() {
    const { w, h } = layoutSize();
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", () => setTimeout(resize, 150));
  window.visualViewport?.addEventListener("resize", resize);

  const STAR_COUNT = 320;
  let stars = [];

  function initStars() {
    const { w, h } = layoutSize();
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h + window.scrollY,
      speed: Math.random() * 1 + 0.2
    }));
  }

  initStars();

  function animate() {
    const { w, h } = layoutSize();
    const scrollY = window.scrollY;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "white";

    for (const s of stars) {
      s.y += s.speed;
      const sy = s.y - scrollY;

      if (sy >= -5 && sy <= h + 5) {
        ctx.beginPath();
        ctx.arc(s.x, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (sy > h + 10) {
        s.y = scrollY - Math.random() * 80;
        s.x = Math.random() * w;
        s.speed = Math.random() * 1 + 0.2;
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", initStars);
  animate();
});


/* =========================================================
   3) PROJECT SLIDERS (UNCHANGED)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".projects-wide");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".projects-wide-track");
    const slides = Array.from(slider.querySelectorAll(".projects-wide-card"));
    const prevBtn = slider.querySelector(".projects-nav-wide.prev");
    const nextBtn = slider.querySelector(".projects-nav-wide.next");

    const dotsWrap = slider.nextElementSibling?.classList.contains("projects-wide-dots")
      ? slider.nextElementSibling
      : null;

    if (!track || slides.length === 0 || !dotsWrap) return;

    let index = 0;
    dotsWrap.innerHTML = "";

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "projects-wide-dot" + (i === 0 ? " active" : "");
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
      return b;
    });

    function update() {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    update();
  });
});


/* =========================================================
   4) SNOWFALL (hospitality) — MOBILE SAFE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("hospitality-page")) return;

  const canvas = document.getElementById("snowfield-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function layoutSize() {
    const doc = document.documentElement;
    return {
      w: Math.max(doc.clientWidth, doc.scrollWidth, window.innerWidth),
      h: Math.max(window.innerHeight, doc.clientHeight)
    };
  }

  let W = 0, H = 0;

  function resize() {
    const s = layoutSize();
    W = s.w;
    H = s.h;

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", () => setTimeout(resize, 150));
  window.visualViewport?.addEventListener("resize", resize);

  const flakes = Array.from({ length: 240 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2.2 + 0.7,
    vy: Math.random() * 1.4 + 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    wobble: Math.random() * Math.PI * 2
  }));

  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.9)";

    for (const f of flakes) {
      f.wobble += 0.01;
      f.x += f.vx + Math.sin(f.wobble) * 0.35;
      f.y += f.vy;

      if (f.y > H + 12) {
        f.y = -12;
        f.x = Math.random() * W;
      }

      if (f.x < -20) f.x = W + 20;
      if (f.x > W + 20) f.x = -20;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  tick();
});


/* =========================================================
   5) LIVE PROJECT MODAL (UNCHANGED)
========================================================= */

function openLiveModal(e){
  e.preventDefault();
  const modal = document.getElementById("liveModal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLiveModal(){
  const modal = document.getElementById("liveModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const overlay = document.getElementById("liveModal");
  if (overlay?.classList.contains("active") && e.target === overlay) {
    closeLiveModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLiveModal();
});
