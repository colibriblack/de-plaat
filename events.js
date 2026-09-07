(async () => {
  const list = document.querySelector("[data-events-list]");

  if (!list) {
    return;
  }

  try {
    const response = await fetch("/data/events.json", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    if (!events.length) {
      return;
    }

    list.replaceChildren(...events.map(renderEvent));
  } catch (_error) {
    // The static HTML remains as a fallback if the event file cannot be loaded.
  }
})();

(async () => {
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
})();

(async () => {
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
})();

(async () => {
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
})();

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

function appendEventText(container, event) {
  const time = document.createElement("time");

  if (event.date) {
    time.dateTime = event.date;
  }

  time.textContent = event.dateLabel || event.date || "Nach Ankündigung";

  const title = document.createElement("h3");
  title.textContent = event.title || "Termin";

  const description = document.createElement("p");
  description.textContent = event.description || "";

  container.append(time, title, description);
}

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
