const assert = require("assert/strict");
const {
  getArchivedEvents,
  getUpcomingEvents,
  isPastEvent,
  renderArchiveEmptyState,
  renderArchiveEvent,
  renderEventPreview,
  renderEventPreviewEmptyState
} = require("../events.js");

class TestElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.className = "";
    this.textContent = "";
  }

  append(...children) {
    this.children.push(...children);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

global.document = {
  createElement(tagName) {
    return new TestElement(tagName);
  }
};

function collectText(node) {
  if (typeof node === "string") {
    return node;
  }

  return [node.textContent, ...node.children.map(collectText)].join(" ");
}

function collectElements(node, tagName, results = []) {
  if (node.tagName === tagName) {
    results.push(node);
  }

  node.children
    .filter((child) => typeof child !== "string")
    .forEach((child) => collectElements(child, tagName, results));

  return results;
}

const today = "2026-09-07";
const kaurna = {
  featured: true,
  date: "2026-08-14",
  endDate: "2026-08-14",
  dateLabel: "14. August 2026",
  title: "Kaurna Cronin & the band mates",
  description: "Ruckblick bei De Plaat.",
  locationLabel: "De Plaat, Marktstrasse 8, 26427 Esens",
  mapsUrl: "https://example.com/maps",
  url: "/termine/kaurna-cronin-2026.html"
};

assert.equal(isPastEvent(kaurna, today), true);
assert.equal(isPastEvent({ date: "2026-09-07" }, today), false);
assert.equal(isPastEvent({ endDate: "2026-09-06" }, today), true);
assert.equal(isPastEvent({ startDate: "2026-08-01" }, today), true);
assert.equal(isPastEvent({ title: "Ohne Datum" }, today), false);

const events = [
  { title: "Alter Abend", date: "2026-04-01" },
  { title: "Ohne Datum" },
  { title: "Neuer Abend", date: "2026-10-01" },
  { title: "Kaurna", date: "2026-08-14" }
];

assert.deepEqual(
  getArchivedEvents(events, today).map((event) => event.title),
  ["Kaurna", "Alter Abend"]
);
assert.deepEqual(
  getUpcomingEvents(events, today).map((event) => event.title),
  ["Ohne Datum", "Neuer Abend"]
);

const archiveItem = renderArchiveEvent(kaurna);
const archiveText = collectText(archiveItem);
const archiveLinks = collectElements(archiveItem, "a");
const archiveImages = collectElements(archiveItem, "img");

assert.match(archiveText, /Kaurna Cronin/);
assert.match(archiveText, /14\. August 2026/);
assert.match(archiveText, /De Plaat/);
assert.equal(archiveImages.length, 0);
assert.equal(archiveLinks.some((link) => link.href === "/termine/kaurna-cronin-2026.html"), true);
assert.doesNotMatch(archiveText, /Reservierung|reservieren|kaufen|WhatsApp/i);

const previewItem = renderEventPreview(kaurna);
const previewText = collectText(previewItem);
const previewHeadings = collectElements(previewItem, "h4");
assert.match(previewText, /Kaurna Cronin/);
assert.equal(previewHeadings.length, 1);
assert.equal(collectElements(previewItem, "a").some((link) => link.href === "/termine/kaurna-cronin-2026.html"), true);

const previewEmptyState = renderEventPreviewEmptyState();
assert.match(collectText(previewEmptyState), /Noch kein Rückblick vorhanden/);

const emptyState = renderArchiveEmptyState();
assert.match(collectText(emptyState), /Noch keine vergangenen Termine/);

assert.match(
  collectText(renderArchiveEvent({ title: "Startdatum", startDate: "2026-08-01" })),
  /2026-08-01/
);

console.log("events archive tests passed");
