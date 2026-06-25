// GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// PRELOADER
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const heroText = document.querySelector(".hero-text");
  const heroImg = document.querySelector(".hero-image");

  // Hold for animation (name + line sweep, 1.9s) then fade
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      heroText?.classList.add("active");
      heroImg?.classList.add("active");
      setTimeout(startTyping, 120);
    }, 600); // should matche CSS transition
  }, 2100);
});

// TYPING EFFECT
const ROLES = [
  "Front-End Developer",
  "Game Designer",
  "Interactive Media Developer",
  "Unity Specialist",
  "UI / UX Enthusiast",
];

let roleIdx = 0,
  charIdx = 0,
  deleting = false;
const typedEl = document.getElementById("typed-text");

function startTyping() {
  if (!typedEl) return;
  typeStep();
}

function typeStep() {
  const current = ROLES[roleIdx];

  if (!deleting) {
    typedEl.textContent = current.substring(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      return setTimeout(typeStep, 1600);
    }
  } else {
    typedEl.textContent = current.substring(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % ROLES.length;
    }
  }

  setTimeout(typeStep, deleting ? 38 : 75);
}

// DARK MODE
const themeBtn = document.getElementById("theme-toggle");

(function initTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
})();

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
});

// SMOOTH NAV SCROLL
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = a.getAttribute("href");
    gsap.to(window, {
      duration: 1.1,
      scrollTo: { y: target, offsetY: 68 },
      ease: "power3.inOut",
    });
  });
});

// ACTIVE NAV LINK
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: () => {
    const scrollY = window.scrollY + 120;
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach((s) => {
      if (s.offsetTop <= scrollY) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  },
});

// SKILLS RENDER (Icons should load first)

document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderSkills === "function") renderSkills();
  initSkillsAnimation();
  initProjectCardsAnimation();
  initContactForm();
});

// GSAP SKILLS FLOAT UP
function initSkillsAnimation() {
  setTimeout(() => {
    document.querySelectorAll(".skills-row").forEach((row) => {
      const cards = row.querySelectorAll(".skill-card");
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.07,
        scrollTrigger: {
          trigger: row,
          start: "top 88%",
          toggleActions: "play reverse play reverse",
        },
      });
    });
  }, 100);
}

// GSAP PROJECT CARDS
function initProjectCardsAnimation() {
  // Featured cards, slide in from matching side
  document.querySelectorAll(".proj-card").forEach((card) => {
    const fromLeft = !card.classList.contains("reverse");
    const imgWrap = card.querySelector(".proj-img-wrap");
    const body = card.querySelector(".proj-body");

    gsap.from(imgWrap, {
      x: fromLeft ? -80 : 80,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 72%",
        toggleActions: "play reverse play reverse",
      },
    });

    gsap.from(body, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 72%",
        toggleActions: "play reverse play reverse",
      },
    });
  });

  // Mini cards fade up
  document.querySelectorAll(".mini-card").forEach((card, i) => {
    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      delay: (i % 3) * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 86%",
        toggleActions: "play reverse play reverse",
      },
    });
  });
}

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
let lbImages = [];
let lbIndex = 0;

function openLightbox(images, startIndex, caption) {
  lbImages = images;
  lbIndex = startIndex;
  lbImg.src = images[lbIndex];
  lbCaption.textContent = caption || "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  lbImg.style.opacity = "0";
  setTimeout(() => {
    lbImg.src = lbImages[lbIndex];
    lbImg.style.opacity = "1";
  }, 150);
}

document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
document.getElementById("lb-prev")?.addEventListener("click", () => lbNav(-1));
document.getElementById("lb-next")?.addEventListener("click", () => lbNav(1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbNav(-1);
  if (e.key === "ArrowRight") lbNav(1);
});

// Attach lightbox to project image wrappers
document.querySelectorAll(".proj-img-wrap[data-images]").forEach((wrap) => {
  wrap.addEventListener("click", () => {
    const imgs = wrap.dataset.images.split(",");
    const caption = wrap.dataset.caption || "";
    openLightbox(imgs, 0, caption);
  });
});

// CONTACT FORM
function initContactForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  const validate = (input, test, msg) => {
    const err = input.closest(".form-row").querySelector(".error-msg");
    const ok = typeof test === "function" ? test(input.value) : test;
    input.classList.toggle("input-error", !ok);
    input.classList.toggle("input-success", ok);
    if (err) err.textContent = ok ? "" : msg;
    return ok;
  };

  // Live validation
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "name") validate(t, t.value.trim() !== "", "Name is required");
    if (t.id === "email")
      validate(
        t,
        (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
        "Enter a valid email",
      );
    if (t.id === "message")
      validate(t, t.value.trim() !== "", "Message is required");
  });

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameEl = form.querySelector("#name");
    const emailEl = form.querySelector("#email");
    const messageEl = form.querySelector("#message");

    const v1 = validate(nameEl, nameEl.value.trim() !== "", "Name is required");
    const v2 = validate(
      emailEl,
      (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
      "Enter a valid email",
    );
    const v3 = validate(
      messageEl,
      messageEl.value.trim() !== "",
      "Message is required",
    );

    if (!(v1 && v2 && v3)) return;

    // Store
    const msgs = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    msgs.push({
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      message: messageEl.value.trim(),
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("contactMessages", JSON.stringify(msgs));

    // Reset
    form.reset();
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.classList.remove("input-success", "input-error");
    });

    // Show inline success
    if (success) {
      success.classList.add("show");
      setTimeout(() => success.classList.remove("show"), 5000);
    }
  });
}

// BACK TO TOP progress ring
(function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  const ring = document.getElementById("btt-ring");
  if (!btn || !ring) return;

  const R = 21; // radius (matches SVG)
  const CIRC = 2 * Math.PI * R;
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = CIRC; // start empty

  let heroBottom = 0;

  function getHeroBottom() {
    const hero = document.querySelector(".hero");
    heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
  }

  getHeroBottom();
  window.addEventListener("resize", getHeroBottom);

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrolled / docHeight, 1);

    ring.style.strokeDashoffset = CIRC * (1 - progress);
    btn.classList.toggle("visible", scrolled > heroBottom);
  });

  btn.addEventListener("click", () => {
    gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: "power3.inOut" });
  });
})();
