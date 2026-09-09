/* =========================================================
   Leadership & Ranks — editorial hierarchy + detail plate
   Used only by /about/leadership-ranks/men/ and /women/.

   Progressive enhancement:
   - No JS: every rank is a native <details>/<summary>. Tapping one
     expands its notes directly beneath it in the hierarchy list,
     and the full rank order/content is always readable without
     any script.
   - With JS: activating a rank no longer expands it inline.
     Instead its content is mirrored into a single <dialog> ("the
     plate") shared by the whole page:
       - Desktop (matching --rank-editorial-breakpoint): the dialog
         is opened non-modally via .show() and stays sticky beside
         the hierarchy, updating in place as different ranks are
         selected.
       - Below that width: the dialog is opened modally via
         .showModal() as a near-fullscreen sheet, with native
         focus-trap, Esc-to-close, and an inert/dimmed hierarchy
         behind it. Closing returns focus to the rank that was
         selected and leaves the hierarchy's scroll position
         untouched.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var plate = document.getElementById("rankPlate");
  if (!plate) return; // not a rank-flow page

  var supportsDialog = typeof plate.showModal === "function";
  if (!supportsDialog) return; // no-JS-equivalent fallback already works inline

  var plateInner = plate.querySelector(".rank-plate-inner");
  var plateEyebrow = plate.querySelector(".rank-plate-eyebrow");
  var plateName = plate.querySelector(".rank-plate-name");
  var plateImage = plate.querySelector(".rank-plate-image");
  var plateBody = plate.querySelector(".rank-plate-body");
  var plateCounterpart = plate.querySelector(".rank-plate-counterpart");
  var plateCounterpartBtn = plate.querySelector(".rank-plate-counterpart-btn");
  var plateEmpty = plate.querySelector(".rank-plate-empty");
  var plateCloseBtn = plate.querySelector(".rank-plate-close");
  var platePrevBtn = plate.querySelector(".rank-plate-prev");
  var plateNextBtn = plate.querySelector(".rank-plate-next");

  var editorialQuery = window.matchMedia("(min-width: 1024px)");
  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isDesktop() {
    return editorialQuery.matches;
  }

  function prefersReducedMotion() {
    return reduceMotionQuery.matches;
  }

  var allDetails = Array.prototype.slice.call(document.querySelectorAll(".rank-node-details"));
  var selectedSummary = null;
  var selectedDetails = null;
  var lastTrigger = null;
  var isDialogModal = false;

  /* ---------------------------------------------------------------
     Placeholder image system.

     No rank currently has real photography. A <details> element
     may later carry data-image / data-image-alt attributes once a
     photograph is available; until then every rank shows the same
     restrained placeholder plate. Adding a real image later is a
     two-attribute change on that one rank — nothing here needs to
     change.
     --------------------------------------------------------------- */
  var PLACEHOLDER_MARKUP =
    '<span class="rank-plate-placeholder">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">' +
    '<path d="M12 2v20M4 8h16M7 8v-2a5 5 0 0 1 10 0v2" stroke-linecap="round"/>' +
    "</svg>" +
    '<span class="rank-plate-placeholder-text">Photograph forthcoming</span>' +
    "</span>";

  function renderImage(details) {
    var src = details.getAttribute("data-image");
    if (src) {
      var alt = details.getAttribute("data-image-alt") || "";
      plateImage.innerHTML = "";
      var img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      plateImage.appendChild(img);
    } else {
      plateImage.innerHTML = PLACEHOLDER_MARKUP;
    }
  }

  /* ---------------------------------------------------------------
     Sequence derivation for previous/next.

     Sequences are derived from existing structure, not from new
     data attributes: a rank's branch (General vs. Prophetic/
     Prophetess) comes from which .rank-branch-panel contains it,
     and Higher Evangelist Orders ranks are split into a Clergy
     path and a Non-Clergy path by their existing "Clergy" /
     "Non-Clergy" / "Senior Clergy" tier label. Previous/next never
     crosses from one of these sequences into another, so it can
     never imply a branch relationship that isn't doctrinally real.
     Shared start (Brother/Sister), the female convergence (Mother
     Celestial), and the historical/exceptional cards are not part
     of any sequence, so they never show previous/next controls.
     --------------------------------------------------------------- */
  function sequenceKeyFor(details) {
    var branchPanel = details.closest(".rank-branch-panel");
    if (branchPanel) {
      return branchPanel.classList.contains("rank-branch-panel--prophetic") ? "prophetic" : "general";
    }
    var label = details.querySelector(".rank-tier-col-label");
    var labelText = label ? label.textContent.trim() : "";
    if (labelText === "Non-Clergy") return "nonclergy";
    if (labelText === "Clergy" || labelText === "Senior Clergy") return "clergy";
    return null;
  }

  var sequences = {};
  allDetails.forEach(function (details) {
    var key = sequenceKeyFor(details);
    if (!key) return;
    (sequences[key] = sequences[key] || []).push(details);
  });

  function siblingInSequence(details, delta) {
    var key = sequenceKeyFor(details);
    if (!key) return null;
    var list = sequences[key];
    var index = list.indexOf(details);
    if (index === -1) return null;
    var target = list[index + delta];
    return target || null;
  }

  /* ---------------------------------------------------------------
     Counterpart lookup (Higher Evangelist Orders Non-Clergy/Clergy
     pairs). Derived from the existing .rank-tier-pair grouping —
     the other <details> inside the same pair, whichever order they
     appear in.
     --------------------------------------------------------------- */
  function counterpartFor(details) {
    var pair = details.closest(".rank-tier-pair");
    if (!pair) return null;
    var members = Array.prototype.slice.call(pair.querySelectorAll(".rank-node-details"));
    return members.filter(function (el) { return el !== details; })[0] || null;
  }

  /* ---------------------------------------------------------------
     Eyebrow (line/category) for the plate: the rank's own
     Non-Clergy/Clergy/Senior Clergy label when present, otherwise
     the branch it belongs to (General Line / Prophetic(-ess) Line),
     otherwise the nearest [data-branch-label] ancestor (used for
     the shared start rank and the female convergence rank, neither
     of which sit inside a branch panel or carry a tier label).
     --------------------------------------------------------------- */
  function eyebrowFor(details, summary) {
    var label = summary.querySelector(".rank-tier-col-label");
    if (label) return label.textContent.trim();
    var branchPanel = details.closest(".rank-branch-panel");
    if (branchPanel) {
      var tab = branchPanel.querySelector(":scope > summary.rank-branch-tab");
      if (tab) return tab.firstChild.textContent.trim();
    }
    var labelled = details.closest("[data-branch-label]");
    if (labelled) return labelled.getAttribute("data-branch-label");
    return "";
  }

  function resetPlateChrome() {
    if (plateEmpty) plateEmpty.hidden = true;
  }

  function updatePlateNow(details) {
    var summary = details.querySelector(".rank-node-summary");
    if (!summary) return;

    if (selectedSummary) {
      selectedSummary.classList.remove("is-selected");
      selectedSummary.setAttribute("aria-expanded", "false");
    }
    summary.classList.add("is-selected");
    summary.setAttribute("aria-expanded", "true");
    selectedSummary = summary;
    selectedDetails = details;

    resetPlateChrome();

    var nameEl = summary.querySelector(".rank-node-name");
    var bodySource = details.querySelector(".rank-detail-body");

    if (plateEyebrow) plateEyebrow.textContent = eyebrowFor(details, summary);
    if (plateName) plateName.textContent = nameEl ? nameEl.textContent : summary.textContent.trim();
    if (plateBody && bodySource) plateBody.innerHTML = bodySource.innerHTML;
    renderImage(details);

    var counterpart = counterpartFor(details);
    if (counterpart && plateCounterpart && plateCounterpartBtn) {
      var counterpartName = counterpart.querySelector(".rank-node-name");
      var counterpartLabel = counterpart.querySelector(".rank-tier-col-label");
      plateCounterpartBtn.innerHTML =
        (counterpartName ? counterpartName.textContent : "") +
        (counterpartLabel
          ? '<span class="rank-plate-counterpart-status">' + counterpartLabel.textContent + "</span>"
          : "");
      plateCounterpart.hidden = false;
    } else if (plateCounterpart) {
      plateCounterpart.hidden = true;
    }

    var prev = siblingInSequence(details, -1);
    var next = siblingInSequence(details, 1);
    if (platePrevBtn) platePrevBtn.disabled = !prev;
    if (plateNextBtn) plateNextBtn.disabled = !next;
  }

  function updatePlate(details) {
    if (prefersReducedMotion() || !plateInner) {
      updatePlateNow(details);
      return;
    }
    plateInner.classList.add("is-fading");
    window.setTimeout(function () {
      updatePlateNow(details);
      plateInner.classList.remove("is-fading");
    }, 120);
  }

  function openPlateForDesktop() {
    if (!plate.open) plate.show();
  }

  function selectNode(details, trigger) {
    lastTrigger = trigger || details.querySelector(".rank-node-summary");
    updatePlate(details);

    if (isDesktop()) {
      openPlateForDesktop();
      isDialogModal = false;
    } else {
      if (!plate.open) {
        plate.showModal();
        isDialogModal = true;
      }
    }
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
      event.preventDefault();
      selectNode(details, summary);
    });
  });

  if (plateCounterpartBtn) {
    plateCounterpartBtn.addEventListener("click", function () {
      var counterpart = selectedDetails && counterpartFor(selectedDetails);
      if (counterpart) selectNode(counterpart);
    });
  }

  if (platePrevBtn) {
    platePrevBtn.addEventListener("click", function () {
      var prev = selectedDetails && siblingInSequence(selectedDetails, -1);
      if (prev) selectNode(prev);
    });
  }

  if (plateNextBtn) {
    plateNextBtn.addEventListener("click", function () {
      var next = selectedDetails && siblingInSequence(selectedDetails, 1);
      if (next) selectNode(next);
    });
  }

  if (plateCloseBtn) {
    plateCloseBtn.addEventListener("click", function () {
      plate.close();
    });
  }

  plate.addEventListener("close", function () {
    isDialogModal = false;
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  });

  /* ---------------------------------------------------------------
     Branch split (General vs. Prophetic/Prophetess line).

     No JS: each pair of .rank-branch-panel elements shares a native
     `name` attribute, so browsers already give a free exclusive
     accordion (opening one closes the other) at any screen width.

     With JS, at desktop widths both branches should be visible at
     once. Native <details> enforces same-name exclusivity even for
     scripted `.open` changes, so the `name` attribute is temporarily
     removed while in desktop mode (lifting the constraint so both
     can be open simultaneously) and restored when returning to
     mobile widths (so the free exclusive-accordion behavior comes
     back).
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

  /* ---------------------------------------------------------------
     Responsive mode switch: moving the plate between its sticky
     in-flow (desktop) and modal-sheet (mobile) presentations.
     --------------------------------------------------------------- */
  function applyPlateLayout() {
    var desktop = isDesktop();
    if (desktop) {
      if (isDialogModal) {
        plate.close();
        isDialogModal = false;
      }
      if (selectedDetails) {
        openPlateForDesktop();
      }
    } else {
      if (plate.open && !isDialogModal) {
        plate.close();
      }
    }
  }

  function applyResponsiveModes() {
    closeAllNative();
    applyBranchLayout();
    applyPlateLayout();
  }

  if (typeof editorialQuery.addEventListener === "function") {
    editorialQuery.addEventListener("change", applyResponsiveModes);
  } else if (typeof editorialQuery.addListener === "function") {
    editorialQuery.addListener(applyResponsiveModes);
  }

  /* ---------------------------------------------------------------
     Default state: show the shared starting rank (Brother/Sister)
     in the plate on desktop so it never sits empty. Below desktop,
     leave the plate closed until a rank is actually tapped.
     --------------------------------------------------------------- */
  if (plateEmpty) plateEmpty.hidden = true;
  var firstDetails = allDetails[0];
  if (firstDetails) {
    updatePlateNow(firstDetails);
    lastTrigger = firstDetails.querySelector(".rank-node-summary");
    if (isDesktop()) openPlateForDesktop();
  }
});
