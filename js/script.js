/* ============================================================
   ELITE FADE BARBER STUDIO — script.js
   ============================================================ */

/* ─── THEME (runs immediately, before DOM ready, to prevent flash) ─ */
(function () {
  var stored = localStorage.getItem("ef-theme") || "light";
  document.documentElement.setAttribute("data-theme", stored);
})();

/* ─── THEME TOGGLE ────────────────────────────────────────────────── */
function initTheme() {
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  function updateIcon() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    toggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    toggle.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
  }

  updateIcon();

  toggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ef-theme", next);
    updateIcon();
  });
}

/* ─── NAVBAR ──────────────────────────────────────────────────────── */
function initNavbar() {
  var navbar = document.getElementById("navbar");
  if (!navbar) return;

  /* Scroll shadow */
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* Hamburger */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      hamburger.classList.toggle("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        hamburger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Active nav link — detect current page by pathname */
  // var path = window.location.pathname;
  // var file = path.split("/").pop() || "index.html";
  // if (file === "") file = "index.html";

  // document.querySelectorAll(".nav-link").forEach(function (link) {
  //   var href = (link.getAttribute("href") || "").split("/").pop();
  //   if (href === "" || href === null) href = "index.html";
  //   if (href === file) link.classList.add("active");
  // });
}

/* ─── SCROLL ANIMATIONS ───────────────────────────────────────────── */
function initScrollAnimations() {
  var els = document.querySelectorAll(".fade-up");
  if (!els.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
}

/* ─── TESTIMONIALS CAROUSEL ───────────────────────────────────────── */
function initTestimonials() {
  var slides = document.querySelectorAll(".testimonial-slide");
  var dots   = document.querySelectorAll(".t-dot");
  var prev   = document.getElementById("t-prev");
  var next   = document.getElementById("t-next");
  if (!slides.length) return;

  var current = 0;
  var timer;

  function goTo(idx) {
    slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  }

  function startAuto() {
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (prev) prev.addEventListener("click", function () { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener("click", function () { goTo(current + 1); resetAuto(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { goTo(i); resetAuto(); });
  });

  startAuto();
}

/* ─── GALLERY LIGHTBOX ────────────────────────────────────────────── */
function initLightbox() {
  var items    = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  if (!lightbox || !items.length) return;

  var lbImg     = lightbox.querySelector(".lb-img");
  var lbCounter = lightbox.querySelector(".lightbox-counter");
  var lbClose   = lightbox.querySelector(".lightbox-close");
  var lbPrev    = lightbox.querySelector(".lightbox-prev");
  var lbNext    = lightbox.querySelector(".lightbox-next");

  var images = [];
  items.forEach(function (item) {
    var img = item.querySelector("img");
    if (img) images.push(img.src);
  });

  var current = 0;

  function show(idx) {
    current = (idx + images.length) % images.length;
    lbImg.src = images[current];
    if (lbCounter) lbCounter.textContent = (current + 1) + " / " + images.length;
  }

  function open(idx) {
    show(idx);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i); });
  });

  if (lbClose) lbClose.addEventListener("click", close);
  if (lbPrev)  lbPrev.addEventListener("click",  function () { show(current - 1); });
  if (lbNext)  lbNext.addEventListener("click",  function () { show(current + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowLeft")   show(current - 1);
    if (e.key === "ArrowRight")  show(current + 1);
  });
}

/* ─── INIT ────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initNavbar();
  initScrollAnimations();
  initTestimonials();
  initLightbox();
});

// --- AUTO-UPDATE FOOTER YEAR ---
const updateYear = () => {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateYear);


const modal = document.getElementById('qr-modal');
  const openBtn = document.getElementById('open-qr');
  const closeBtn = document.getElementById('close-qr');

  openBtn.onclick = () => modal.classList.add('active');
  closeBtn.onclick = () => modal.classList.remove('active');
  
  // Close if user clicks outside the white box
  window.onclick = (event) => {
    if (event.target == modal) modal.classList.remove('active');
  }
