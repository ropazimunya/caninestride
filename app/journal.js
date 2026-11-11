const activity = [42, 46, 39, 48, 45, 43, 49, 35, 38, 42, 37, 34, 41, 39];
const storageKey = 'caninestride-practice-observations-v1';
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
const form = document.getElementById('observation-form');
const status = document.getElementById('save-status');
const viewReport = document.getElementById('view-report');
const chartReading = document.getElementById('chart-reading');
const lists = [...document.querySelectorAll('[data-observations]')];
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
let observations = [];

try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) {
    observations = stored.filter(entry => entry && typeof entry.movement === 'string' &&
      typeof entry.note === 'string' && typeof entry.context === 'string' &&
      typeof entry.date === 'string' && Number.isFinite(Date.parse(entry.date)));
  }
} catch {
  // The prototype still works for the current visit if storage is blocked.
}

function persistObservations() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(observations));
    return true;
  } catch {
    return false;
  }
}

function selectTab(index, focus = false) {
  tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(index === position));
    tab.tabIndex = index === position ? 0 : -1;
    panels[position].hidden = index !== position;
  });
  if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    const next = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    selectTab(next, true);
  });
});

function renderObservations() {
  for (const list of lists) {
    list.replaceChildren();
    if (observations.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'hint';
      empty.textContent = 'No practice observations yet.';
      list.append(empty);
      continue;
    }
    observations.forEach((entry, index) => {
      const item = document.createElement('li');
      item.className = 'observation';
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = [entry.movement, entry.context].filter(Boolean).join(' · ');
      const time = document.createElement('time');
      time.dateTime = entry.date;
      time.textContent = dateFormat.format(new Date(entry.date));
      copy.append(title, time);
      if (entry.note) {
        const note = document.createElement('p');
        note.textContent = entry.note;
        copy.append(note);
      }
      item.append(copy);
      if (list.dataset.observations === 'edit') {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', 'Remove observation: ' + entry.movement);
        remove.addEventListener('click', () => {
          observations.splice(index, 1);
          status.textContent = persistObservations() ? 'Observation removed.' : 'Removed for this visit only.';
          renderObservations();
          form.elements.movement.focus();
        });
        item.append(remove);
      }
      list.append(item);
    });
  }
  viewReport.hidden = observations.length === 0;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  observations.unshift({
    movement: String(fields.get('movement')),
    context: String(fields.get('context')),
    note: String(fields.get('note')).trim(),
    date: new Date().toISOString(),
  });
  status.textContent = persistObservations() ? 'Observation saved in this browser.' : 'Observation added for this visit. Browser storage is unavailable.';
  form.reset();
  renderObservations();
});

viewReport.addEventListener('click', () => selectTab(2, true));
document.getElementById('print-report').addEventListener('click', () => window.print());

const chart = document.getElementById('activity-chart');
activity.forEach((minutes, index) => {
  const day = 'Day ' + (index + 1) + ' · ' + minutes + ' active minutes';
  const item = document.createElement('li');
  const button = document.createElement('button');
  const bar = document.createElement('span');
  button.type = 'button';
  button.setAttribute('aria-label', day);
  button.setAttribute('aria-pressed', 'false');
  bar.style.height = (minutes / 60 * 100) + '%';
  button.append(bar);
  button.addEventListener('click', () => {
    chart.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    chartReading.textContent = day + ' (sample).';
  });
  item.append(button);
  chart.append(item);
});

function average(values) {
  return Math.round(values.reduce((total, minutes) => total + minutes, 0) / values.length);
}

document.getElementById('week-one').textContent = average(activity.slice(0, 7));
document.getElementById('week-two').textContent = average(activity.slice(7));
renderObservations();
