/* =========================================================
   Wednesday & Friday Order of Service — movement rail
   Used only by /worship/order-of-service/weekday/.

   Progressive enhancement:
   - No JS: the movement list is a native <details>/<summary>
     "Jump to Section" disclosure at every width (closed by
     default, exactly like anywhere else on the site).
   - With JS, at desktop widths (matching the CSS sticky-rail
     breakpoint): the same element is kept genuinely open via
     the real `open` property, and its toggle is hidden by CSS,
     so it reads as a permanent rail rather than a control.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var rail = document.querySelector(".weekday-rail");
  if (!rail) return;

  var desktopQuery = window.matchMedia("(min-width: 1024px)");

  function sync() {
    if (desktopQuery.matches) {
      rail.open = true;
    }
  }

  sync();

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", sync);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(sync);
  }

  // Active-movement tracking: a movement is "active" once the reader
  // has scrolled to it, not merely because it is partially visible.
  // Matches each movement's own scroll-margin-top (110px) so the
  // state a rail link lands on is the same state reading down to it
  // produces. Deliberately not a visibility-ratio/IntersectionObserver
  // heuristic, which activates a short movement (e.g. Offerings &
  // Closing Worship, 2 steps) the instant it enters the viewport,
  // ahead of the step actually being read.
  var movements = Array.prototype.slice.call(document.querySelectorAll(".step-movement"));
  var railItems = Array.prototype.slice.call(document.querySelectorAll(".weekday-rail-item"));
  var READING_LINE = 110;
  var ticking = false;

  function updateActiveMovement() {
    ticking = false;
    var activeIndex = 0;
    for (var i = 0; i < movements.length; i++) {
      if (movements[i].getBoundingClientRect().top <= READING_LINE) {
        activeIndex = i;
      }
    }
    railItems.forEach(function (item, i) {
      item.classList.toggle("is-active", i === activeIndex);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateActiveMovement);
    }
  }

  if (movements.length && movements.length === railItems.length) {
    updateActiveMovement();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
});
