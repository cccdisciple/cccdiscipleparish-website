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

  /* ---------------------------------------------------------------
     Branch split (General vs. Prophetic/Prophetess line).

     No JS: each pair of .rank-branch-panel elements shares a native
     `name` attribute, so browsers already give a free exclusive
     accordion (opening one closes the other) at any screen width.

     With JS, at desktop widths both branches should be visible at
     once, side-by-side. Native <details> enforces same-name
     exclusivity even for scripted `.open` changes, so the `name`
     attribute is temporarily removed while in desktop mode (lifting
     the constraint so both can be open simultaneously) and restored
     when returning to mobile widths (so the free exclusive-accordion
     behavior comes back).
     --------------------------------------------------------------- */
  var branchGroups = {};
  Array.prototype.slice.call(document.querySelectorAll(".rank-branch-panel")).forEach(function (panel) {
    var group = panel.getAttribute("data-branch-group");
    if (!group) return;
    if (!branchGroups[group]) branchGroups[group] = [];
    branchGroups[group].push({
      el: panel,
      name: panel.getAttribute("name"),
      defaultOpen: panel.hasAttribute("open")
    });
  });

  function applyBranchLayout() {
    var desktop = isDesktop();
    Object.keys(branchGroups).forEach(function (group) {
      branchGroups[group].forEach(function (entry) {
        if (desktop) {
          entry.el.removeAttribute("name");
          entry.el.open = true;
        } else {
          if (entry.name) entry.el.setAttribute("name", entry.name);
          entry.el.open = entry.defaultOpen;
        }
      });
    });
  }

  if (Object.keys(branchGroups).length) {
    applyBranchLayout();
  }

  function applyResponsiveModes() {
    applyModeReset();
    applyBranchLayout();
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", applyResponsiveModes);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(applyResponsiveModes);
  }
});
