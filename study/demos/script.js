(function () {
  const editor = document.getElementById("editor");
  const cursorLayer = document.getElementById("cursorLayer");
  const liveRegion = document.getElementById("liveRegion");
  const activityLog = document.getElementById("activityLog");
  const parkingLot = document.getElementById("parkingLot");
  const parkingLotToggle = document.getElementById("parkingLotToggle");

  const sectionNames = {
    timeline: "Launch Timeline",
    feedback: "Customer Feedback",
    design: "Design Decisions",
    questions: "Open Questions",
    risks: "Risks",
    actions: "Action Items"
  };

  const spatialAudio = {
    maxPan: 0.82
  };

  const demoCollaboratorIds = ["octopus", "cardinal", "beaver"];

  const collaborators = {
    octopus: {
      id: "octopus",
      name: "Anonymous Octopus",
      color: "#7b61ff",
      status: "present",
      location: { para: "timeline", line: "timeline-b" },
      moveTo: { para: "risks", line: "risks-b" },
      joinedAtStart: true,
      joinDelay: 0,
      leaveDelay: 47000,
      identity: {
        volume: 0.315,
        notes: [
          { frequency: 690, offset: 0, duration: 0.045, type: "triangle" },
          { frequency: 830, offset: 0.042, duration: 0.045, type: "triangle" },
          { frequency: 720, offset: 0.084, duration: 0.05, type: "triangle" }
        ]
      }
    },
    cardinal: {
      id: "cardinal",
      name: "Anonymous Cardinal",
      color: "#d23f57",
      status: "waiting",
      location: { para: "design", line: "design-b" },
      moveTo: { para: "actions", line: "actions-a" },
      joinDelay: 7600,
      leaveDelay: 65000,
      identity: {
        volume: 0.306,
        notes: [
          { frequency: 1320, offset: 0, duration: 0.045, type: "sine" },
          { frequency: 1760, offset: 0.09, duration: 0.07, type: "sine" }
        ]
      }
    },
    beaver: {
      id: "beaver",
      name: "Anonymous Beaver",
      color: "#9b6a1f",
      status: "waiting",
      location: { para: "questions", line: "questions-b" },
      moveTo: { para: "feedback", line: "feedback-a" },
      joinDelay: 14500,
      leaveDelay: 83000,
      identity: {
        volume: 0.208,
        notes: [
          { frequency: 245, offset: 0, duration: 0.065, type: "square" },
          { frequency: 245, offset: 0.085, duration: 0.065, type: "square" }
        ]
      }
    },
    fox: {
      id: "fox",
      name: "Anonymous Fox",
      color: "#c85b2b",
      status: "waiting",
      location: { para: "feedback", line: "feedback-b" },
      moveTo: { para: "questions", line: "questions-a" },
      joinDelay: 21300,
      leaveDelay: 101000,
      identity: {
        volume: 0.23,
        notes: [
          { frequency: 980, offset: 0, duration: 0.038, type: "triangle", slideTo: 1320 },
          { frequency: 740, offset: 0.058, duration: 0.046, type: "triangle", slideTo: 1120 }
        ]
      }
    },
    frog: {
      id: "frog",
      name: "Anonymous Frog",
      color: "#3f8f4f",
      status: "waiting",
      location: { para: "risks", line: "risks-a" },
      moveTo: { para: "timeline", line: "timeline-a" },
      joinDelay: 28200,
      leaveDelay: 119000,
      identity: {
        volume: 0.24,
        notes: [
          { frequency: 190, offset: 0, duration: 0.085, type: "sawtooth", slideTo: 150 },
          { frequency: 205, offset: 0.13, duration: 0.075, type: "sawtooth", slideTo: 165 }
        ]
      }
    },
    rabbit: {
      id: "rabbit",
      name: "Anonymous Rabbit",
      color: "#b45b84",
      status: "waiting",
      location: { para: "actions", line: "actions-b" },
      moveTo: { para: "design", line: "design-a" },
      joinDelay: 35100,
      leaveDelay: 137000,
      identity: {
        volume: 0.22,
        notes: [
          { frequency: 520, offset: 0, duration: 0.032, type: "sine" },
          { frequency: 740, offset: 0.054, duration: 0.032, type: "sine" },
          { frequency: 1040, offset: 0.108, duration: 0.038, type: "sine" }
        ]
      }
    },
    turtle: {
      id: "turtle",
      name: "Anonymous Turtle",
      color: "#607f3f",
      status: "waiting",
      location: { para: "timeline", line: "timeline-a" },
      moveTo: { para: "risks", line: "risks-a" },
      joinDelay: 42400,
      leaveDelay: 155000,
      identity: {
        volume: 0.205,
        notes: [
          { frequency: 310, offset: 0, duration: 0.13, type: "triangle" },
          { frequency: 260, offset: 0.17, duration: 0.16, type: "triangle" }
        ]
      }
    },
    moth: {
      id: "moth",
      name: "Anonymous Moth",
      color: "#7f6a9d",
      status: "waiting",
      location: { para: "design", line: "design-a" },
      moveTo: { para: "feedback", line: "feedback-b" },
      joinDelay: 49600,
      leaveDelay: 173000,
      identity: {
        volume: 0.17,
        notes: [
          { frequency: 1180, offset: 0, duration: 0.026, type: "sine" },
          { frequency: 1260, offset: 0.03, duration: 0.026, type: "sine" },
          { frequency: 1140, offset: 0.06, duration: 0.026, type: "sine" },
          { frequency: 1220, offset: 0.09, duration: 0.026, type: "sine" }
        ]
      }
    },
    whale: {
      id: "whale",
      name: "Anonymous Whale",
      color: "#2f7f9f",
      status: "waiting",
      location: { para: "questions", line: "questions-a" },
      moveTo: { para: "actions", line: "actions-b" },
      joinDelay: 56800,
      leaveDelay: 191000,
      identity: {
        volume: 0.21,
        notes: [
          { frequency: 430, offset: 0, duration: 0.18, type: "sine", slideTo: 260 },
          { frequency: 540, offset: 0.2, duration: 0.16, type: "sine", slideTo: 330 }
        ]
      }
    }
  };

  let audioContext;
  let hasStarted = false;
  let currentCursor = { para: null, line: null };
  let parkingLotEnabled = false;
  let lastParkingCollision = null;
  const demoTimers = [];
  const previousProximity = {};
  const messageQueue = [];
  let queueBusy = false;

  Object.values(collaborators).forEach((collaborator) => {
    previousProximity[collaborator.id] = { para: false, line: false };
    collaborator.initialStatus = collaborator.status;
    collaborator.initialLocation = { ...collaborator.location };
  });

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
    const type = options.type || "sine";
    const volume = options.volume || 0.045;
    const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (options.slideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(options.slideTo, start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    let outputNode = gain;

    if (panner) {
      panner.pan.setValueAtTime(options.pan || 0, start);
      outputNode.connect(panner);
      outputNode = panner;
    }

    outputNode.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function playPattern(pattern, start, defaults = {}) {
    pattern.forEach((note) => {
      tone(note.frequency, start + note.offset, note.duration, {
        type: note.type || defaults.type,
        volume: note.volume || defaults.volume,
        slideTo: note.slideTo,
        pan: defaults.pan
      });
    });
  }

  function getTargetSpatialPosition(target) {
    if (!target) return null;

    const rect = target.getBoundingClientRect();
    const xRatio = clamp((rect.left + rect.width / 2) / window.innerWidth, 0, 1);

    return { xRatio };
  }

  function getPanFromPosition(position) {
    if (!position) return 0;
    return clamp((position.xRatio - 0.5) * 2, -1, 1) * spatialAudio.maxPan;
  }

  function getCollaboratorSpatialOptions(collaborator) {
    const target = getCollaboratorTarget(collaborator);
    const position = getTargetSpatialPosition(target);

    return {
      pan: getPanFromPosition(position)
    };
  }

  function playEarcon(collaborator, spatialOptions = getCollaboratorSpatialOptions(collaborator)) {
    ensureAudio();
    if (!audioContext) return;

    const now = audioContext.currentTime + 0.02;

    playPattern(collaborator.identity.notes, now, {
      volume: collaborator.identity.volume,
      ...spatialOptions
    });
  }

  function getCollaboratorTarget(collaborator) {
    if (!parkingLotEnabled && collaborator.status !== "present") return null;

    return parkingLotEnabled
      ? editor.querySelector(`[data-parking-slot="${collaborator.id}"]`)
      : editor.querySelector(`[data-line="${collaborator.location.line}"]`);
  }

  function getVisibleCollaborators() {
    if (parkingLotEnabled) {
      return Object.values(collaborators);
    }

    return demoCollaboratorIds.map((id) => collaborators[id]).filter((collaborator) => {
      return collaborator && collaborator.status === "present";
    });
  }

  function getCollaboratorsInDocumentOrder() {
    return getVisibleCollaborators()
      .map((collaborator) => {
        const target = getCollaboratorTarget(collaborator);
        if (!target) return null;

        const rect = target.getBoundingClientRect();
        return {
          collaborator,
          left: rect.left,
          top: rect.top
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const rowDelta = a.top - b.top;
        if (Math.abs(rowDelta) > 4) return rowDelta;
        return a.left - b.left;
      })
      .map((item) => item.collaborator);
  }

  function playCursorSequence() {
    ensureAudio();
    if (!audioContext) return;

    const orderedCollaborators = getCollaboratorsInDocumentOrder();
    const start = audioContext.currentTime + 0.03;

    orderedCollaborators.forEach((collaborator, index) => {
      playPattern(collaborator.identity.notes, start + index * 0.42, {
        volume: collaborator.identity.volume,
        ...getCollaboratorSpatialOptions(collaborator)
      });
    });
  }

  function playInteractionEarcon() {
    ensureAudio();
    if (!audioContext) return;

    const now = audioContext.currentTime + 0.02;
    playPattern(
      [
        { frequency: 520, offset: 0, duration: 0.04, type: "triangle" },
        { frequency: 920, offset: 0.045, duration: 0.04, type: "sine" },
        { frequency: 1360, offset: 0.09, duration: 0.05, type: "triangle" }
      ],
      now,
      { volume: 0.22 }
    );
  }

  function shouldPlayEarcon(eventType) {
    return ["join", "nearby", "userAway", "collabMoved", "leave"].includes(eventType);
  }

  function enqueueAnnouncement(message, collaborator, eventType) {
    messageQueue.push({ message, collaborator, eventType });
    drainQueue();
  }

  function drainQueue() {
    if (queueBusy || messageQueue.length === 0) return;

    queueBusy = true;
    const item = messageQueue.shift();
    liveRegion.textContent = "";

    window.setTimeout(() => {
      if (parkingLotEnabled) {
        messageQueue.length = 0;
        queueBusy = false;
        return;
      }

      liveRegion.textContent = item.message;
      addActivity(item.message);
      if (shouldPlayEarcon(item.eventType)) {
        playEarcon(item.collaborator);
      }

      window.setTimeout(() => {
        queueBusy = false;
        drainQueue();
      }, 850);
    }, 180);
  }

  function addActivity(message) {
    const item = document.createElement("li");
    const time = document.createElement("time");
    time.textContent = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
    item.append(time, document.createTextNode(message));
    activityLog.append(item);

    while (activityLog.children.length > 8) {
      activityLog.removeChild(activityLog.firstElementChild);
    }
  }

  function announceParkingCollision(collaborator) {
    const message = collaborator.name;

    liveRegion.textContent = "";
    window.setTimeout(() => {
      if (!parkingLotEnabled || lastParkingCollision !== collaborator.id) return;
      liveRegion.textContent = message;
    }, 30);
  }

  function setDemoTimer(callback, delay) {
    const timerId = window.setTimeout(() => {
      const timerIndex = demoTimers.indexOf(timerId);
      if (timerIndex >= 0) {
        demoTimers.splice(timerIndex, 1);
      }
      callback();
    }, delay);

    demoTimers.push(timerId);
  }

  function stopDemo() {
    demoTimers.splice(0).forEach((timerId) => window.clearTimeout(timerId));
    messageQueue.length = 0;
    liveRegion.textContent = "";
    hasStarted = false;
    currentCursor = { para: null, line: null };
    demoCollaboratorIds.forEach((collaboratorId) => {
      const collaborator = collaborators[collaboratorId];
      if (!collaborator) return;

      collaborator.location = { ...collaborator.initialLocation };
      collaborator.encountered = false;
      collaborator.moved = false;
      setPresence(collaborator, collaborator.initialStatus);
      previousProximity[collaborator.id] = { para: false, line: false };
    });
  }

  function startDemo() {
    if (hasStarted || parkingLotEnabled) return;
    hasStarted = true;
    ensureAudio();

    const octopus = collaborators.octopus;
    setPresence(octopus, "present");
    enqueueAnnouncement(`${octopus.name} is already here, editing ${sectionNames[octopus.location.para]}.`, octopus, "join");

    demoCollaboratorIds.forEach((collaboratorId) => {
      const collaborator = collaborators[collaboratorId];
      if (!collaborator) return;

      if (!collaborator.joinedAtStart) {
        setDemoTimer(() => joinCollaborator(collaborator), collaborator.joinDelay);
      }

      setDemoTimer(() => leaveCollaborator(collaborator), collaborator.leaveDelay);
    });

    updateCursors();
    evaluateCursorPosition();
  }

  function setPresence(collaborator, status) {
    collaborator.status = status;
    const chip = document.querySelector(`[data-presence="${collaborator.id}"]`);
    if (!chip) return;

    chip.classList.toggle("is-waiting", status === "waiting");
    chip.classList.toggle("is-left", status === "left");
  }

  function joinCollaborator(collaborator) {
    if (parkingLotEnabled) return;
    if (collaborator.status !== "waiting") return;
    setPresence(collaborator, "present");
    enqueueAnnouncement(`${collaborator.name} joined the document.`, collaborator, "join");
    updateCursors();
    evaluateCursorPosition();
  }

  function leaveCollaborator(collaborator) {
    if (parkingLotEnabled) return;
    if (collaborator.status !== "present") return;
    setPresence(collaborator, "left");
    previousProximity[collaborator.id] = { para: false, line: false };
    enqueueAnnouncement(`${collaborator.name} left the document.`, collaborator, "leave");
    updateCursors();
  }

  function scheduleMove(collaborator) {
    if (collaborator.encountered || collaborator.moved) return;

    collaborator.encountered = true;
    const originPara = collaborator.location.para;

    setDemoTimer(() => {
      if (parkingLotEnabled || collaborator.status !== "present" || collaborator.moved) return;

      const userStillNearby = currentCursor.para === originPara;
      collaborator.location = { ...collaborator.moveTo };
      collaborator.moved = true;
      previousProximity[collaborator.id] = { para: false, line: false };
      updateCursors();

      if (userStillNearby) {
        enqueueAnnouncement(
          `${collaborator.name} moved to ${sectionNames[collaborator.location.para]}.`,
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
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    if (!editor.contains(node)) {
      return { para: null, line: null };
    }

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
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    if (!parkingLot.contains(node)) return null;

    const slot = node.closest("[data-parking-slot]");
    return slot ? slot.dataset.parkingSlot : null;
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
    announceParkingCollision(collaborator);
    playInteractionEarcon();
    window.setTimeout(() => playEarcon(collaborator), 115);
  }

  function evaluateCursorPosition() {
    currentCursor = getCursorLocation();
    evaluateParkingLotCollision();
    if (parkingLotEnabled) return;

    getVisibleCollaborators().forEach((collaborator) => {
      if (collaborator.status !== "present") return;

      const previous = previousProximity[collaborator.id];
      const samePara = currentCursor.para === collaborator.location.para;
      const sameLine = currentCursor.line === collaborator.location.line;

      if (samePara && !previous.para) {
        enqueueAnnouncement(
          `${collaborator.name} is editing nearby in this paragraph.`,
          collaborator,
          "nearby"
        );
        scheduleMove(collaborator);
      }

      if (sameLine && !previous.line) {
        enqueueAnnouncement(`You're on the same line as ${collaborator.name}.`, collaborator, "sameLine");
      }

      if (!samePara && previous.para) {
        enqueueAnnouncement(`You moved away from ${collaborator.name}.`, collaborator, "userAway");
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

  function setParkingLotEnabled(enabled) {
    if (enabled) {
      stopDemo();
    }

    parkingLotEnabled = enabled;
    lastParkingCollision = null;
    parkingLot.hidden = !enabled;
    parkingLotToggle.setAttribute("aria-pressed", String(enabled));
    updateCursors();
    evaluateCursorPosition();
  }

  function handleInteraction() {
    startDemo();
    window.setTimeout(evaluateCursorPosition, 0);
  }

  function handleShortcut(event) {
    if (!event.ctrlKey || !event.altKey || event.shiftKey || event.metaKey) return;
    if (event.key.toLowerCase() !== "c") return;

    event.preventDefault();
    playCursorSequence();
  }

  document.addEventListener("keydown", handleShortcut);
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
    if (document.activeElement === editor) {
      evaluateCursorPosition();
    }
  });

  window.addEventListener("resize", updateCursors);
  window.addEventListener("scroll", updateCursors, true);
  window.addEventListener("load", updateCursors);
})();
