/* =========================================================
   Call engine (demo)
   Real telephony is not available in a browser. These
   functions simulate an outgoing / incoming call lifecycle
   so the entire UI can be tested end-to-end.
   ========================================================= */

let activeCall = null;
let callClock = null;

/* ---------- start / finish ---------- */

function startCall(target) {
  if (activeCall) {
    toast('A call is already in progress');
    return;
  }

  const info = typeof target === 'string'
    ? { name: prettyNumber(target) || 'Unknown', number: target, color: '#5b8cff' }
    : {
        name: target.name || prettyNumber(target.number) || 'Unknown',
        number: target.number,
        color: target.color || '#5b8cff'
      };

  if (!info.number) {
    toast('Enter a number to call');
    return;
  }

  activeCall = {
    id: uid(),
    name: info.name,
    number: info.number,
    color: info.color,
    direction: 'outgoing',
    status: 'dialing',
    muted: false,
    speaker: false,
    held: false,
    sim: state.settings.defaultSim,
    seconds: 0,
    minimized: false,
    second: null,
    conference: false,
    startedAt: null
  };

  closeSheet();
  closeDrawer();
  closeSettings();

  startCallClock();
  syncCallUI();
  vibrate(12);

  activeCall.connectTimer = setTimeout(() => {
    if (activeCall && activeCall.status === 'dialing') {
      activeCall.status = 'active';
      activeCall.startedAt = Date.now();
      syncCallUI();
      toast('Call connected');
    }
  }, 2200);
}

function simulateIncoming() {
  if (activeCall) {
    toast('You are already on a call');
    return;
  }

  const contact = state.contacts[Math.floor(Math.random() * state.contacts.length)];

  activeCall = {
    id: uid(),
    name: contact.name,
    number: contact.number,
    color: contact.color,
    direction: 'incoming',
    status: 'ringing',
    muted: false,
    speaker: false,
    held: false,
    sim: state.settings.defaultSim,
    seconds: 0,
    minimized: false,
    second: null,
    conference: false,
    startedAt: null
  };

  closeDrawer();
  closeSettings();
  closeSheet();
  syncCallUI();
  vibrate([260, 160, 260, 160, 260]);
}

function acceptCall() {
  if (!activeCall || activeCall.status !== 'ringing') return;
  activeCall.status = 'active';
  activeCall.startedAt = Date.now();
  startCallClock();
  syncCallUI();
  vibrate(20);
  toast('Call connected');
}

function declineCall() {
  if (!activeCall) return;
  finishCall('missed');
  toast('Call declined');
}

function endCall() {
  if (!activeCall) return;
  const type = activeCall.direction === 'incoming' ? 'incoming' : 'outgoing';
  finishCall(type);
  toast('Call ended');
}

function finishCall(logType) {
  if (!activeCall) return;

  clearTimeout(activeCall.connectTimer);
  clearInterval(callClock);
  callClock = null;

  if (logType) {
    state.recents.unshift({
      id: uid(),
      name: activeCall.name,
      number: activeCall.number,
      color: activeCall.color,
      type: logType,
      at: Date.now(),
      duration: activeCall.seconds
    });
    persistRecents();
    renderLists();
  }

  activeCall = null;
  closeSheet();
  syncCallUI();
}

/* ---------- timer ---------- */

function startCallClock() {
  clearInterval(callClock);
  callClock = setInterval(() => {
    if (!activeCall) return;
    if (activeCall.status === 'active' && !activeCall.held) {
      activeCall.seconds += 1;
    }
    updateCallClock();
  }, 1000);
}

/* ---------- in-call controls ---------- */

function handleCallAction(action) {
  if (!activeCall) return;

  switch (action) {
    case 'mute':
      activeCall.muted = !activeCall.muted;
      vibrate(8);
      break;
    case 'speaker':
      activeCall.speaker = !activeCall.speaker;
      vibrate(8);
      break;
    case 'hold':
      activeCall.held = !activeCall.held;
      vibrate(8);
      break;
    case 'add':
      if (!state.settings.addCallEnabled) {
        toast('Add call is disabled in settings');
        return;
      }
      openAddCallSheet();
      return;
    case 'sim':
      openSimSheet();
      return;
    case 'keypad':
      openDtmfSheet();
      return;
    default:
      return;
  }

  syncCallUI();
}

function minimizeCall() {
  if (!activeCall) return;
  if (!state.settings.banner) {
    toast('Enable the in-call banner in settings');
    return;
  }
  activeCall.minimized = true;
  syncCallUI();
}

function expandCall() {
  if (!activeCall) return;
  activeCall.minimized = false;
  syncCallUI();
}

function changeSim(sim) {
  if (!activeCall) return;
  activeCall.sim = sim;
  state.settings.defaultSim = sim;
  persistSettings();
  renderDialerSim();
  syncCallUI();
  toast('Switched to ' + sim);
}

function placeSecondCall(number) {
  if (!activeCall) return;

  const num = String(number || '').trim();
  if (!num) {
    toast('Enter a number');
    return;
  }
  if (activeCall.second) {
    toast('Conference already has two calls');
    return;
  }

  const contact = findContactByNumber(num);
  activeCall.second = {
    name: contact ? contact.name : prettyNumber(num),
    number: num,
    status: 'dialing'
  };

  closeSheet();
  syncCallUI();
  toast('Adding call…');

  setTimeout(() => {
    if (activeCall && activeCall.second) {
      activeCall.second.status = 'active';
      activeCall.conference = true;
      syncCallUI();
      toast('Conference call started');
    }
  }, 2000);
}
