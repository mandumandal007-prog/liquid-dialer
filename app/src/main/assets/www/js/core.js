/* =========================================================
   Core: storage, settings, themes, helpers
   ========================================================= */

const LS_PREFIX = 'lq_v1_';

const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    } catch (err) { /* storage full / private mode */ }
  },
  remove(key) {
    try { localStorage.removeItem(LS_PREFIX + key); } catch (err) {}
  }
};

const DEFAULT_SETTINGS = {
  theme: 'midnight',
  accent: '#5b8cff',
  blur: 22,
  motion: true,

  profileName: 'You',
  profileNumber: '+919000000000',

  defaultSim: 'SIM 1',
  callWaiting: true,
  callForwarding: false,
  forwardTo: '',
  autoRecord: false,
  vibrateAnswer: true,
  keyTones: true,
  proximity: true,
  flipToMute: true,
  announceCaller: false,
  addCallEnabled: true,
  voicemail: '*99',

  banner: true,
  missedAlerts: true,

  blockUnknown: false
};

const THEMES = {
  midnight: { name: 'Midnight', preview: 'linear-gradient(135deg,#0b1020,#1d2b5c)', meta: '#070a12' },
  aurora:   { name: 'Aurora',   preview: 'linear-gradient(135deg,#04120f,#0f5c4a)', meta: '#04120f' },
  sunset:   { name: 'Sunset',   preview: 'linear-gradient(135deg,#1a0708,#7a2c1b)', meta: '#140708' },
  daylight: { name: 'Daylight', preview: 'linear-gradient(135deg,#ffffff,#c9d8ff)', meta: '#e9eefb' }
};

const ACCENTS = ['#5b8cff', '#a06bff', '#2ee6a8', '#ff8a5b', '#f5c542'];

const state = {
  settings: Object.assign({}, DEFAULT_SETTINGS, Store.get('settings', {})),
  contacts: Store.get('contacts', SEED_CONTACTS),
  recents: Store.get('recents', SEED_RECENTS),
  tab: 'recents',
  query: ''
};

function persistSettings() { Store.set('settings', state.settings); }
function persistContacts() { Store.set('contacts', state.contacts); }
function persistRecents() { Store.set('recents', state.recents.slice(0, 100)); }

/* ---------- tiny helpers ---------- */

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function uid() {
  return 'id_' + Math.random().toString(36).slice(2, 10);
}

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[\u0026\u003c\u003e"']/g, ch => ({
    '\u0026': '\u0026amp;', '\u003c': '\u0026lt;', '\u003e': '\u0026gt;', '"': '\u0026quot;', "'": '\u0026#39;'
  }[ch]));
}

function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function prettyNumber(raw) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s) return '';
  const plus = s.startsWith('+');
  const digits = s.replace(/\D/g, '');
  if (!digits) return plus ? '+' : '';
  if (plus && digits.startsWith('91') && digits.length >= 12) {
    return '+91 ' + digits.slice(2, 7) + ' ' + digits.slice(7);
  }
  if (plus && digits.length > 6) {
    return '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 7) + ' ' + digits.slice(7);
  }
  return (plus ? '+' : '') + digits;
}

function fmtDuration(totalSeconds) {
  const sec = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
}

function relTime(ts) {
  const diff = (Date.now() - ts) / 60000;
  if (diff < 1) return 'Just now';
  if (diff < 60) return Math.floor(diff) + 'm ago';
  if (diff < 60 * 24) {
    return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (diff < 60 * 24 * 7) {
    return new Date(ts).toLocaleDateString([], { weekday: 'short' });
  }
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (err) {}
}

function findContactByNumber(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 5) return null;
  const tail = digits.slice(-10);
  return state.contacts.find(c => c.number.replace(/\D/g, '').slice(-10) === tail) || null;
}

/* ---------- theme ---------- */

function applyTheme() {
  const s = state.settings;
  const theme = THEMES[s.theme] || THEMES.midnight;
  const root = document.documentElement;

  root.dataset.theme = s.theme;
  root.dataset.motion = s.motion ? 'on' : 'off';
  root.style.setProperty('--accent', s.accent);
  root.style.setProperty('--blur', Number(s.blur) + 'px');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.meta);
}
