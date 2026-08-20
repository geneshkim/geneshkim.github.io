(function () {
  const editor = document.getElementById("editor");
  const cursorLayer = document.getElementById("cursorLayer");
  const liveRegion = document.getElementById("liveRegion");
  const activityLog = document.getElementById("activityLog");
  const parkingLot = document.getElementById("parkingLot");
  const parkingLotToggle = document.getElementById("parkingLotToggle");
  const activityPanel = document.querySelector(".activity-panel");
  const settingsMenu = document.getElementById("settingsMenu");
  const replayCursors = document.getElementById("replayCursors");
  const overviewButton = document.getElementById("overviewButton");
  const activeListButton = document.getElementById("activeListButton");
  const jumpButton = document.getElementById("jumpButton");
  const followButton = document.getElementById("followButton");
  const helpButton = document.getElementById("helpButton");
  const helpDialog = document.getElementById("helpDialog");
  const helpCloseButton = document.getElementById("helpCloseButton");
  const speechToggle = document.getElementById("speechToggle");
  const prosodyToggle = document.getElementById("prosodyToggle");
  const earconToggle = document.getElementById("earconToggle");
  const panningToggle = document.getElementById("panningToggle");
  const activityToggle = document.getElementById("activityToggle");
  const densitySelect = document.getElementById("densitySelect");

  const prototype = document.body.dataset.prototype || "functional";
  const collaboratorOrder = ["octopus", "cardinal", "beaver", "fox", "frog", "rabbit", "turtle", "moth", "whale"];
  const sectionNames = {
    timeline: "Launch Timeline",
    feedback: "Customer Feedback",
    design: "Design Decisions",
    questions: "Open Questions",
    risks: "Risks",
    actions: "Action Items"
  };
  const overviewCounts = {
    timeline: { comments: 1, edits: 1 },
    feedback: { comments: 2, edits: 0 },
    design: { comments: 1, edits: 2 },
    questions: { comments: 2, edits: 1 },
    risks: { comments: 0, edits: 2 },
    actions: { comments: 1, edits: 1 }
  };
  const editPlans = {
    octopus: { line: "timeline-b", deleteText: "final ", insertText: "updated ", insertAfter: "and " },
    cardinal: { line: "design-b", deleteText: "ribbon ", insertText: "paper band ", insertAfter: "comparing " },
    beaver: { line: "questions-b", deleteText: "sooner", insertText: "by Friday", insertAfter: "arrive " },
    fox: { line: "feedback-b", deleteText: "warm, ", insertText: "direct, ", insertAfter: "clear, " },
    frog: { line: "risks-a", deleteText: "highest ", insertText: "main ", insertAfter: "The " },
    rabbit: { line: "actions-b", deleteText: "dark ", insertText: "espresso ", insertAfter: "and " },
    turtle: { line: "timeline-a", deleteText: "autumn ", insertText: "seasonal ", insertAfter: "The " },
    moth: { line: "design-a", deleteText: "quiet ", insertText: "soft ", insertAfter: "use a " },
    whale: { line: "questions-a", deleteText: "final ", insertText: "clear ", insertAfter: "need a " }
  };
  const defaultProsody = { prefix: "‵vs50 ‵vb50 ", suffix: "‵vs50 ‵vb50" };
  const animalSpeechProfiles = {
    octopus: {
      prefix: "‵vs48 ‵vb46 ",
      joinVerb: "swam into",
      moveVerb: "slipped over to",
      awayVerb: "slipped away from",
      nearbyVerb: "is swimming near",
      joinPunctuation: "",
      locationLead: "across"
    },
    cardinal: {
      prefix: "‵vs68 ‵vb72 ",
      joinVerb: "flew into",
      moveVerb: "fluttered over to",
      awayVerb: "fluttered away from",
      nearbyVerb: "is fluttering near",
      joinPunctuation: ",",
      locationLead: ""
    },
    beaver: {
      prefix: "‵vs38 ‵vb34 ",
      joinVerb: "settled into",
      moveVerb: "lumbered over to",
      awayVerb: "lumbered away from",
      nearbyVerb: "is lumbering near",
      joinPunctuation: ".",
      locationLead: ""
    },
    fox: {
      prefix: "‵vs58 ‵vb54 ",
      joinVerb: "slinked into",
      moveVerb: "trotted over to",
      awayVerb: "trotted away from",
      nearbyVerb: "is trodding near",
      joinPunctuation: ",",
      locationLead: ""
    },
    frog: {
      prefix: "‵vs62 ‵vb60 ",
      joinVerb: "leaped into",
      moveVerb: "hopped over to",
      awayVerb: "hopped away from",
      nearbyVerb: "is hopping near",
      joinPunctuation: ",",
      locationLead: ""
    },
    rabbit: {
      prefix: "‵vs64 ‵vb58 ",
      joinVerb: "jumped into",
      moveVerb: "bounded over to",
      awayVerb: "bounded away from",
      nearbyVerb: "is bouncing near",
      joinPunctuation: ",",
      locationLead: ""
    },
    turtle: {
      prefix: "‵vs34 ‵vb38 ",
      joinVerb: "crawled into",
      moveVerb: "trudged over to",
      awayVerb: "trudged away from",
      nearbyVerb: "is trudging near",
      joinPunctuation: ".",
      locationLead: ""
    },
    moth: {
      prefix: "‵vs60 ‵vb66 ",
      joinVerb: "flapped into",
      moveVerb: "floated over to",
      awayVerb: "floated away from",
      nearbyVerb: "is floating near",
      joinPunctuation: ",",
      locationLead: ""
    },
    whale: {
      prefix: "‵vs42 ‵vb32 ",
      joinVerb: "dived into",
      moveVerb: "glided over to",
      awayVerb: "glided away from",
      nearbyVerb: "is gliding near",
      joinPunctuation: ".",
      locationLead: ""
    }
  };
  const settings = {
    speech: true,
    prosody: true,
    earcons: true,
    panning: true,
    activity: true,
    density: Number(densitySelect.value)
  };

  const collaborators = {
    octopus: makeCollaborator("octopus", "Anonymous Octopus", "#7b61ff", "timeline", "timeline-b", "risks", "risks-b", true),
    cardinal: makeCollaborator("cardinal", "Anonymous Cardinal", "#d23f57", "design", "design-b", "actions", "actions-a"),
    beaver: makeCollaborator("beaver", "Anonymous Beaver", "#9b6a1f", "questions", "questions-b", "feedback", "feedback-a"),
    fox: makeCollaborator("fox", "Anonymous Fox", "#c85b2b", "feedback", "feedback-b", "questions", "questions-a"),
    frog: makeCollaborator("frog", "Anonymous Frog", "#3f8f4f", "risks", "risks-a", "timeline", "timeline-a"),
    rabbit: makeCollaborator("rabbit", "Anonymous Rabbit", "#b45b84", "actions", "actions-b", "design", "design-a"),
    turtle: makeCollaborator("turtle", "Anonymous Turtle", "#607f3f", "timeline", "timeline-a", "risks", "risks-a"),
    moth: makeCollaborator("moth", "Anonymous Moth", "#7f6a9d", "design", "design-a", "feedback", "feedback-b"),
    whale: makeCollaborator("whale", "Anonymous Whale", "#2f7f9f", "questions", "questions-a", "actions", "actions-b")
  };

  let audioContext;
  let hasStarted = false;
  let parkingLotEnabled = false;
  let lastParkingCollision = null;
  let currentCursor = { para: null, line: null };
  let jumpIndex = -1;
  let followedCollaboratorId = null;
  let followTimer = null;
  const demoTimers = [];
  const previousProximity = {};
  const messageQueue = [];
  const originalLineText = {};
  let queueBusy = false;

  Object.values(collaborators).forEach((collaborator, index) => {
    collaborator.initialStatus = collaborator.status;
    collaborator.initialLocation = { ...collaborator.location };
    collaborator.joinDelay = index * 5200;
    collaborator.leaveDelay = 120000 + index * 9000;
    previousProximity[collaborator.id] = { para: false, line: false };
  });
  editor.querySelectorAll("[data-line]").forEach((line) => {
    if (line === parkingLot || parkingLot.contains(line)) return;
    originalLineText[line.dataset.line] = line.textContent;
  });
  resetParkingSlots();
  applyPrototypeEarcons();

  function resetParkingSlots() {
    parkingLot.replaceChildren();
    collaboratorOrder.forEach((id) => {
      const slot = document.createElement("span");
      slot.dataset.parkingSlot = id;
      slot.textContent = "  ";
      parkingLot.append(slot);
    });
  }

  function makeCollaborator(id, name, color, para, line, movePara, moveLine, joinedAtStart = false) {
    return {
      id,
      name,
      color,
    status: joinedAtStart ? "present" : "waiting",
    joinedAtStart,
    location: { para, line },
    moveTo: { para: movePara, line: moveLine },
      editPlan: editPlans[id],
      editCount: 0,
      identity: { volume: 0.2, notes: [] }
    };
  }

  function applyPrototypeEarcons() {
    const animalEarcons = {
      octopus: { volume: 0.315, notes: [{ frequency: 690, offset: 0, duration: 0.045, type: "triangle" }, { frequency: 830, offset: 0.042, duration: 0.045, type: "triangle" }, { frequency: 720, offset: 0.084, duration: 0.05, type: "triangle" }] },
      cardinal: { volume: 0.306, notes: [{ frequency: 1320, offset: 0, duration: 0.045, type: "sine" }, { frequency: 1760, offset: 0.09, duration: 0.07, type: "sine" }] },
      beaver: { volume: 0.208, notes: [{ frequency: 245, offset: 0, duration: 0.065, type: "square" }, { frequency: 245, offset: 0.085, duration: 0.065, type: "square" }] },
      fox: { volume: 0.23, notes: [{ frequency: 980, offset: 0, duration: 0.038, type: "triangle", slideTo: 1320 }, { frequency: 740, offset: 0.058, duration: 0.046, type: "triangle", slideTo: 1120 }] },
      frog: { volume: 0.24, notes: [{ frequency: 190, offset: 0, duration: 0.085, type: "sawtooth", slideTo: 150 }, { frequency: 205, offset: 0.13, duration: 0.075, type: "sawtooth", slideTo: 165 }] },
      rabbit: { volume: 0.22, notes: [{ frequency: 520, offset: 0, duration: 0.032, type: "sine" }, { frequency: 740, offset: 0.054, duration: 0.032, type: "sine" }, { frequency: 1040, offset: 0.108, duration: 0.038, type: "sine" }] },
      turtle: { volume: 0.205, notes: [{ frequency: 310, offset: 0, duration: 0.13, type: "triangle" }, { frequency: 260, offset: 0.17, duration: 0.16, type: "triangle" }] },
      moth: { volume: 0.17, notes: [{ frequency: 1180, offset: 0, duration: 0.026, type: "sine" }, { frequency: 1260, offset: 0.03, duration: 0.026, type: "sine" }, { frequency: 1140, offset: 0.06, duration: 0.026, type: "sine" }, { frequency: 1220, offset: 0.09, duration: 0.026, type: "sine" }] },
      whale: { volume: 0.21, notes: [{ frequency: 430, offset: 0, duration: 0.18, type: "sine", slideTo: 260 }, { frequency: 540, offset: 0.2, duration: 0.16, type: "sine", slideTo: 330 }] }
    };

    collaboratorOrder.forEach((id, index) => {
      if (prototype === "playful") {
        collaborators[id].identity = animalEarcons[id];
      } else if (prototype === "paper") {
        collaborators[id].identity = {
          volume: 0.17,
          notes: [
            { frequency: 520 + index * 28, offset: 0, duration: 0.025, type: "triangle" },
            { frequency: 360 + index * 20, offset: 0.05, duration: 0.035, type: "sawtooth" },
            { frequency: 640 + index * 22, offset: 0.105, duration: 0.025, type: "triangle" }
          ],
          noises: [
            { offset: 0.018, duration: 0.032, volume: 0.05 },
            { offset: 0.08, duration: 0.045, volume: 0.04 }
          ]
        };
      } else {
        collaborators[id].identity = {
          volume: 0.16,
          notes: [
            { frequency: 420 + index * 55, offset: 0, duration: 0.045, type: "sine" },
            { frequency: 420 + index * 55, offset: 0.075, duration: 0.045, type: "sine" }
          ]
        };
      }
    });
  }

  function ensureAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function tone(frequency, start, duration, options = {}) {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
    oscillator.type = options.type || "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    if (options.slideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(options.slideTo, start + duration);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(options.volume || 0.05, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    connectOutput(gain, panner, start, options.pan || 0);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function noise(start, duration, options = {}) {
    if (!audioContext) return;
    const buffer = audioContext.createBuffer(1, Math.max(1, audioContext.sampleRate * duration), audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(options.frequency || 1700, start);
    gain.gain.setValueAtTime(options.volume || 0.04, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    connectOutput(gain, panner, start, options.pan || 0);
    source.start(start);
    source.stop(start + duration);
  }

  function connectOutput(node, panner, start, pan) {
    if (panner) {
      panner.pan.setValueAtTime(settings.panning ? pan : 0, start);
      node.connect(panner);
      panner.connect(audioContext.destination);
      return;
    }
    node.connect(audioContext.destination);
  }

  function playPattern(identity, start, options = {}) {
    identity.notes.forEach((note) => {
      tone(note.frequency, start + note.offset, note.duration, {
        type: note.type,
        volume: note.volume || identity.volume,
        slideTo: note.slideTo,
        pan: options.pan
      });
    });
    (identity.noises || []).forEach((item) => {
      noise(start + item.offset, item.duration, { volume: item.volume, pan: options.pan });
    });
  }

  function getCollaboratorSpatialOptions(collaborator) {
    const target = getCollaboratorTarget(collaborator);
    if (!target) return { pan: 0 };
    const rect = target.getBoundingClientRect();
    const xRatio = clamp((rect.left + rect.width / 2) / window.innerWidth, 0, 1);
    return { pan: clamp((xRatio - 0.5) * 2, -1, 1) * 0.82 };
  }

  function playEarcon(collaborator) {
    if (!settings.earcons) return;
    ensureAudio();
    playPattern(collaborator.identity, audioContext.currentTime + 0.02, getCollaboratorSpatialOptions(collaborator));
  }

  function playEditEarcon(collaborator, editType) {
    if (!settings.earcons) return;
    ensureAudio();
    const options = getCollaboratorSpatialOptions(collaborator);
    const now = audioContext.currentTime + 0.02;
    if (prototype === "functional") {
      const frequency = editType === "delete" ? 250 : 760;
      playPattern({ volume: 0.16, notes: [{ frequency, offset: 0, duration: 0.055, type: "sine" }] }, now, options);
      return;
    }
    playEarcon(collaborator);
  }

  function playInteractionEarcon() {
    if (!settings.earcons) return;
    ensureAudio();
    const now = audioContext.currentTime + 0.02;
    if (prototype === "paper") {
      noise(now, 0.06, { volume: 0.055, frequency: 2200 });
      tone(620, now + 0.045, 0.035, { type: "triangle", volume: 0.11 });
      return;
    }
    playPattern({ volume: 0.18, notes: [{ frequency: 520, offset: 0, duration: 0.04, type: "triangle" }, { frequency: 920, offset: 0.045, duration: 0.04, type: "sine" }] }, now);
  }

  function getAnimalSpeechProfile(collaborator) {
    return animalSpeechProfiles[collaborator.id] || {};
  }

  function shapePlayfulSpeech(collaborator, text) {
    if (!settings.prosody) return text;
    const profile = getAnimalSpeechProfile(collaborator);
    return `${profile.prefix || defaultProsody.prefix}${text} ${defaultProsody.suffix}`;
  }

  function stripProsodyCodes(message) {
    return message.replace(/‵v[bsfv]\d+/g, "").replace(/\s+/g, " ").trim();
  }

  function playfulJoinMessage(collaborator) {
    const profile = getAnimalSpeechProfile(collaborator);
    const location = sectionNames[collaborator.location.para];
    const locationPhrase = profile.locationLead ? `${profile.locationLead} ${location}` : location;
    return shapePlayfulSpeech(
      collaborator,
      `${collaborator.name} ${profile.joinVerb || "hopped into"} the document${profile.joinPunctuation || ","} ${locationPhrase}.`
    );
  }

  function playfulMoveMessage(collaborator) {
    const profile = getAnimalSpeechProfile(collaborator);
    return shapePlayfulSpeech(
      collaborator,
      `${collaborator.name} ${profile.moveVerb || "moved to"} ${sectionNames[collaborator.location.para]}.`
    );
  }

  function playfulNearbyMessage(collaborator) {
    const profile = getAnimalSpeechProfile(collaborator);
    return shapePlayfulSpeech(
      collaborator,
      `${collaborator.name} ${profile.nearbyVerb || "is close by in"} this paragraph.`
    );
  }

  function playfulSameLineMessage(collaborator) {
    return shapePlayfulSpeech(collaborator, `Same line, ${collaborator.name}.`);
  }

  function playfulAwayMessage(collaborator) {
    const profile = getAnimalSpeechProfile(collaborator);
    return shapePlayfulSpeech(
      collaborator,
      `${collaborator.name} ${profile.awayVerb || "moved away from"} this paragraph.`
    );
  }

  function playfulEditMessage(collaborator, editType, section) {
    const action = editType === "delete" ? "deleted text" : "added text";
    return shapePlayfulSpeech(collaborator, `${collaborator.name} ${action}, ${section}.`);
  }

  function speak(message) {
    if (!settings.speech) return;
    liveRegion.textContent = "";
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  }

  function addActivity(message) {
    if (!settings.activity) return;
    const item = document.createElement("li");
    const time = document.createElement("time");
    time.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
    item.append(time, document.createTextNode(stripProsodyCodes(message)));
    activityLog.append(item);
    while (activityLog.children.length > 8) {
      activityLog.removeChild(activityLog.firstElementChild);
    }
  }

  function enqueueAnnouncement(message, collaborator, eventType) {
    messageQueue.push({ message, collaborator, eventType });
    drainQueue();
  }

  function drainQueue() {
    if (queueBusy || messageQueue.length === 0) return;
    queueBusy = true;
    const item = messageQueue.shift();
    window.setTimeout(() => {
      if (parkingLotEnabled) {
        messageQueue.length = 0;
        queueBusy = false;
        return;
      }
      speak(item.message);
      addActivity(item.message);
      if (["join", "nearby", "userAway", "collabMoved", "leave"].includes(item.eventType)) {
        playEarcon(item.collaborator);
      }
      window.setTimeout(() => {
        queueBusy = false;
        drainQueue();
      }, 850);
    }, 180);
  }

  function getConfiguredCollaborators() {
    return collaboratorOrder.slice(0, settings.density).map((id) => collaborators[id]).filter(Boolean);
  }

  function getVisibleCollaborators() {
    if (parkingLotEnabled) return Object.values(collaborators);
    return getConfiguredCollaborators().filter((collaborator) => collaborator.status === "present");
  }

  function getCollaboratorTarget(collaborator) {
    return parkingLotEnabled
      ? editor.querySelector(`[data-parking-slot="${collaborator.id}"]`)
      : editor.querySelector(`[data-line="${collaborator.location.line}"]`);
  }

  function getCollaboratorsInDocumentOrder() {
    return getVisibleCollaborators()
      .map((collaborator) => {
        const target = getCollaboratorTarget(collaborator);
        if (!target) return null;
        const rect = target.getBoundingClientRect();
        return { collaborator, left: rect.left, top: rect.top };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(a.top - b.top) > 4 ? a.top - b.top : a.left - b.left)
      .map((item) => item.collaborator);
  }

  function playCursorSequence() {
    if (!settings.earcons) return;
    ensureAudio();
    const start = audioContext.currentTime + 0.03;
    getCollaboratorsInDocumentOrder().forEach((collaborator, index) => {
      playPattern(collaborator.identity, start + index * 0.42, getCollaboratorSpatialOptions(collaborator));
    });
  }

  function setDemoTimer(callback, delay) {
    const timerId = window.setTimeout(() => {
      const index = demoTimers.indexOf(timerId);
      if (index >= 0) demoTimers.splice(index, 1);
      callback();
    }, delay);
    demoTimers.push(timerId);
  }

  function stopDemo() {
    demoTimers.splice(0).forEach((timerId) => window.clearTimeout(timerId));
    messageQueue.length = 0;
    hasStarted = false;
    currentCursor = { para: null, line: null };
    Object.entries(originalLineText).forEach(([lineId, text]) => {
      const line = editor.querySelector(`[data-line="${lineId}"]`);
      if (line) line.textContent = text;
    });
    resetParkingSlots();
    Object.values(collaborators).forEach((collaborator) => {
      collaborator.location = { ...collaborator.initialLocation };
      collaborator.encountered = false;
      collaborator.moved = false;
      collaborator.editCount = 0;
      setPresence(collaborator, collaborator.initialStatus);
      previousProximity[collaborator.id] = { para: false, line: false };
    });
  }

  function startDemo() {
    if (hasStarted || parkingLotEnabled) return;
    hasStarted = true;
    ensureAudio();
    getConfiguredCollaborators().forEach((collaborator, index) => {
      if (index === 0 || collaborator.joinedAtStart) {
        setPresence(collaborator, "present");
        enqueueAnnouncement(joinMessage(collaborator), collaborator, "join");
      } else {
        setDemoTimer(() => joinCollaborator(collaborator), collaborator.joinDelay);
      }
      setDemoTimer(() => simulateCollaboratorEdit(collaborator, "insert"), collaborator.joinDelay + 3100);
      setDemoTimer(() => simulateCollaboratorEdit(collaborator, "delete"), collaborator.joinDelay + 11900);
      setDemoTimer(() => leaveCollaborator(collaborator), collaborator.leaveDelay);
    });
    updateCursors();
    evaluateCursorPosition();
  }

  function joinMessage(collaborator) {
    if (prototype === "playful") return playfulJoinMessage(collaborator);
    if (prototype === "paper") return `${collaborator.name} is writing in ${sectionNames[collaborator.location.para]}.`;
    return `${collaborator.name} joined, editing ${sectionNames[collaborator.location.para]}.`;
  }

  function getEditLine(collaborator) {
    return editor.querySelector(`[data-line="${collaborator.editPlan.line}"]`);
  }

  function getEditSection(collaborator) {
    return collaborator.editPlan.line.split("-")[0];
  }

  function simulateCollaboratorEdit(collaborator, editType) {
    if (parkingLotEnabled || collaborator.status !== "present" || !collaborator.editPlan) return;

    const line = getEditLine(collaborator);
    if (!line) return;

    const plan = collaborator.editPlan;
    if (editType === "delete" && line.textContent.includes(plan.deleteText)) {
      line.textContent = line.textContent.replace(plan.deleteText, "");
    } else if (editType === "insert" && !line.textContent.includes(plan.insertText)) {
      line.textContent = line.textContent.replace(plan.insertAfter, `${plan.insertAfter}${plan.insertText}`);
    } else {
      return;
    }

    collaborator.editCount += 1;
    const editedSection = sectionNames[getEditSection(collaborator)];
    const message = prototype === "playful"
      ? playfulEditMessage(collaborator, editType, editedSection)
      : editType === "delete"
        ? `${collaborator.name} deleted text in ${editedSection}.`
        : `${collaborator.name} added text in ${editedSection}.`;
    enqueueAnnouncement(message, collaborator, editType);
    playEditEarcon(collaborator, editType);
    updateCursors();
  }

  function setPresence(collaborator, status) {
    collaborator.status = status;
    const chip = document.querySelector(`[data-presence="${collaborator.id}"]`);
    if (!chip) return;
    chip.classList.toggle("is-waiting", status === "waiting");
    chip.classList.toggle("is-left", status === "left");
  }

  function joinCollaborator(collaborator) {
    if (parkingLotEnabled || collaborator.status !== "waiting") return;
    setPresence(collaborator, "present");
    enqueueAnnouncement(joinMessage(collaborator), collaborator, "join");
    updateCursors();
  }

  function leaveCollaborator(collaborator) {
    if (parkingLotEnabled || collaborator.status !== "present") return;
    setPresence(collaborator, "left");
    enqueueAnnouncement(`${collaborator.name} left the document.`, collaborator, "leave");
    updateCursors();
  }

  function scheduleMove(collaborator) {
    if (collaborator.encountered || collaborator.moved) return;
    collaborator.encountered = true;
    const originPara = collaborator.location.para;
    const oldPan = getCollaboratorSpatialOptions(collaborator).pan;
    setDemoTimer(() => {
      if (parkingLotEnabled || collaborator.status !== "present" || collaborator.moved) return;
      collaborator.location = { ...collaborator.moveTo };
      collaborator.moved = true;
      previousProximity[collaborator.id] = { para: false, line: false };
      updateCursors();
      if (settings.earcons && prototype !== "functional") {
        ensureAudio();
        const now = audioContext.currentTime + 0.02;
        playPattern(collaborator.identity, now, { pan: oldPan });
        playPattern(collaborator.identity, now + 0.24, getCollaboratorSpatialOptions(collaborator));
      }
      if (prototype === "functional" && settings.earcons) {
        playEarcon(collaborator);
      }
      if (currentCursor.para === originPara) {
        enqueueAnnouncement(
          prototype === "playful"
            ? playfulMoveMessage(collaborator)
            : `${collaborator.name} moved to ${sectionNames[collaborator.location.para]}.`,
          collaborator,
          "collabMoved"
        );
      }
    }, 8500);
  }

  function getCursorLocation() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return { para: null, line: null };
    let node = selection.anchorNode;
    if (!node) return { para: null, line: null };
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!editor.contains(node)) return { para: null, line: null };
    const paraElement = node.closest("[data-para]");
    const lineElement = node.closest("[data-line]");
    return {
      para: paraElement ? paraElement.dataset.para : null,
      line: lineElement ? lineElement.dataset.line : null
    };
  }

  function getParkingCollision() {
    if (!parkingLotEnabled) return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    let node = selection.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!editor.contains(node)) return null;

    if (parkingLot.contains(node)) {
      const slot = node.closest("[data-parking-slot]");
      if (slot) return slot.dataset.parkingSlot;
    }

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const caretRect = range.getBoundingClientRect();
    const parkingRect = parkingLot.getBoundingClientRect();
    const caretX = caretRect.left;
    const caretY = caretRect.top || parkingRect.top + parkingRect.height / 2;
    if (caretX === 0 && caretY === 0) return null;
    if (caretY < parkingRect.top - 4 || caretY > parkingRect.bottom + 4) return null;

    const parkedSlot = Array.from(parkingLot.querySelectorAll("[data-parking-slot]")).find((item) => {
      const rect = item.getBoundingClientRect();
      return caretX >= rect.left - 2 &&
        caretX <= rect.right + 2 &&
        caretY >= rect.top - 4 &&
        caretY <= rect.bottom + 4;
    });
    return parkedSlot ? parkedSlot.dataset.parkingSlot : null;
  }

  function evaluateParkingLotCollision() {
    const collaboratorId = getParkingCollision();
    if (!collaboratorId) {
      lastParkingCollision = null;
      return;
    }
    if (collaboratorId === lastParkingCollision) return;
    const collaborator = collaborators[collaboratorId];
    if (!collaborator) return;
    lastParkingCollision = collaboratorId;
    speak(`${collaborator.name}, cursor location.`);
    playInteractionEarcon();
    window.setTimeout(() => playEarcon(collaborator), 115);
  }

  function evaluateCursorPosition() {
    currentCursor = getCursorLocation();
    evaluateParkingLotCollision();
    if (parkingLotEnabled) return;
    getVisibleCollaborators().forEach((collaborator) => {
      const previous = previousProximity[collaborator.id];
      const samePara = currentCursor.para === collaborator.location.para;
      const sameLine = currentCursor.line === collaborator.location.line;
      if (samePara && !previous.para) {
        const message = prototype === "functional"
          ? `${collaborator.name} is editing nearby in this paragraph.`
          : prototype === "paper"
            ? `${collaborator.name} has a mark in this paragraph.`
            : playfulNearbyMessage(collaborator);
        enqueueAnnouncement(message, collaborator, "nearby");
        scheduleMove(collaborator);
      }
      if (sameLine && !previous.line) {
        enqueueAnnouncement(
          prototype === "playful" ? playfulSameLineMessage(collaborator) : `Same line as ${collaborator.name}.`,
          collaborator,
          "sameLine"
        );
      }
      if (!samePara && previous.para) {
        enqueueAnnouncement(
          prototype === "playful" ? playfulAwayMessage(collaborator) : `Moved away from ${collaborator.name}.`,
          collaborator,
          "userAway"
        );
      }
      previous.para = samePara;
      previous.line = sameLine;
    });
  }

  function updateCursors() {
    cursorLayer.innerHTML = "";
    const pageWrap = document.querySelector(".page-wrap");
    if (!pageWrap) return;
    getVisibleCollaborators().forEach((collaborator) => {
      const target = getCollaboratorTarget(collaborator);
      if (!target) return;
      const pageRect = pageWrap.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const cursor = document.createElement("div");
      const label = document.createElement("div");
      cursor.className = "collab-cursor";
      cursor.style.setProperty("--cursor-color", collaborator.color);
      cursor.style.left = `${targetRect.left - pageRect.left - 4}px`;
      cursor.style.top = `${targetRect.top - pageRect.top}px`;
      label.className = "collab-label";
      label.textContent = collaborator.name;
      cursor.append(label);
      cursorLayer.append(cursor);
    });
  }

  function describeLocation(collaborator) {
    return `${collaborator.name}, ${sectionNames[collaborator.location.para]}, ${collaborator.location.line.replace("-", " ")}`;
  }

  function announceActiveCollaborators() {
    const visible = getVisibleCollaborators();
    const message = visible.length
      ? `Active collaborators: ${visible.map(describeLocation).join("; ")}.`
      : "No active collaborators.";
    speak(message);
    addActivity(message);
  }

  function announceOverview() {
    const cursorSummary = getVisibleCollaborators().reduce((counts, collaborator) => {
      counts[collaborator.location.para] = (counts[collaborator.location.para] || 0) + 1;
      return counts;
    }, {});
    const parts = Object.keys(sectionNames).map((id) => {
      const counts = overviewCounts[id];
      return `${sectionNames[id]}: ${cursorSummary[id] || 0} cursors, ${counts.comments} comments, ${counts.edits} suggested edits`;
    });
    const lead = prototype === "paper" ? "Paper skim." : prototype === "playful" ? "Animal soundscape." : "Document overview.";
    speak(`${lead} ${parts.join(". ")}.`);
    addActivity(`${lead} ${parts.join(". ")}.`);
    playOverviewEarcons();
  }

  function playOverviewEarcons() {
    if (!settings.earcons) return;
    ensureAudio();
    const start = audioContext.currentTime + 0.02;
    Object.keys(sectionNames).forEach((id, index) => {
      const count = overviewCounts[id].comments + overviewCounts[id].edits + 1;
      if (prototype === "paper") {
        noise(start + index * 0.13, 0.045 + count * 0.006, { volume: 0.04, pan: -0.7 + index * 0.28 });
      } else {
        tone(300 + count * 95, start + index * 0.13, 0.05, { type: "sine", volume: 0.12, pan: -0.7 + index * 0.28 });
      }
    });
  }

  function jumpToNextCollaborator() {
    const visible = getCollaboratorsInDocumentOrder();
    if (visible.length === 0) {
      speak("No active collaborators to jump to.");
      return;
    }
    jumpIndex = (jumpIndex + 1) % visible.length;
    const collaborator = visible[jumpIndex];
    const target = getCollaboratorTarget(collaborator);
    if (target) {
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      editor.focus();
    }
    speak(`Jumped to ${describeLocation(collaborator)}.`);
    playEarcon(collaborator);
    updateCursors();
  }

  function toggleFollowMode() {
    if (followedCollaboratorId) {
      window.clearInterval(followTimer);
      followTimer = null;
      followedCollaboratorId = null;
      followButton.setAttribute("aria-pressed", "false");
      speak(prototype === "paper" ? "Tracing off." : "Follow mode off.");
      return;
    }
    const visible = getCollaboratorsInDocumentOrder();
    if (visible.length === 0) {
      speak("No active collaborator to follow.");
      return;
    }
    followedCollaboratorId = visible[0].id;
    followButton.setAttribute("aria-pressed", "true");
    speak(`Following ${describeLocation(visible[0])}.`);
    followTimer = window.setInterval(() => {
      const followed = collaborators[followedCollaboratorId];
      if (!followed || followed.status !== "present" || parkingLotEnabled) return;
      speak(`Live edits: ${describeLocation(followed)}.`);
      playEarcon(followed);
    }, 4200);
  }

  function setParkingLotEnabled(enabled) {
    if (enabled) stopDemo();
    parkingLotEnabled = enabled;
    lastParkingCollision = null;
    parkingLot.hidden = !enabled;
    parkingLotToggle.setAttribute("aria-pressed", String(enabled));
    updateCursors();
    evaluateCursorPosition();
  }

  function toggleSettingsMenu() {
    settingsMenu.open = !settingsMenu.open;
    if (settingsMenu.open) stopDemo();
    settingsMenu.querySelector("summary").focus();
  }

  function openHelpDialog() {
    stopDemo();
    if (helpDialog.showModal) {
      helpDialog.showModal();
    } else {
      helpDialog.setAttribute("open", "");
    }
    helpCloseButton.focus();
  }

  function closeHelpDialog() {
    if (helpDialog.close) {
      helpDialog.close();
    } else {
      helpDialog.removeAttribute("open");
    }
    helpButton.focus();
  }

  function syncSettings() {
    settings.speech = speechToggle.checked;
    settings.prosody = prosodyToggle.checked;
    settings.earcons = earconToggle.checked;
    settings.panning = panningToggle.checked;
    settings.activity = activityToggle.checked;
    settings.density = Number(densitySelect.value);
    activityPanel.classList.toggle("is-hidden", !settings.activity);
    stopDemo();
    updateCursors();
    if (parkingLotEnabled) evaluateCursorPosition();
  }

  function handleInteraction() {
    startDemo();
    window.setTimeout(evaluateCursorPosition, 0);
  }

  function handleShortcut(event) {
    if (!event.ctrlKey || event.altKey || !event.shiftKey || event.metaKey) return;

    const key = event.key.toLowerCase();
    const shortcutActions = {
      a: announceActiveCollaborators,
      c: playCursorSequence,
      f: toggleFollowMode,
      h: openHelpDialog,
      k: jumpToNextCollaborator,
      m: toggleSettingsMenu,
      v: announceOverview,
      p: () => setParkingLotEnabled(!parkingLotEnabled)
    };
    const action = shortcutActions[key];
    if (!action) return;

    event.preventDefault();
    action();
  }

  document.addEventListener("keydown", handleShortcut);
  settingsMenu.addEventListener("toggle", () => {
    if (settingsMenu.open) stopDemo();
  });
  [speechToggle, prosodyToggle, earconToggle, panningToggle, activityToggle, densitySelect].forEach((control) => {
    control.addEventListener("change", syncSettings);
  });
  replayCursors.addEventListener("click", playCursorSequence);
  overviewButton.addEventListener("click", announceOverview);
  activeListButton.addEventListener("click", announceActiveCollaborators);
  jumpButton.addEventListener("click", jumpToNextCollaborator);
  followButton.addEventListener("click", toggleFollowMode);
  helpButton.addEventListener("click", openHelpDialog);
  helpCloseButton.addEventListener("click", closeHelpDialog);
  helpDialog.querySelectorAll(".help-disclosure > button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
  editor.addEventListener("focus", handleInteraction);
  editor.addEventListener("keydown", handleInteraction);
  editor.addEventListener("keyup", evaluateCursorPosition);
  editor.addEventListener("mouseup", evaluateCursorPosition);
  editor.addEventListener("input", () => {
    window.setTimeout(() => {
      updateCursors();
      evaluateCursorPosition();
    }, 0);
  });
  parkingLotToggle.addEventListener("click", () => {
    setParkingLotEnabled(!parkingLotEnabled);
    editor.focus();
  });
  document.addEventListener("selectionchange", () => {
    if (document.activeElement === editor) evaluateCursorPosition();
  });
  window.addEventListener("resize", updateCursors);
  window.addEventListener("scroll", updateCursors, true);
  window.addEventListener("load", updateCursors);
  syncSettings();
})();
