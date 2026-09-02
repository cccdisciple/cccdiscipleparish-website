/* =========================================================
   Offerings & Giving — Interactive Giving Guide
   Used only by /about/offerings.html. Mirrors the progressive-
   enhancement pattern used by rank-flow.js / practice-explorer.js
   but is a standalone module — it does not share state or
   markup hooks with those pages, so this file can change freely
   without any risk to the Rank Explorer or Practice Explorer.

   Progressive enhancement:
   - No JS: every tile is a native <details>/<summary>. Tapping
     a tile expands its content directly beneath it (mobile
     behavior), and every giving concept is fully readable
     without any script.
   - With JS, at desktop widths (matching the CSS panel
     breakpoint): clicking a tile's summary is intercepted so it
     does not expand inline; instead its detail content is
     mirrored into the shared panel BENEATH the grid, and the
     tile is marked as the selected one.
   - Also at desktop widths, the first tile (Collection) is
     selected automatically as soon as the panel exists, so the
     panel never sits on its empty placeholder before a visitor
     has clicked anything — both on initial load and whenever a
     resize crosses back into desktop width. Mobile/tablet never
     auto-expands anything; every tile stays collapsed until the
     visitor opens it.

   Accessibility: every <details> also gets a native "toggle"
   listener that keeps its summary's aria-expanded in sync with
   the real open state. That covers native mobile disclosure,
   which the desktop click-intercept path deliberately bypasses
   (on desktop the tile's own <details> never actually opens —
   aria-expanded there is driven by selectTile() instead, based
   on which tile is mirrored into the panel).
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

    details.addEventListener("toggle", function () {
      if (isDesktop()) return; // desktop selection state is tracked via selectTile() instead
      summary.setAttribute("aria-expanded", details.open ? "true" : "false");
    });
  });

  function selectDefaultDesktopTile() {
    if (!isDesktop()) return; // mobile/tablet must stay fully collapsed
    var collection = allDetails[0];
    if (!collection) return;
    var summary = collection.querySelector(".giving-node-summary");
    if (summary) selectTile(collection, summary);
  }

  function applyModeReset() {
    closeAllNative();
    clearSelection();
    resetPanel();
    allDetails.forEach(function (details) {
      var summary = details.querySelector(".giving-node-summary");
      if (summary) summary.setAttribute("aria-expanded", "false");
    });
    selectDefaultDesktopTile();
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", applyModeReset);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(applyModeReset);
  }

  selectDefaultDesktopTile();
});
