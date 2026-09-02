/* =========================================================
   Life as a Celestian — Unified Practice Explorer
   Used only by /about/life-as-a-celestian.html.

   Replaces the earlier per-category "tile grid + side panel"
   pattern (five independent shells) with ONE persistent topic
   navigator (grouped by category) and ONE dynamic reading panel
   spanning all topics, so a reader who has scrolled deep into a
   long teaching never has to scroll back up to change topics.

   Data source: this script does not hold any teaching content of
   its own. It reads the five existing ".practice-group" sections
   (already in the HTML, already the approved copy) and builds the
   new navigator/panel from that DOM — the content still lives in
   exactly one place.

   Progressive enhancement:
   - No JS: the five ".practice-group" sections render exactly as
     they always have — each topic is a native <details>/<summary>
     the visitor can open inline. Nothing about that markup was
     removed.
   - With JS: the new navigator + reading panel are built and
     inserted before the first ".practice-group". Each original
     section's now-redundant intro line and tile grid are hidden
     (its heading and any supplementary "practice-supporting" notes
     stay visible in place); a section with no supplementary notes
     is hidden entirely, since the new navigator already covers it.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var groups = Array.prototype.slice.call(document.querySelectorAll(".practice-group"));
  if (!groups.length) return; // not the life-as-a-celestian page

  var firstGroup = groups[0];

  // ---- 1. Read the existing DOM into a plain data model ----
  var categories = [];
  groups.forEach(function (group) {
    var headingEl = group.querySelector(".section-heading");
    var topicEls = Array.prototype.slice.call(group.querySelectorAll(".practice-node-details"));
    var topics = [];

    topicEls.forEach(function (details) {
      var id = details.getAttribute("data-topic-id");
      var nameEl = details.querySelector(".practice-node-name");
      var bodyEl = details.querySelector(".practice-detail-body");
      if (!id || !nameEl || !bodyEl) return;
      topics.push({
        id: id,
        name: nameEl.textContent,
        bodyHTML: bodyEl.innerHTML,
        categoryName: headingEl ? headingEl.textContent : ""
      });
    });

    if (!topics.length) return;

    categories.push({
      id: group.id,
      name: headingEl ? headingEl.textContent : "",
      topics: topics
    });

    // Hide whatever the new navigator makes redundant, but keep any
    // supplementary "practice-supporting" notes exactly where they
    // are — they are not part of the topic-select system and were
    // never duplicated into the new panel.
    if (group.querySelector(".practice-supporting")) {
      group.classList.add("explorer-legacy-hide-shell");
    } else {
      group.classList.add("explorer-legacy-hide-all");
    }
  });

  if (!categories.length) return;

  var allTopics = [];
  categories.forEach(function (category) {
    category.topics.forEach(function (topic) {
      allTopics.push(topic);
    });
  });

  var topicsById = {};
  allTopics.forEach(function (topic, index) {
    topic.index = index;
    topicsById[topic.id] = topic;
  });

  // ---- 2. Build the new explorer DOM ----
  var section = document.createElement("section");
  section.className = "content-section content-section--alt explorer-section";
  section.id = "practice-explorer";

  var container = document.createElement("div");
  container.className = "container";
  section.appendChild(container);

  var heading = document.createElement("h2");
  heading.className = "section-heading";
  heading.textContent = "Explore the Teachings";
  container.appendChild(heading);

  var lead = document.createElement("p");
  lead.className = "section-lead";
  lead.textContent = "Select a practice to learn what we do, why, its biblical foundation, and what it means for me.";
  container.appendChild(lead);

  // Mobile/tablet sticky selector bar (hidden on desktop via CSS)
  var mobileBar = document.createElement("div");
  mobileBar.className = "explorer-mobile-bar";

  var mobileToggle = document.createElement("button");
  mobileToggle.type = "button";
  mobileToggle.className = "explorer-mobile-toggle";
  mobileToggle.setAttribute("aria-expanded", "false");
  mobileToggle.setAttribute("aria-controls", "explorerNav");
  mobileToggle.innerHTML =
    '<span class="explorer-mobile-labels">' +
    '<span class="explorer-mobile-category"></span>' +
    '<span class="explorer-mobile-topic"></span>' +
    "</span>" +
    '<span class="explorer-mobile-chevron" aria-hidden="true">&#9662;</span>';
  mobileBar.appendChild(mobileToggle);
  container.appendChild(mobileBar);

  var shell = document.createElement("div");
  shell.className = "explorer-shell";
  container.appendChild(shell);

  // Navigator
  var nav = document.createElement("nav");
  nav.className = "explorer-nav";
  nav.id = "explorerNav";
  nav.setAttribute("aria-label", "Life as a Celestian topics");
  shell.appendChild(nav);

  categories.forEach(function (category, catIndex) {
    var catBlock = document.createElement("div");
    catBlock.className = "explorer-category";

    var catLabelId = "explorer-cat-" + catIndex;
    var catName = document.createElement("p");
    catName.className = "explorer-category-name";
    catName.id = catLabelId;
    catName.textContent = category.name;
    catBlock.appendChild(catName);

    var list = document.createElement("ul");
    list.className = "explorer-topic-list";
    list.setAttribute("aria-labelledby", catLabelId);

    category.topics.forEach(function (topic) {
      var item = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "explorer-topic-link";
      btn.setAttribute("data-topic-id", topic.id);
      btn.setAttribute("aria-current", "false");
      btn.textContent = topic.name;
      btn.addEventListener("click", function () {
        selectTopic(topic.id, { userInitiated: true });
      });
      item.appendChild(btn);
      list.appendChild(item);
    });

    catBlock.appendChild(list);
    nav.appendChild(catBlock);
  });

  // Reading panel
  var panel = document.createElement("div");
  panel.className = "explorer-panel";
  shell.appendChild(panel);

  var panelCategory = document.createElement("p");
  panelCategory.className = "explorer-panel-category";
  panel.appendChild(panelCategory);

  var panelTitle = document.createElement("h3");
  panelTitle.className = "explorer-panel-title";
  panelTitle.setAttribute("tabindex", "-1");
  panel.appendChild(panelTitle);

  var panelBody = document.createElement("div");
  panelBody.className = "explorer-panel-body";
  panel.appendChild(panelBody);

  var panelFooter = document.createElement("div");
  panelFooter.className = "explorer-panel-footer";

  var prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "explorer-panel-prev";

  var nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "explorer-panel-next";

  panelFooter.appendChild(prevBtn);
  panelFooter.appendChild(nextBtn);
  panel.appendChild(panelFooter);

  firstGroup.parentNode.insertBefore(section, firstGroup);

  // ---- 3. Sticky offset: account for the real header height ----
  function updateStickyOffset() {
    var header = document.querySelector(".site-header");
    var offset = (header ? header.offsetHeight : 80) + 20;
    document.documentElement.style.setProperty("--explorer-sticky-offset", offset + "px");
  }
  updateStickyOffset();
  window.addEventListener("resize", updateStickyOffset);

  // ---- 4. Mobile navigator open/close ----
  var desktopQuery = window.matchMedia("(min-width: 1024px)");

  function isDesktop() {
    return desktopQuery.matches;
  }

  function closeMobileNav() {
    mobileToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  function openMobileNav() {
    mobileToggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
  }

  mobileToggle.addEventListener("click", function () {
    if (mobileToggle.getAttribute("aria-expanded") === "true") {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  document.addEventListener("click", function (event) {
    if (isDesktop()) return;
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && event.target !== mobileToggle && !mobileToggle.contains(event.target)) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMobileNav();
      mobileToggle.focus();
    }
  });

  desktopQuery.addEventListener ? desktopQuery.addEventListener("change", closeMobileNav) : desktopQuery.addListener(closeMobileNav);

  // ---- 5. Selecting a topic ----
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hasSelectedOnce = false;

  function scrollPanelIntoViewIfNeeded() {
    var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--explorer-sticky-offset"), 10) || 100;
    var rect = shell.getBoundingClientRect();
    if (rect.top < offset) {
      var targetY = window.pageYOffset + rect.top - offset;
      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    }
  }

  function selectTopic(id, options) {
    var topic = topicsById[id];
    if (!topic) return;
    options = options || {};

    // Navigator state
    Array.prototype.forEach.call(nav.querySelectorAll(".explorer-topic-link"), function (btn) {
      var isActive = btn.getAttribute("data-topic-id") === id;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });

    // Panel content
    panelCategory.textContent = topic.categoryName;
    panelTitle.textContent = topic.name;
    panelBody.innerHTML = topic.bodyHTML;

    // Previous / Next
    var prevTopic = topic.index > 0 ? allTopics[topic.index - 1] : null;
    var nextTopic = topic.index < allTopics.length - 1 ? allTopics[topic.index + 1] : null;

    if (prevTopic) {
      prevBtn.hidden = false;
      prevBtn.innerHTML = '<span aria-hidden="true">&larr; </span>Previous: ' + prevTopic.name;
      prevBtn.onclick = function () {
        selectTopic(prevTopic.id, { userInitiated: true });
      };
    } else {
      prevBtn.hidden = true;
      prevBtn.onclick = null;
    }

    if (nextTopic) {
      nextBtn.hidden = false;
      nextBtn.innerHTML = "Next: " + nextTopic.name + '<span aria-hidden="true"> &rarr;</span>';
      nextBtn.onclick = function () {
        selectTopic(nextTopic.id, { userInitiated: true });
      };
    } else {
      nextBtn.hidden = true;
      nextBtn.onclick = null;
    }

    // Mobile sticky bar label
    mobileBar.querySelector(".explorer-mobile-category").textContent = topic.categoryName;
    mobileBar.querySelector(".explorer-mobile-topic").textContent = topic.name;

    // URL fragment: reflect the current topic (for direct linking and
    // reload-persistence) without adding a history entry per topic —
    // pushState here would flood Back/Forward with every topic a
    // visitor opens, which is its own confusing behavior.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + id);
    }

    if (!isDesktop()) closeMobileNav();

    if (options.userInitiated) {
      if (hasSelectedOnce) {
        panelTitle.focus();
      }
      scrollPanelIntoViewIfNeeded();
    }
    hasSelectedOnce = true;
  }

  // ---- 6. Initial topic: valid URL fragment, else the first topic.
  // A handful of topic ids were retired when their content was folded
  // into a broader combined topic (Menstrual Purification and
  // Purification After Childbirth into Sanctification & Purification;
  // Food Offered to Idols into Foods We Refrain From). Anyone arriving
  // with one of those old hashes lands on the combined topic that now
  // holds that teaching, rather than silently falling back to topic 1. ----
  var retiredHashAliases = {
    "menstrual-purification": "sanctification",
    "purification-after-childbirth": "sanctification",
    "food-offered-to-idols": "foods-we-refrain-from"
  };

  function resolveTopicId(rawId) {
    if (topicsById[rawId]) return rawId;
    if (retiredHashAliases[rawId] && topicsById[retiredHashAliases[rawId]]) {
      return retiredHashAliases[rawId];
    }
    return null;
  }

  var initialId = resolveTopicId((location.hash || "").replace("#", "")) || allTopics[0].id;
  selectTopic(initialId, { userInitiated: false });

  window.addEventListener("hashchange", function () {
    var id = resolveTopicId((location.hash || "").replace("#", ""));
    if (id) {
      selectTopic(id, { userInitiated: true });
    }
  });

  // Only now hide the legacy per-category shells — if anything above
  // throws, the original always-visible markup is left untouched.
  document.body.classList.add("js-explorer-ready");
});
