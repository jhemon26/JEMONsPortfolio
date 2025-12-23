/* =========================
   script.js
   ========================= */


/* =========================================================
   1) PAGE CHANGE (fade out then go)
========================================================= */

function goToPage(page) {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = page;
  }, 500);
}


/* =========================================================
   2) STARFIELD (general + IT only)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // only run on these pages
  if (
    !document.body.classList.contains("general-dark") &&
    !document.body.classList.contains("it-page")
  ) return;

  const canvas = document.getElementById("starfield-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  // resize canvas to match screen
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const STAR_COUNT = 300;

  // world coords so scrolling doesn't break the stars
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.scrollY,
    speed: Math.random() * 1 + 0.2
  }));

  function animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scrollY = window.scrollY;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "white";

    for (const s of stars) {
      // move in world space
      s.y += s.speed;

      // convert to screen space
      const screenY = s.y - scrollY;

      // draw only if visible
      if (screenY >= -5 && screenY <= h + 5) {
        ctx.beginPath();
        ctx.arc(s.x, screenY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // if it drops past the bottom, respawn above the current view
      if (screenY > h + 10) {
        s.y = scrollY - Math.random() * 80;
        s.x = Math.random() * w;
        s.speed = Math.random() * 1 + 0.2;
      }

      // keep x valid if width changes
      if (s.x > w) s.x = Math.random() * w;
    }

    requestAnimationFrame(animate);
  }

  animate();
});


/* =========================================================
   3) SLIDERS (supports multiple sliders on one page)
   - works for "done" slider + "working on" slider
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".projects-wide");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".projects-wide-track");
    const slides = Array.from(slider.querySelectorAll(".projects-wide-card"));
    const prevBtn = slider.querySelector(".projects-nav-wide.prev");
    const nextBtn = slider.querySelector(".projects-nav-wide.next");

    // dots are the next element after the slider
    const dotsWrap = slider.nextElementSibling?.classList.contains("projects-wide-dots")
      ? slider.nextElementSibling
      : null;

    if (!track || slides.length === 0 || !dotsWrap) return;

    let index = 0;

    // build dots
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

    // arrows
    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    // swipe (mobile)
    const viewport = slider.querySelector(".projects-wide-viewport");
    let startX = 0, dragging = false;

    viewport?.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });

    viewport?.addEventListener("touchend", (e) => {
      if (!dragging) return;
      dragging = false;

      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;

      if (Math.abs(dx) > 45) {
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      }
    }, { passive: true });

    update();
  });
});


/* =========================================================
   4) SNOWFALL (hospitality only)
========================================================= */

if (document.body.classList.contains("hospitality-page")) {
  const canvas = document.getElementById("snowfield-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let W = 0, H = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // snow particles
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
        // wobble left/right + fall down
        f.wobble += 0.01;

        f.x += f.vx + Math.sin(f.wobble) * 0.35;
        f.y += f.vy;

        // respawn at top
        if (f.y > H + 12) {
          f.y = -12;
          f.x = Math.random() * W;
        }

        // wrap sides
        if (f.x < -20) f.x = W + 20;
        if (f.x > W + 20) f.x = -20;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    tick();
  }
}


/* =========================================================
   5) NEURAL ORB TILT (IT page decoration)
========================================================= */

(() => {
  const orb = document.querySelector(".neural-orb");
  if (!orb) return;

  // tilt with mouse position
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    orb.style.transform = `translateY(-2px) rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
  });

  // reset when mouse leaves window
  window.addEventListener("mouseleave", () => {
    orb.style.transform = "";
  });
})();


/* =========================================================
   6) LIVE PROJECT POPUP (modal)
========================================================= */

function openLiveModal(e){
  e.preventDefault();

  const modal = document.getElementById("liveModal");
  if (!modal) return;

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // stop scroll behind it
}

function closeLiveModal(){
  const modal = document.getElementById("liveModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = ""; // bring scroll back
}

// click outside the box = close
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("liveModal");
  if (!overlay || !overlay.classList.contains("active")) return;
  if (e.target === overlay) closeLiveModal();
});

// ESC key = close
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const overlay = document.getElementById("liveModal");
  if (!overlay || !overlay.classList.contains("active")) return;
  closeLiveModal();
});
