const scores = { "post-a": 128, "post-b": 84 };
const comments = [
  { id: 1, author: "u/stale_popcorn", score: 42, age: 2, text: "Medium-high is generous. This is an incident review with snacks.", reply: "u/meeting_mint: Please include remediation steps and an apology candle." },
  { id: 2, author: "u/lint_my_life", score: 18, age: 1, text: "The acceptance criteria should mention opening a window.", reply: "" },
  { id: 3, author: "u/cloudy_tupperware", score: 31, age: 4, text: "I maintain that leftovers deserve a changelog.", reply: "u/sprint_pickle: Version 2.0 added dill." }
];

function renderComments() {
  const sort = document.querySelector("#sortComments").value;
  const ordered = [...comments].sort((a, b) => {
    if (sort === "top") return b.score - a.score;
    if (sort === "new") return a.age - b.age;
    return b.age - a.age;
  });

  const container = document.querySelector("#comments");
  container.innerHTML = "";
  ordered.forEach((comment) => {
    const article = document.createElement("article");
    article.className = "comment";
    article.innerHTML = `
      <h4>${comment.author}</h4>
      <p>${comment.text}</p>
      <p class="muted">${comment.score} points, ${comment.age} hours ago</p>
      <button class="secondary" data-label-plain="Reply to ${comment.author}" data-label-expressive="R'e'e'e'e'e'ply to ${comment.author.replace("_", " underscore ")}" data-label-eci="‵vs92 R'e'e'e'e'e'ply to ${comment.author.replace("_", " underscore ")}">Reply</button>
      ${comment.reply ? `<div class="comment reply"><p>${comment.reply}</p></div>` : ""}
    `;
    container.append(article);
  });
  applySpeechMode(container);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vote]");
  if (!button) return;
  const id = button.getAttribute("data-vote");
  const direction = button.getAttribute("data-dir");
  scores[id] += direction === "up" ? 1 : -1;
  document.querySelector(`#score-${id}`).textContent = scores[id];
  announce(`${direction === "up" ? "Upvoted" : "Downvoted"}. Score is now ${scores[id]}.`);
});

document.querySelector("#sortComments").addEventListener("change", (event) => {
  renderComments();
  announce(`Comments sorted by ${event.target.options[event.target.selectedIndex].text}.`);
});

renderComments();
