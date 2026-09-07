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

function renderEvent(event) {
  const article = document.createElement("article");

  if (event.featured && event.posterImage) {
    article.className = "featured-event";

    if (event.posterImage && event.posterPdf) {
      const poster = document.createElement("a");
      poster.className = "event-poster";
      poster.href = event.posterPdf;
      poster.target = "_blank";
      poster.rel = "noopener";
      poster.setAttribute("aria-label", `${event.title} Plakat groß in neuem Tab öffnen`);

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
