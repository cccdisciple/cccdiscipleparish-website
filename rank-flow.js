/* =========================================================
   Leadership & Ranks — interactive rank flow
   Used only by /about/leadership-ranks/men/ and /women/.

   Progressive enhancement:
   - No JS: every node is a native <details>/<summary>. Tapping a
     node expands its notes directly beneath it (mobile behavior),
     and the full rank order is always readable without any script.
   - With JS, at desktop widths (matching the CSS panel breakpoint):
     clicking a node's summary is intercepted so it does not expand
     inline; instead its detail content is mirrored into the sticky
     side panel and the node is marked as the selected one.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var panel = document.getElementById("rankDetailPanel");
  if (!panel) return; // not a rank-flow page

  var panelTitle = panel.querySelector(".rank-detail-panel-title");
  var panelBody = panel.querySelector(".rank-detail-panel-body");
  var panelPlaceholder = panel.querySelector(".rank-detail-panel-placeholder");

  var allDetails = Array.prototype.slice.call(document.querySelectorAll(".rank-node-details"));
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

  function selectNode(details, summary) {
    clearSelection();
    summary.classList.add("is-selected");
    summary.setAttribute("aria-expanded", "true");
    selectedSummary = summary;

    var nameEl = summary.querySelector(".rank-node-name");
    var bodySource = details.querySelector(".rank-detail-body");

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
    var summary = details.querySelector(".rank-node-summary");
    if (!summary) return;

    summary.setAttribute("aria-expanded", "false");

    summary.addEventListener("click", function (event) {
      if (isDesktop()) {
        event.preventDefault();
        selectNode(details, summary);
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
