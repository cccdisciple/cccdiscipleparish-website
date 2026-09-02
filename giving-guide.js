/* =========================================================
   Offerings & Giving — Interactive Giving Guide
   Used only by /about/offerings.html. Mirrors the progressive-
   enhancement pattern used by rank-flow.js (Leadership & Ranks)
   but is a standalone module — it does not share state or
   markup hooks with that page, so this file can change freely
   without any risk to the Rank Explorer.

   Progressive enhancement:
   - No JS: every tile is a native <details>/<summary>. Tapping
     a tile expands its content directly beneath it (mobile
     behavior), and every giving concept is fully readable
     without any script.
   - With JS, at desktop widths (matching the CSS panel
     breakpoint): clicking a tile's summary is intercepted so it
     does not expand inline; instead its detail content is
     mirrored into the sticky side panel and the tile is marked
     as the selected one.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var panel = document.getElementById("givingDetailPanel");
  if (!panel) return; // not the offerings page

  var panelTitle = panel.querySelector(".giving-detail-panel-title");
  var panelBody = panel.querySelector(".giving-detail-panel-body");
  var panelPlaceholder = panel.querySelector(".giving-detail-panel-placeholder");

  var allDetails = Array.prototype.slice.call(document.querySelectorAll(".giving-node-details"));
  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var selectedSummary = null;

  function isDesktop() {
    return desktopQuery.matches;
  }

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

    var nameEl = summary.querySelector(".giving-node-name");
    var bodySource = details.querySelector(".giving-detail-body");

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
    var summary = details.querySelector(".giving-node-summary");
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
