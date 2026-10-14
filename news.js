const GDACS_URL = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ%3BTC%3BFL%3BWF&alertlevel=Green%3BOrange%3BRed';
const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
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
  const raw = String(event.type || event.eventtype || event.properties?.eventtype || '').toUpperCase();
  const text = `${event.title || ''} ${event.name || ''}`.toLowerCase();
  if (raw.includes('EQ') || text.includes('earthquake')) return { label: 'Earthquake', className: 'earthquake' };
  if (raw.includes('TC') || raw.includes('CY') || text.includes('tropical cyclone')) return { label: 'Cyclone', className: 'cyclone' };
  if (raw.includes('FL') || text.includes('flood')) return { label: 'Flood', className: 'flood' };
  if (raw.includes('WF') || text.includes('wildfire') || text.includes('forest fire')) return { label: 'Wildfire', className: 'wildfire' };
  if (raw.includes('TS') || text.includes('tsunami')) return { label: 'Tsunami', className: 'tsunami' };
  return { label: 'Disaster event', className: 'default' };
}

function normalizeGdacs(item) {
  const p = item.properties || item;
  const coords = item.geometry?.coordinates;
  const type = getEventType({ ...p, type: p.eventtype || p.eventType || p.type });
  const title = p.name || p.title || `${type.label} event`;
  return {
    id: String(p.eventid || p.id || item.id || `${title}-${p.fromdate || p.tostring || ''}`),
    title,
    description: p.description || p.alertlevelname || p.alertlevel || 'Disaster event reported by GDACS.',
    date: p.fromdate || p.tostring || p.to || p.datemodified || p.date || null,
    url: p.url || p.htmllink || p.link || 'https://www.gdacs.org/',
    type,
    source: 'GDACS',
    magnitude: p.severitydata?.severity || p.severity || null,
    alert: p.alertlevelname || p.alertlevel || null,
    coordinates: Array.isArray(coords) ? coords.slice(0, 2) : null
  };
}

function normalizeUsgs(feature) {
  const p = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  return {
    id: `USGS-${feature.id || p.code || p.time}`,
    title: p.title || 'Earthquake detected',
    description: `Magnitude ${p.mag ?? 'unknown'} earthquake${p.place ? ` near ${p.place}` : ''}.`,
    date: p.time ? new Date(p.time).toISOString() : null,
    url: p.url || 'https://earthquake.usgs.gov/earthquakes/map/',
    type: { label: 'Earthquake', className: 'earthquake' },
    source: 'USGS',
    magnitude: p.mag,
    alert: p.alert || null,
    coordinates: coords.length >= 2 ? coords.slice(0, 2) : null
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

async function fetchDisasterNews() {
  loading.style.display = 'block';
  loading.textContent = 'Loading live disaster events…';
  const results = await Promise.allSettled([fetchJson(GDACS_URL), fetchJson(USGS_URL)]);
  let gdacsEvents = [];
  let usgsEvents = [];

  if (results[0].status === 'fulfilled') {
    const data = results[0].value;
    const items = Array.isArray(data.features) ? data.features : Array.isArray(data) ? data : (data.events || data.eventlist || []);
    gdacsEvents = items.map(normalizeGdacs);
  }
  if (results[1].status === 'fulfilled') {
    usgsEvents = (results[1].value.features || []).map(normalizeUsgs);
  }

  // Prefer GDACS for global multi-hazard alerts; use USGS for detailed earthquake coverage.
  const unique = new Map();
  [...gdacsEvents, ...usgsEvents].forEach(event => {
    if (!event.title || !event.url) return;
    const key = event.id || `${event.title}-${event.date}`;
    unique.set(key, event);
  });
  allEvents = [...unique.values()].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  loading.style.display = 'none';
  if (!allEvents.length) {
    loading.style.display = 'block';
    loading.textContent = 'Live disaster data could not be loaded. Check your connection or try again later.';
    container.innerHTML = '';
    updatePagination(0);
    return;
  }
  renderEvents();
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : 'https://www.gdacs.org/';
  } catch {
    return 'https://www.gdacs.org/';
  }
}

function renderEvents() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = allEvents.filter(event =>
    `${event.title} ${event.description} ${event.type.label} ${event.source} ${event.alert || ''}`.toLowerCase().includes(keyword)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  container.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'news-empty';
    empty.textContent = 'No matching disaster events found.';
    container.appendChild(empty);
  }

  filtered.slice(start, start + PAGE_SIZE).forEach(event => {
    const card = document.createElement('article');
    card.className = 'news-card';
    const title = document.createElement('h2');
    title.textContent = event.title;
    const date = document.createElement('div');
    date.className = 'date-time';
    const parsedDate = event.date ? new Date(event.date) : null;
    date.textContent = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : 'Date not provided';
    const description = document.createElement('p');
    description.textContent = event.description;
    const meta = document.createElement('p');
    meta.className = 'event-meta';
    meta.textContent = [event.source, event.alert ? `Alert: ${event.alert}` : '', event.magnitude !== null && event.magnitude !== undefined ? `Magnitude/severity: ${event.magnitude}` : ''].filter(Boolean).join(' · ');
    const link = document.createElement('a');
    link.href = safeExternalUrl(event.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View official details';
    const tag = document.createElement('span');
    tag.className = `tag ${event.type.className}`;
    tag.textContent = event.type.label;
    card.append(title, date, description, meta, link, document.createElement('br'), tag);
    container.appendChild(card);
  });
  updatePagination(filtered.length);
}

function updatePagination(filteredCount) {
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  prevButton.disabled = currentPage <= 1 || filteredCount === 0;
  nextButton.disabled = currentPage >= totalPages || filteredCount === 0;
  pageInfo.textContent = filteredCount ? `Page ${currentPage} of ${totalPages} · ${filteredCount} events` : '0 events';
}

searchInput.addEventListener('input', () => {
  currentPage = 1;
  renderEvents();
});
prevButton.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderEvents(); } });
nextButton.addEventListener('click', () => { currentPage++; renderEvents(); });
fetchDisasterNews().catch(error => {
  console.error('Unable to load disaster data:', error);
  loading.style.display = 'block';
  loading.textContent = 'Unable to load disaster data right now. Please try again later.';
});
