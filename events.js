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

function renderEvent(event) {
  const article = document.createElement("article");

  if (event.featured) {
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
