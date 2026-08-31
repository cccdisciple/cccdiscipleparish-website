/* =========================================================
   Disciple Parish — Celestial Church of Christ
   Script: mobile navigation, nav dropdowns, scroll reveal,
   footer year, prayer request form
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- Mobile navigation toggle ---- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("primaryMenu");

  function closeAllDropdowns() {
    document.querySelectorAll('.nav-item--dropdown[data-open="true"]').forEach(function (item) {
      item.removeAttribute("data-open");
      var trigger = item.querySelector(".nav-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      if (!isOpen) closeAllDropdowns();
    });

    /* Close menu after selecting a link (mobile). Dropdown triggers (e.g.
       "Celestial Worship", which is a real link as well as a toggle) are
       excluded here so a first tap can open the submenu instead of
       immediately closing the whole mobile menu. */
    navMenu.querySelectorAll("a:not(.nav-trigger)").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        closeAllDropdowns();
      });
    });
  }

  /* ---- Nav dropdowns (About / Celestial Worship / Services & Events / Connect) ---- */
  var dropdownItems = document.querySelectorAll(".nav-item--dropdown");

  dropdownItems.forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function (event) {
      /* Some triggers (e.g. "Celestial Worship") are real links to their
         section's hub page rather than plain toggle buttons. On desktop,
         hover already reveals the submenu, so a click should simply follow
         the link. On mobile there is no hover, so the first tap must open
         the submenu instead of navigating away immediately; the "Overview"
         item inside the submenu then reaches the same hub page. */
      var isMobileNav = navToggle && window.getComputedStyle(navToggle).display !== "none";
      if (trigger.tagName === "A" && isMobileNav) {
        event.preventDefault();
      } else if (trigger.tagName === "A") {
        return; /* desktop: let the link navigate normally */
      }

      var isOpen = item.getAttribute("data-open") === "true";

      /* Close any other open dropdown before opening this one */
      dropdownItems.forEach(function (other) {
        if (other !== item) {
          other.removeAttribute("data-open");
          var otherTrigger = other.querySelector(".nav-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.removeAttribute("data-open");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.setAttribute("data-open", "true");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Close open dropdowns on outside click or Escape */
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-item--dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  /* ---- Lightweight fade-in on scroll ---- */
  var revealTargets = document.querySelectorAll(".card, .service-card, .connect-list, .welcome-lead, .welcome-body, .faith-item, .form-card, .gallery-category, .content-list-item, .events-panel");

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

  /* ---- Prayer request form ----
     NOTE: The church does not yet have a secure form-submission
     destination (no church email account has been created yet).
     This handles validation and gives the visitor clear feedback,
     but does not transmit the request anywhere. Once a submission
     destination exists (e.g. a form service or church email), wire
     it up here instead of showing the local confirmation message. */
  var prayerForm = document.getElementById("prayerForm");

  if (prayerForm) {
    var prayerStatus = document.getElementById("prayerFormStatus");

    prayerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!prayerForm.checkValidity()) {
        prayerForm.reportValidity();
        return;
      }

      prayerStatus.textContent = "Thank you. Prayer request submission is not yet fully connected on this website — please call or email the church directly so your request reaches us right away.";
      prayerStatus.classList.remove("is-error");
      prayerStatus.classList.add("is-visible");
      prayerForm.reset();
    });
  }

});