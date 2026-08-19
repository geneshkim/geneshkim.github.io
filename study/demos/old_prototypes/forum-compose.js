function updatePreview() {
  const community = document.querySelector("#community").value;
  const flair = document.querySelector("input[name='flair']:checked").value;
  const title = document.querySelector("#title").value.trim();
  const body = document.querySelector("#body").value.trim();
  document.querySelector("#previewMeta").textContent = `${community} · ${flair}`;
  document.querySelector("#previewTitle").textContent = title || "Untitled draft";
  document.querySelector("#previewBody").textContent = body || "Start typing to preview the post body.";
  document.querySelector("#warningPreview").hidden = !document.querySelector("#contentWarning").checked;
}

function setError(id, message) {
  const element = document.querySelector(id);
  element.textContent = message;
  element.hidden = !message;
}

document.querySelector("#postForm").addEventListener("input", updatePreview);
document.querySelector("#postForm").addEventListener("change", updatePreview);

document.querySelector("#postForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#title");
  const body = document.querySelector("#body");
  const titleValid = title.value.trim().length >= 8;
  const bodyValid = body.value.trim().length >= 20;
  setError("#titleError", titleValid ? "" : "Title must be at least 8 characters.");
  setError("#bodyError", bodyValid ? "" : "Body must be at least 20 characters.");

  if (!titleValid) {
    title.focus();
    announce("Title needs at least 8 characters.");
    return;
  }

  if (!bodyValid) {
    body.focus();
    announce("Body needs at least 20 characters.");
    return;
  }

  announce("Dummy forum post submitted. It will not be published anywhere.");
});

updatePreview();
