// PRELOADER AND HERO ANIMATION
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const heroText = document.querySelector(".hero-text");
    const heroImage = document.querySelector(".hero-image");

    const holdTime = 0;   // how long loader stays 1500
    const fadeTime = 100;    // fade out duration

    // loader stays for hold time
    setTimeout(() => {
        loader.classList.add("fade-out");

        // waits for fade out to finish before hiding loader and showing content
        setTimeout(() => {
            heroText.classList.add("active");

            if (heroImage) {
                heroImage.classList.add("active");
            }

            setTimeout(() => {
                typeEffect(); // Start typing effect after content is visible
            }, 100);

        }, fadeTime);

    }, holdTime);
});

// SMOOTH SCROLLING FOR NAV LINKS
gsap.registerPlugin(ScrollToPlugin);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = this.getAttribute("href");

        gsap.to(window, {
            duration: 1.2,
            scrollTo:{
                y: target,
                offsetY: 30
            },
            ease: "power2.inOut"
        });
    });
});

// Typing Effect
const roles = [
    "Web Developer",
    "Game Designer",
    "Interactive Media Developer",
    "Unity Specialist",
    "Front-End Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typedText = document.getElementById("typed-text");

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedText.textContent = currentRole.substring(0, charIndex++);

        if (charIndex > currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typedText.textContent = currentRole.substring(0, charIndex--);

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 40 : 80);
}

// NAVBAR ACTIVE STATE
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight; 

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

// DARK MODE
const toggleBtn = document.getElementById("theme-toggle");

// Load preference on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});

// Save preference to localStorage
toggleBtn.addEventListener("click", () => { 
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    // Save the user's preference in localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");

    toggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// GSAP ANIMATIONS
gsap.registerPlugin(ScrollTrigger);

// Main project slide in
gsap.utils.toArray(".featured-project").forEach(project => {

    const isReversed = project.classList.contains("reverse");
    const image = project.querySelector(".project-image");
    const content = project.querySelector(".project-content");

    gsap.from(image, {
        x: isReversed ? 120 : -120,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: project,
            start: "top 70%",
            end: "bottom 28%",
            toggleActions: "play reverse play reverse"
    }
    });

    gsap.from(content, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: project,
            start: "top 70%",
            end: "bottom 28%",
            toggleActions: "play reverse play reverse"
        }
    })
});

// Additional projects pop in
gsap.utils.toArray(".project-grid").forEach((grid) => {
    
    const cards = grid.querySelectorAll(".project-image-card");

    gsap.to(cards, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        scrollTrigger: {
            trigger: grid,
            start: "top 70%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// Skills Float Up
gsap.utils.toArray(".skills-row").forEach((row) => {
    gsap.from(row, {
        scrollTrigger: {
            trigger: row,
            start: "top 95%",
            toggleActions: "play reverse play reverse"
    },
    y: 120,
    opacity: 0,
    duration: 0.9,
    ease: "back.out(1.8)", // bounce effect
    stagger: 0.2
    });
});

// CONTACT FORM
const contactForm = document.getElementById("contact-form");

const validateField = (input, condition, message) => {
  const errorElement = input.parentElement.querySelector(".error-message");

  if (!condition) {
    input.classList.add("input-error");
    input.classList.remove("input-success");
    errorElement.textContent = message;
    return false;
  } else {
    input.classList.remove("input-error");
    input.classList.add("input-success");
    errorElement.textContent = "";
    return true;
  }
};

// Real-time validation
["input", "change", "keyup"].forEach(evt => {
  contactForm.addEventListener(evt, (e) => {
    if (e.target.id === "name") {
      validateField(
        e.target,
        e.target.value.trim() !== "",
        "Name is required"
      );
    }

    if (e.target.id === "email") {
      validateField(
        e.target,
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value.trim()),
        "Invalid email address"
      );
    }

    if (e.target.id === "message") {
      validateField(
        e.target,
        e.target.value.trim().length > 0,
        "Message is required"
      );
    }
  });
});

// Submit validation + storage
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValid = validateField(
    contactForm.name,
    contactForm.name.value.trim() !== "",
    "Name is required"
  );

  const emailValid = validateField(
    contactForm.email,
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.email.value.trim()),
    "Invalid email address"
  );

  const messageValid = validateField(
    contactForm.message,
    contactForm.message.value.trim().length > 0,
    "Message is required"
  );

  if (!(nameValid && emailValid && messageValid)) return;

  // Store in localStorage
  const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

  messages.push({
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
    date: new Date().toLocaleString()
  });

  localStorage.setItem("contactMessages", JSON.stringify(messages));

  // Reset form
  contactForm.reset();

  // Remove success borders after reset
  contactForm.querySelectorAll("input, textarea").forEach(el =>
    el.classList.remove("input-success")
  );

  alert("Message sent successfully!");
});
