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

  /* ---------- Hero carousel ---------- */
  const heroCarousel = $("[data-hero-carousel]");
  if (heroCarousel) {
    const slides = $$("[data-hero-slide]", heroCarousel);
    const dots = $$("[data-hero-dot]", heroCarousel);
    const prevBtn = $("[data-hero-prev]", heroCarousel);
    const nextBtn = $("[data-hero-next]", heroCarousel);
    const previewImage = $("[data-hero-preview]", heroCarousel);
    let currentSlide = 0;
    let carouselTimer = null;

    $$(".hero__slide-image", heroCarousel).forEach((image) => {
      image.addEventListener("error", () => {
        image.hidden = true;
      });
    });

    if (previewImage) {
      previewImage.addEventListener("error", () => {
        const fallback = previewImage.dataset.fallbackSrc;
        if (fallback && previewImage.getAttribute("src") !== fallback) {
          previewImage.src = fallback;
        } else {
          previewImage.hidden = true;
        }
      });
    }

    const getSlideImageSrc = (index) => {
      const slide = slides[(index + slides.length) % slides.length];
      const image = slide ? $(".hero__slide-image", slide) : null;
      return image ? image.getAttribute("src") : "";
    };

    const updatePreviewImage = () => {
      if (!previewImage || !slides.length) return;
      const activeSrc = getSlideImageSrc(currentSlide);
      const nextSrc = getSlideImageSrc(currentSlide + 1) || activeSrc;

      previewImage.hidden = false;
      previewImage.dataset.fallbackSrc = activeSrc;
      if (nextSrc && previewImage.getAttribute("src") !== nextSrc) {
        previewImage.src = nextSrc;
      }
    };

    const showSlide = (index) => {
      if (!slides.length) return;
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.classList.toggle("active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      updatePreviewImage();
    };

    const stopCarousel = () => {
      if (carouselTimer) window.clearInterval(carouselTimer);
      carouselTimer = null;
    };

    const startCarousel = () => {
      stopCarousel();
      carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 5600);
    };

    if (prevBtn) prevBtn.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startCarousel();
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startCarousel();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startCarousel();
      });
    });

    heroCarousel.addEventListener("mouseenter", stopCarousel);
    heroCarousel.addEventListener("mouseleave", startCarousel);
    heroCarousel.addEventListener("focusin", stopCarousel);
    heroCarousel.addEventListener("focusout", startCarousel);

    showSlide(0);
    startCarousel();
  }

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

  /* ---------- Contact form with EmailJS ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  const formError = $("#formError");
  const submitBtn = $("#submitBtn");
  
  if (form) {
    // Initialize EmailJS
    emailjs.init({
      publicKey: "D8QAc9PzthAb9fmsX", // EmailJS public key
      limitRate: {
        id: "korizm_contact_form",
        throttle: 60000, // Limit to 1 email per minute per user
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Disable submit button and show loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";

      try {
        // Send email using EmailJS
        await emailjs.send(
          "korizm_contact_form", // Service ID
          "template_korizm", // Template ID
          {
            to_email: "korizmglobal@gmail.com", // Your email
            from_name: form.name.value,
            from_email: form.email.value,
            phone: form.phone.value || "Not provided",
            program: form.program.value,
            message: form.message.value,
          }
        );

        // Show success message
        if (formError) formError.hidden = true;
        note.hidden = false;
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide success message after 6 seconds
        setTimeout(() => (note.hidden = true), 6000);
      } catch (error) {
        console.error("Error sending email:", error);
        if (formError) {
          formError.hidden = false;
          note.hidden = true;
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide error message after 6 seconds
        setTimeout(() => {
          if (formError) formError.hidden = true;
        }, 6000);
      }
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
