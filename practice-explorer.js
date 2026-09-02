/* =========================================================
   Life as a Celestian — Practice Explorer
   Used only by /about/life-as-a-celestian.html. Same progressive-
   enhancement pattern as giving-guide.js and rank-flow.js, but
   generalized to handle several independent shells on one page
   (one per practice group) instead of a single global panel.

   Progressive enhancement:
   - No JS: every tile is a native <details>/<summary>. Tapping a
     tile expands its content directly beneath it (mobile
     behavior), and every practice is fully readable without any
     script.
   - With JS, at desktop widths (matching the CSS panel
     breakpoint): clicking a tile's summary within a shell is
     intercepted so it does not expand inline; instead its detail
     content is mirrored into that shell's own sticky panel and
     the tile is marked selected. Each shell tracks its own
     selection independently of the others.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll(".practice-shell"));
  if (!shells.length) return; // not the life-as-a-celestian page

  var desktopQuery = window.matchMedia("(min-width: 1024px)");

  function isDesktop() {
    return desktopQuery.matches;
  }

  shells.forEach(function (shell) {
    var panel = shell.querySelector(".practice-detail-panel");
    var panelTitle = panel ? panel.querySelector(".practice-detail-panel-title") : null;
    var panelBody = panel ? panel.querySelector(".practice-detail-panel-body") : null;
    var panelPlaceholder = panel ? panel.querySelector(".practice-detail-panel-placeholder") : null;
    var allDetails = Array.prototype.slice.call(shell.querySelectorAll(".practice-node-details"));
    var selectedSummary = null;

    function resetPanel() {
      if (panelTitle) panelTitle.textContent = "";
      if (panelBody) {
        panelBody.innerHTML = "";
        panelBody.hidden = true;
      }
      if (panelPlaceholder) panelPlaceholder.hidden = false;
    }

    function clearSelection() {
      if (selectedSummary) {
        selectedSummary.classList.remove("is-selected");
        selectedSummary.setAttribute("aria-expanded", "false");
        selectedSummary = null;
      }
    }

    function selectTile(details, summary) {
      clearSelection();
      summary.classList.add("is-selected");
      summary.setAttribute("aria-expanded", "true");
      selectedSummary = summary;

      var nameEl = summary.querySelector(".practice-node-name");
      var bodySource = details.querySelector(".practice-detail-body");

      if (panelTitle) panelTitle.textContent = nameEl ? nameEl.textContent : summary.textContent.trim();
      if (panelBody && bodySource) {
        panelBody.innerHTML = bodySource.innerHTML;
        panelBody.hidden = false;
      }
      if (panelPlaceholder) panelPlaceholder.hidden = true;
    }

    function closeAllNative() {
      allDetails.forEach(function (details) {
        details.open = false;
      });
    }

    allDetails.forEach(function (details) {
      var summary = details.querySelector(".practice-node-summary");
      if (!summary) return;

      summary.setAttribute("aria-expanded", "false");

      summary.addEventListener("click", function (event) {
        if (isDesktop()) {
          event.preventDefault();
          selectTile(details, summary);
        }
      });
    });

    function applyModeReset() {
      closeAllNative();
      clearSelection();
      resetPanel();
    }

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", applyModeReset);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(applyModeReset);
    }
  });
});
