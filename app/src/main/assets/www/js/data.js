/* =========================================================
   Seed data — Liquid Dialer demo
   ========================================================= */

const SEED_CONTACTS = [
  { id: 'c1',  name: 'Aarav Sharma', number: '+919876543210', color: '#6ea8ff', label: 'Mobile', fav: true  },
  { id: 'c2',  name: 'Priya Verma',  number: '+919812345678', color: '#c084fc', label: 'Mobile', fav: true  },
  { id: 'c3',  name: 'Rohan Gupta',  number: '+919900112233', color: '#34d399', label: 'Work',   fav: false },
  { id: 'c4',  name: 'Neha Singh',   number: '+919765432100', color: '#fbbf24', label: 'Mobile', fav: true  },
  { id: 'c5',  name: 'Kabir Khan',   number: '+919845001122', color: '#f472b6', label: 'Mobile', fav: false },
  { id: 'c6',  name: 'Ananya Iyer',  number: '+919700223344', color: '#38bdf8', label: 'Home',   fav: false },
  { id: 'c7',  name: 'Vikram Rao',   number: '+919833445566', color: '#a3e635', label: 'Work',   fav: false },
  { id: 'c8',  name: 'Meera Nair',   number: '+919812009988', color: '#fb923c', label: 'Mobile', fav: true  },
  { id: 'c9',  name: 'Dev Patel',    number: '+919090909090', color: '#818cf8', label: 'Mobile', fav: false },
  { id: 'c10', name: 'Sara Ali',     number: '+919922334455', color: '#2dd4bf', label: 'Home',   fav: false }
];

const NOW = Date.now();

const SEED_RECENTS = [
  { id: 'r1', name: 'Aarav Sharma', number: '+919876543210', color: '#6ea8ff', type: 'incoming', at: NOW - 1000 * 60 * 12,     duration: 214 },
  { id: 'r2', name: 'Priya Verma',  number: '+919812345678', color: '#c084fc', type: 'outgoing', at: NOW - 1000 * 60 * 48,     duration: 92  },
  { id: 'r3', name: 'Rohan Gupta',  number: '+919900112233', color: '#34d399', type: 'missed',   at: NOW - 1000 * 60 * 95,     duration: 0   },
  { id: 'r4', name: 'Neha Singh',   number: '+919765432100', color: '#fbbf24', type: 'incoming', at: NOW - 1000 * 60 * 60 * 5, duration: 361 },
  { id: 'r5', name: 'Meera Nair',   number: '+919812009988', color: '#fb923c', type: 'outgoing', at: NOW - 1000 * 60 * 60 * 21, duration: 128 },
  { id: 'r6', name: 'Kabir Khan',   number: '+919845001122', color: '#f472b6', type: 'missed',   at: NOW - 1000 * 60 * 60 * 26, duration: 0   },
  { id: 'r7', name: 'Ananya Iyer',  number: '+919700223344', color: '#38bdf8', type: 'incoming', at: NOW - 1000 * 60 * 60 * 30, duration: 47  }
];
