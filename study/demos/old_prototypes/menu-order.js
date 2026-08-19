const menuItems = {
  waffle: { name: "Moon Waffle Stack", expressive: "M'o'o'o'o'o'o'o'o'o'o'o'n W'a'a'a'a'a'a'a'f'f'f'f'f'f'f'f'f'le Stack", price: 8.5 },
  toast: { name: "Keyboard Toast Flight", expressive: "K'e'e'e'e'e'e'e'e'e'y'b'o'o'o'o'o'o'o'o'o'ard Toast Flight", price: 7.25 },
  wrap: { name: "Crispy Weather Wrap", expressive: "C'r'r'r'r'r'r'r'i'i'i'i'i'i'i'ispy W'e'e'e'e'e'e'e'e'e'ath'e'e'e'e'e'e'er Wrap", price: 10.75 },
  soup: { name: "Inbox Zero Soup", expressive: "I'i'i'i'i'i'i'i'nbox Z'e'e'e'e'e'e'e'e'e'ro S'o'o'o'o'o'o'o'o'o'up", price: 6.95 },
  tea: { name: "Foggy Spreadsheet Tea", expressive: "F'o'o'o'o'o'o'o'o'ggy Spr'e'e'e'e'e'e'e'e'adsheet T'e'e'e'e'e'e'e'ea", price: 4.25 },
  sparkle: { name: "Emergency Sparkle Water", expressive: "E'e'e'e'e'e'e'mer'r'r'r'r'r'r'gen'cy Sp'a'a'a'a'a'a'ar'r'r'r'r'r'kle W'a'a'a'a'a'a'ter'r'r'r'r'r'r", price: 3.8 }
};

const cart = new Map();

function renderCart() {
  const container = document.querySelector("#cartItems");
  const checkoutButton = document.querySelector("#checkoutButton");
  container.innerHTML = "";

  if (cart.size === 0) {
    container.innerHTML = '<p class="muted">No items yet.</p>';
    document.querySelector("#cartTotal").textContent = "$0.00";
    checkoutButton.disabled = true;
    return;
  }

  let total = 0;
  cart.forEach((quantity, id) => {
    const item = menuItems[id];
    total += item.price * quantity;
    const row = document.createElement("div");
    row.className = "inline";
    row.innerHTML = `
      <span>${item.name}, quantity ${quantity}</span>
      <button class="secondary" data-remove="${id}" data-label-plain="Remove one ${item.name}" data-label-expressive="Remove one ${item.expressive}" data-label-eci="‵vs90 Remove one ${item.expressive}">Remove</button>
    `;
    container.append(row);
  });

  document.querySelector("#cartTotal").textContent = money(total);
  checkoutButton.disabled = false;
  applySpeechMode(container);
}

document.addEventListener("click", (event) => {
  const addId = event.target.closest("[data-add]")?.getAttribute("data-add");
  const removeId = event.target.closest("[data-remove]")?.getAttribute("data-remove");

  if (addId) {
    cart.set(addId, (cart.get(addId) || 0) + 1);
    renderCart();
    announce(`Added ${menuItems[addId].name}. Cart now has ${Array.from(cart.values()).reduce((a, b) => a + b, 0)} items.`);
  }

  if (removeId) {
    const next = (cart.get(removeId) || 0) - 1;
    if (next > 0) cart.set(removeId, next);
    else cart.delete(removeId);
    renderCart();
    announce(`Removed one ${menuItems[removeId].name}.`);
  }
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  announce("Dummy checkout started. No real order will be placed.");
});
