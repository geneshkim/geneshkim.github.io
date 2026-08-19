const speechState = {
  enhanced: false,
  eci: false
};

function getSpeechPrefix() {
  if (!speechState.enhanced) return "";
  return speechState.eci ? "‵vv70 ‵vs85 " : "";
}

function applySpeechMode(root = document) {
  root.querySelectorAll("[data-label-plain]").forEach((element) => {
    const plain = element.getAttribute("data-label-plain");
    const expressive = element.getAttribute("data-label-expressive") || plain;
    const eci = element.getAttribute("data-label-eci") || expressive;
    const chosen = speechState.enhanced
      ? speechState.eci
        ? eci
        : expressive
      : plain;
    element.setAttribute("aria-label", chosen);
  });
}

function setupSpeechControls() {
  const enhanced = document.querySelector("#enhancedSpeech");
  const eci = document.querySelector("#eciSpeech");
  if (!enhanced) return;

  const update = () => {
    speechState.enhanced = Boolean(enhanced.checked);
    speechState.eci = Boolean(eci && eci.checked);
    if (eci) eci.disabled = !speechState.enhanced;
    applySpeechMode(document);
    announce(
      speechState.enhanced
        ? speechState.eci
          ? "Eloquence command examples are enabled for selected labels."
          : "Expressive pronunciation labels are enabled."
        : "Plain screen reader labels are enabled."
    );
  };

  enhanced.addEventListener("change", update);
  if (eci) eci.addEventListener("change", update);
  update();
}

function announce(message) {
  const region = document.querySelector("[data-live-region]");
  if (!region) return;
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = getSpeechPrefix() + message;
  }, 20);
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

window.addEventListener("DOMContentLoaded", setupSpeechControls);
