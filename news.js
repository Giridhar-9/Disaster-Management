const GDACS_URL =
  'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ%3BTC%3BFL%3BWF&alertlevel=Green%3BOrange%3BRed';

const PAGE_SIZE = 9;

let allEvents = [];
let currentPage = 1;

const container = document.getElementById('news-container');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageInfo = document.getElementById('page-info');

function getEventType(event) {
  const rawType = String(
    event.eventtype || event.eventType || event.type || ''
  ).toUpperCase();

  if (rawType === 'EQ' || rawType.includes('EARTHQUAKE')) {
    return { label: 'Earthquake', className: 'earthquake' };
  }

  if (
    rawType === 'TC' ||
    rawType === 'CY' ||
    rawType.includes('CYCLONE')
  ) {
    return { label: 'Cyclone', className: 'cyclone' };
  }

  if (rawType === 'FL' || rawType.includes('FLOOD')) {
    return { label: 'Flood', className: 'flood' };
  }

  if (
    rawType === 'WF' ||
    rawType.includes('WILDFIRE') ||
    rawType.includes('FIRE')
  ) {
    return { label: 'Wildfire', className: 'wildfire' };
  }

  return { label: 'Disaster event', className: 'default' };
}

function normalizeEvent(item) {
  const properties = item.properties || item;

  const eventType = getEventType({
    eventtype:
      properties.eventtype ||
      properties.eventType ||
      properties.type
  });

  const title =
    properties.name ||
    properties.title ||
    `${eventType.label} event`;

  const rawDate =
    properties.fromdate ||
    properties.tostring ||
    properties.to ||
    properties.datemodified ||
    properties.date ||
    null;

  const rawUrl =
    properties.url ||
    properties.htmllink ||
    properties.link ||
    'https://www.gdacs.org/';

  let safeUrl = 'https://www.gdacs.org/';

  try {
    const parsedUrl = new URL(rawUrl);

    if (
      parsedUrl.protocol === 'https:' ||
      parsedUrl.protocol === 'http:'
    ) {
      safeUrl = parsedUrl.href;
    }
  } catch {
    // Keep the safe GDACS fallback URL.
  }

  return {
    id: String(
      properties.eventid ||
      properties.id ||
      item.id ||
      `${title}-${rawDate || ''}`
    ),
    title,
    description:
      properties.description ||
      properties.alertlevelname ||
      properties.alertlevel ||
      'Disaster event reported by GDACS.',
    date: rawDate,
    url: safeUrl,
    type: eventType,
    alert:
      properties.alertlevelname ||
      properties.alertlevel ||
      null,
    severity:
      properties.severitydata?.severity ??
      properties.severity ??
      null
  };
}

async function fetchDisasterEvents() {
  loading.style.display = 'block';
  loading.textContent = 'Loading disaster events from GDACS...';
  container.replaceChildren();

  try {
    const response = await fetch(GDACS_URL, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`GDACS request failed: ${response.status}`);
    }

    const data = await response.json();

    const items = Array.isArray(data.features)
      ? data.features
      : Array.isArray(data)
        ? data
        : Array.isArray(data.events)
          ? data.events
          : Array.isArray(data.eventlist)
            ? data.eventlist
            : [];

    const uniqueEvents = new Map();

    items.forEach(item => {
      const event = normalizeEvent(item);

      if (event.title) {
        uniqueEvents.set(event.id, event);
      }
    });

    allEvents = [...uniqueEvents.values()].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      return dateB - dateA;
    });

    currentPage = 1;
    loading.style.display = 'none';

    renderEvents();
  } catch (error) {
    console.error('Unable to load GDACS events:', error);

    loading.style.display = 'block';
    loading.textContent =
      'Unable to load disaster events right now. Please check your internet connection or try again later.';

    container.replaceChildren();
    updatePagination(0);
  }
}

function renderEvents() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredEvents = allEvents.filter(event => {
    const searchableText = [
      event.title,
      event.description,
      event.type.label,
      event.alert || '',
      event.severity ?? ''
    ].join(' ').toLowerCase();

    return searchableText.includes(keyword);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / PAGE_SIZE)
  );

  currentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageEvents = filteredEvents.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  container.replaceChildren();

  if (filteredEvents.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'news-empty';
    emptyMessage.textContent = keyword
      ? 'No matching disaster events found.'
      : 'No disaster events are currently available from GDACS.';

    container.appendChild(emptyMessage);
  }

  pageEvents.forEach(event => {
    const card = document.createElement('article');
    card.className = 'news-card';

    const title = document.createElement('h2');
    title.textContent = event.title;

    const date = document.createElement('div');
    date.className = 'date-time';

    const parsedDate = event.date ? new Date(event.date) : null;

    date.textContent =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleString()
        : 'Date not provided';

    const description = document.createElement('p');
    description.textContent = event.description;

    const metadata = document.createElement('p');
    metadata.className = 'event-meta';

    const details = ['Source: GDACS'];

    if (event.alert) {
      details.push(`Alert: ${event.alert}`);
    }

    if (
      event.severity !== null &&
      event.severity !== undefined &&
      event.severity !== ''
    ) {
      details.push(`Severity: ${event.severity}`);
    }

    metadata.textContent = details.join(' · ');

    const tag = document.createElement('span');
    tag.className = `tag ${event.type.className}`;
    tag.textContent = event.type.label;

    const link = document.createElement('a');
    link.href = event.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View official details';

    card.append(
      title,
      date,
      description,
      metadata,
      link,
      document.createElement('br'),
      tag
    );

    container.appendChild(card);
  });

  updatePagination(filteredEvents.length);
}

function updatePagination(filteredCount) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCount / PAGE_SIZE)
  );

  prevButton.disabled =
    currentPage <= 1 || filteredCount === 0;

  nextButton.disabled =
    currentPage >= totalPages || filteredCount === 0;

  pageInfo.textContent = filteredCount
    ? `Page ${currentPage} of ${totalPages} · ${filteredCount} events`
    : '0 events';
}

searchInput.addEventListener('input', () => {
  currentPage = 1;
  renderEvents();
});

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderEvents();
  }
});

nextButton.addEventListener('click', () => {
  currentPage++;
  renderEvents();
});

fetchDisasterEvents();