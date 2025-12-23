/* =========================
   script.js
   
   ========================= */


/* =========================================================
   0) START TOP + CENTER (fix desktop-layout opening on mobile)
========================================================= */

function centerTopView() {
  // always go to top
  window.scrollTo(0, 0);

  // if page is wider than viewport, center horizontally
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
   1) PAGE CHANGE (fade out then go)
========================================================= */

function goToPage(page) {
  centerTopView();
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = page;
  }, 500);
}


/* =========================================================
   2) STARFIELD (general + IT only) ✅ FIXED FOR MOBILE
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

      if (s.x > w) s.x = Math.random() * w;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", initStars);
  animate();
});


/* =========================================================
   3) SLIDERS (supports multiple sliders on one page)
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
   4) SNOWFALL (hospitality only) ✅ FIXED FOR MOBILE
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
    const size = layoutSize();
    W = size.w;
    H = size.h;

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
   5) NEURAL ORB TILT (IT page decoration)
========================================================= */

(() => {
  const orb = document.querySelector(".neural-orb");
  if (!orb) return;

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    orb.style.transform = `translateY(-2px) rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
  });

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
  if (!overlay || !overlay.classList.contains("active")) return;
  if (e.target === overlay) closeLiveModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const overlay = document.getElementById("liveModal");
  if (!overlay || !overlay.classList.contains("active")) return;
  closeLiveModal();
});


/* =========================================================
   7) IT EXPANDABLE CARDS (FIXED):
   - natural height when closed (no title clipping)
   - click expands to fit text
   - typewriter effect
   - stays 10s then collapses back
   - IMPORTANT: cancels old timers/typing when switching cards (fixes glitches)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const expandable = document.querySelectorAll(".it-card-expandable");
  if (!expandable.length) return;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // per-card state so async work can be cancelled safely
  const state = new WeakMap();
  expandable.forEach(card => state.set(card, { token: 0 }));

  async function typeText(el, text, speed, isCancelled) {
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (isCancelled()) return;
      el.textContent += text[i];
      await sleep(speed);
    }
  }

  function setHeight(card, px) {
    card.style.height = px + "px";
  }

  function clearHeight(card) {
    card.style.height = "";
  }

  function cancelCard(card) {
    const s = state.get(card);
    if (!s) return;
    s.token++; // invalidate any running async tasks
  }

  function closeInstant(card) {
    cancelCard(card);
    card.classList.remove("is-open", "is-selected", "is-typing");
    const typed = card.querySelector(".it-typed");
    if (typed) typed.textContent = "";
    clearHeight(card);
  }

  function closeAnimated(card) {
    cancelCard(card);
    const typed = card.querySelector(".it-typed");
    if (typed) typed.textContent = "";

    // freeze current height so animation is smooth
    setHeight(card, card.getBoundingClientRect().height);

    requestAnimationFrame(() => {
      card.classList.remove("is-open", "is-typing");

      setTimeout(() => {
        card.classList.remove("is-selected");
        clearHeight(card); // back to natural height
      }, 420);
    });
  }

  async function openCard(card) {
    // close others instantly + cancel their timers
    expandable.forEach(c => { if (c !== card) closeInstant(c); });

    const s = state.get(card);
    if (!s) return;

    // new run token for this open
    s.token++;
    const myToken = s.token;

    const isCancelled = () => state.get(card)?.token !== myToken;

    const typed = card.querySelector(".it-typed");
    const back = card.querySelector(".it-card-back");
    const text = card.getAttribute("data-type-text") || "";

    if (!typed || !back) return;

    // freeze current closed height
    setHeight(card, card.getBoundingClientRect().height);

    card.classList.add("is-open", "is-selected");
    await sleep(60);
    if (isCancelled()) return;

    // expand to fit back content
    const target = Math.max(card.getBoundingClientRect().height, back.scrollHeight);
    setHeight(card, target);

    await sleep(220);
    if (isCancelled()) return;

    card.classList.add("is-typing");
    await typeText(typed, text, 18, isCancelled);
    if (isCancelled()) return;

    card.classList.remove("is-typing");

    await sleep(60);
    if (isCancelled()) return;

    // final height adjustment after typing
    setHeight(card, Math.max(back.scrollHeight, card.getBoundingClientRect().height));

    // stay 10 seconds then close (but only if still the same open token)
    await sleep(10000);
    if (isCancelled()) return;

    closeAnimated(card);
  }

  expandable.forEach(card => {
    card.tabIndex = 0;

    card.addEventListener("click", () => {
      if (card.classList.contains("is-selected")) {
        closeAnimated(card);
        return;
      }
      openCard(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
});

