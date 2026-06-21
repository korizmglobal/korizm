/* ===========================================================
   Korizm Global Education — interactions
   =========================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = $("#header");
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    const toTop = $("#toTop");
    if (window.scrollY > 500) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const closeBtn = $("#navClose");

  // backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  const openNav = () => {
    nav.classList.add("open");
    backdrop.classList.add("show");
    document.body.classList.add("nav-open");
  };
  const closeNav = () => {
    nav.classList.remove("open");
    backdrop.classList.remove("show");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", openNav);
  closeBtn.addEventListener("click", closeNav);
  backdrop.addEventListener("click", closeNav);
  $$(".nav__link, .nav__cta", nav).forEach((a) => a.addEventListener("click", closeNav));

  /* ---------- Active link on scroll ---------- */
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");
  const setActive = () => {
    const pos = window.scrollY + 120;
    let current = "";
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$(".stat__num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count + (c.dataset.suffix || "")));
  }

  /* ---------- Contact form (demo handling) ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      note.hidden = false;
      form.reset();
      setTimeout(() => (note.hidden = true), 6000);
    });
  }

  /* ---------- Newsletter (demo handling) ---------- */
  const newsletter = $("#newsletter");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", newsletter);
      if (input.value.trim()) {
        input.value = "";
        input.placeholder = "Subscribed ✓";
        setTimeout(() => (input.placeholder = "Your email"), 4000);
      }
    });
  }
})();
