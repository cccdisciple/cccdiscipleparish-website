/* =========================================================
   Disciple Parish — Celestial Church of Christ
   Script: mobile navigation, scroll reveal, footer year
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- Mobile navigation toggle ---- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("primaryMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    /* Close menu after selecting a link (mobile) */
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---- Lightweight fade-in on scroll ---- */
  var revealTargets = document.querySelectorAll(".card, .service-card, .connect-list, .welcome-lead, .welcome-body");

  revealTargets.forEach(function (el) {
    el.classList.add("fade-in");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: no IntersectionObserver support */
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---- Footer copyright year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});