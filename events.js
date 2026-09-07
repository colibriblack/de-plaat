(function () {
  const BERLIN_TIME_ZONE = "Europe/Berlin";

  if (typeof document !== "undefined") {
    hydrateEvents();
    hydrateArchive();
    hydrateCurrentItems();
    hydrateRecommendations();
    hydrateGuestbook();
  }

  async function hydrateEvents() {
    const list = document.querySelector("[data-events-list]");

    if (!list) {
      return;
    }

    try {
      const events = await loadEvents();
      const upcomingEvents = getUpcomingEvents(events);

      if (!upcomingEvents.length) {
        list.replaceChildren(renderUpcomingEmptyState());
        return;
      }

      list.replaceChildren(...upcomingEvents.map(renderEvent));
    } catch (_error) {
      // The static HTML remains as a fallback if the event file cannot be loaded.
    }
  }

  async function hydrateArchive() {
    const list = document.querySelector("[data-events-archive-list]");

    if (!list) {
      return;
    }

    try {
      const archivedEvents = getArchivedEvents(await loadEvents());

      if (!archivedEvents.length) {
        list.replaceChildren(renderArchiveEmptyState());
        return;
      }

      list.replaceChildren(...archivedEvents.map(renderArchiveEvent));
    } catch (_error) {
      // The static HTML remains as a fallback if the event file cannot be loaded.
    }
  }

  async function loadEvents() {
    const response = await fetch("/data/events.json", { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.events) ? data.events : [];
  }

  function getBerlinDateString(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: BERLIN_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${lookup.year}-${lookup.month}-${lookup.day}`;
  }

  function getEventDate(event) {
    const value = event && (event.endDate || event.date || event.startDate);
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  }

  function isPastEvent(event, today = getBerlinDateString()) {
    const eventDate = getEventDate(event);
    return Boolean(eventDate) && eventDate < today;
  }

  function getUpcomingEvents(events, today = getBerlinDateString()) {
    return events.filter((event) => !isPastEvent(event, today));
  }

  function getArchivedEvents(events, today = getBerlinDateString()) {
    return events
      .filter((event) => isPastEvent(event, today))
      .sort((first, second) => getEventDate(second).localeCompare(getEventDate(first)));
  }

  async function hydrateCurrentItems() {
  const list = document.querySelector("[data-current-list]");

  if (!list) {
    return;
  }

  try {
    const response = await fetch("/data/current.json", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (!items.length) {
      return;
    }

    list.replaceChildren(...items.map(renderCurrentItem));
  } catch (_error) {
    // The static HTML remains as a fallback if the current file cannot be loaded.
  }
}

  async function hydrateRecommendations() {
  const list = document.querySelector("[data-recommendations-list]");

  if (!list) {
    return;
  }

  try {
    const response = await fetch("/data/recommendations.json", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (!items.length) {
      return;
    }

    list.replaceChildren(...items.map(renderRecommendation));
  } catch (_error) {
    // The static HTML remains as a fallback if the recommendation file cannot be loaded.
  }
}

  async function hydrateGuestbook() {
  const list = document.querySelector("[data-guestbook-list]");

  if (!list) {
    return;
  }

  try {
    const response = await fetch("/data/guestbook.json", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const entries = Array.isArray(data.entries) ? data.entries : [];

    if (!entries.length) {
      return;
    }

    list.replaceChildren(...entries.map(renderGuestbookEntry));
  } catch (_error) {
    // The static HTML remains as a fallback if the guestbook file cannot be loaded.
  }
}

if (typeof document !== "undefined") {
  (async () => {
    const list = document.querySelector("[data-artworks-list]");

    if (!list) {
      return;
    }

    try {
      const response = await fetch("/data/artworks.json", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];

      if (!items.length) {
        return;
      }

      list.replaceChildren(...items.map((item, index) => renderArtwork(item, index === 0)));
    } catch (_error) {
      // The static HTML remains as a fallback if the artwork file cannot be loaded.
    }
  })();

  (async () => {
    const list = document.querySelector("[data-photographs-list]");

    if (!list) {
      return;
    }

    try {
      const response = await fetch("/data/photographs.json", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];

      if (!items.length) {
        return;
      }

      list.replaceChildren(...items.map(renderPhotograph));
    } catch (_error) {
      // The static HTML remains as a fallback if the photograph file cannot be loaded.
    }
  })();
}

function renderCurrentItem(item) {
  const article = document.createElement("article");

  const label = document.createElement("span");
  label.textContent = item.label || "Aktuell";

  const title = document.createElement("h3");
  title.textContent = item.title || "Gerade bei De Plaat";

  const text = document.createElement("p");
  text.textContent = item.text || "";

  article.append(label, title, text);
  return article;
}

function renderRecommendation(item) {
  const article = document.createElement("article");

  const label = document.createElement("span");
  label.textContent = item.label || "Empfehlung";

  const title = document.createElement("h3");
  title.textContent = item.title || "Plattenempfehlung";

  const text = document.createElement("p");
  text.textContent = item.text || "";

  article.append(label, title, text);

  if (item.linkHref && item.linkLabel) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = item.linkHref;
    link.textContent = item.linkLabel;

    if (item.external) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    article.append(link);
  }

  return article;
}

function renderGuestbookEntry(entry) {
  const article = document.createElement("article");

  const label = document.createElement("span");
  label.textContent = entry.label || "Gästebuch";

  const quote = document.createElement("blockquote");
  quote.textContent = entry.text || "";

  article.append(label, quote);
  return article;
}

function renderArtwork(item, featured) {
  const article = document.createElement("article");
  article.classList.add("protected-media");

  if (featured) {
    article.classList.add("artwork-feature");
  }

  const image = document.createElement("img");
  image.src = item.image || "/assets/de-plaat-aquarell-haus.jpg";
  image.alt = item.alt || item.title || "Aquarell im De Plaat";

  const content = document.createElement("div");

  const label = document.createElement("span");
  label.textContent = item.label || "Aquarell";

  const title = document.createElement("h3");
  title.textContent = item.title || "Aquarell im De Plaat";

  const text = document.createElement("p");
  text.textContent = item.text || "";

  const status = document.createElement("p");
  status.className = "artwork-status";
  status.textContent = item.status || "auf Anfrage";

  content.append(label, title, text, status);

  if (featured) {
    article.append(image, content);
  } else {
    article.append(image, label, title, text, status);
  }

  return article;
}

function renderPhotograph(item) {
  const article = document.createElement("article");
  article.className = "protected-media";

  const image = document.createElement("img");
  image.src = item.image || "/assets/de-plaat-foto-morgenlicht.jpg";
  image.alt = item.alt || item.title || "Fotografie von De Plaat";

  const label = document.createElement("span");
  label.textContent = item.label || "Fotografie";

  const title = document.createElement("h3");
  title.textContent = item.title || "Fotografie";

  const text = document.createElement("p");
  text.textContent = item.text || "";

  const status = document.createElement("p");
  status.className = "artwork-status";
  status.textContent = item.status || "Edition und Format auf Anfrage";

  article.append(image, label, title, text, status);
  return article;
}

function renderEvent(event) {
  const article = document.createElement("article");

  if (event.featured && event.posterImage) {
    article.className = "featured-event";

    if (event.posterImage) {
      const poster = document.createElement(event.protectedMedia ? "div" : "a");
      poster.className = "event-poster";
      if (event.posterVariant) {
        poster.classList.add(event.posterVariant);
      }
      if (event.protectedMedia) {
        poster.classList.add("protected-media");
      } else {
        poster.href = event.posterHref || event.url || event.posterPdf || "#";
        if (event.posterExternal || poster.href.endsWith(".pdf")) {
          poster.target = "_blank";
          poster.rel = "noopener";
        }
      }
      poster.setAttribute("aria-label", event.posterLabel || `${event.title} öffnen`);

      const image = document.createElement("img");
      image.src = event.posterImage;
      image.alt = event.posterAlt || `Plakat ${event.title}`;
      poster.append(image);
      article.append(poster);
    }

    const copy = document.createElement("div");
    copy.className = "event-copy";
    appendEventText(copy, event);

    if (event.locationLabel && event.mapsUrl) {
      const location = document.createElement("p");
      location.className = "event-location";
      location.append("Ort: ");

      const link = document.createElement("a");
      link.href = event.mapsUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = event.locationLabel;
      location.append(link);
      copy.append(location);
    }

    if (event.posterPdf) {
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = event.posterPdf;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = event.linkLabel || "Mehr ansehen";
      copy.append(link);
    }

    if (event.url) {
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = event.url;
      link.textContent = event.urlLabel || "Terminseite öffnen";
      copy.append(link);
    }

    article.append(copy);
    return article;
  }

  appendEventText(article, event);

  if (event.url) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = event.url;
    link.textContent = event.urlLabel || "Termin ansehen";
    article.append(link);
  }

  return article;
}

function renderArchiveEvent(event) {
  const article = document.createElement("article");
  article.className = event && event.featured && event.posterImage ? "featured-event archive-event" : "archive-event";

  if (event && event.posterImage) {
    const poster = document.createElement(event.url ? "a" : "div");
    poster.className = "event-poster archive-event-poster";

    if (event.url) {
      poster.href = event.url;
      poster.setAttribute("aria-label", `${event.title || "Termin"} im Archiv ansehen`);
    }

    const image = document.createElement("img");
    image.src = event.posterImage;
    image.alt = event.posterAlt || `Bild zu ${event.title || "Termin"}`;
    poster.append(image);
    article.append(poster);
  }

  const copy = document.createElement("div");
  copy.className = "event-copy";
  appendEventText(copy, event || {});

  if (event && event.locationLabel) {
    const location = document.createElement("p");
    location.className = "event-location";
    location.append("Ort: ");

    if (event.mapsUrl) {
      const link = document.createElement("a");
      link.href = event.mapsUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = event.locationLabel;
      location.append(link);
    } else {
      location.append(event.locationLabel);
    }

    copy.append(location);
  }

  if (event && event.url) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = event.url;
    link.textContent = event.archiveUrlLabel || "Rückblick ansehen";
    copy.append(link);
  }

  article.append(copy);
  return article;
}

function appendEventText(container, event) {
  const time = document.createElement("time");
  const visibleDate = event.date || event.startDate;

  if (visibleDate) {
    time.dateTime = visibleDate;
  }

  time.textContent = event.dateLabel || visibleDate || "Nach Ankündigung";

  const title = document.createElement("h3");
  title.textContent = event.title || "Termin";

  const description = document.createElement("p");
  description.textContent = event.description || "";

  container.append(time, title, description);
}

function renderUpcomingEmptyState() {
  const article = document.createElement("article");
  article.className = "empty-state";

  const title = document.createElement("h3");
  title.textContent = "Aktuell ist kein neuer Termin angekündigt.";

  const text = document.createElement("p");
  text.textContent = "Vergangene Abende bleiben im Archiv auffindbar.";

  article.append(title, text);
  return article;
}

function renderArchiveEmptyState() {
  const article = document.createElement("article");
  article.className = "empty-state";

  const title = document.createElement("h2");
  title.textContent = "Noch keine vergangenen Termine im Archiv.";

  const text = document.createElement("p");
  text.textContent = "Sobald ein Abend vorbei ist, erscheint er hier automatisch.";

  article.append(title, text);
  return article;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((image) => {
      image.setAttribute("draggable", "false");
      image.setAttribute("loading", image.getAttribute("loading") || "lazy");
    });
  });

  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest("img, .artworks, .photographs, .protected-media, .event-poster, .event-hero-poster")) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (event.target.closest("img")) {
      event.preventDefault();
    }
  });

  document.addEventListener("copy", (event) => {
    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;

    if (container && container.closest(".artworks, .photographs, .protected-media")) {
      event.preventDefault();
      selection.removeAllRanges();
    }
  });

  document.addEventListener("keydown", (event) => {
    const protectedShortcut = (event.metaKey || event.ctrlKey) && ["c", "s", "u", "p"].includes(event.key.toLowerCase());
    const activeSelection = window.getSelection();

    if (protectedShortcut && activeSelection && activeSelection.toString()) {
      const node = activeSelection.anchorNode?.nodeType === Node.ELEMENT_NODE
        ? activeSelection.anchorNode
        : activeSelection.anchorNode?.parentElement;

      if (node && node.closest(".artworks, .photographs, .protected-media")) {
        event.preventDefault();
        activeSelection.removeAllRanges();
      }
    }
  });
}

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      getArchivedEvents,
      getBerlinDateString,
      getEventDate,
      getUpcomingEvents,
      isPastEvent,
      renderArchiveEmptyState,
      renderArchiveEvent,
      renderUpcomingEmptyState
    };
  }
})();
