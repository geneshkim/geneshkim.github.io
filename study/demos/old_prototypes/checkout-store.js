const checkoutProducts = [
  { id: "cable", name: "Thirty Foot Charging Cable for a Six Inch Desk", price: 11.99, qty: 1 },
  { id: "mug", name: "Mug That Says Meeting Survivor", price: 14.5, qty: 2 },
  { id: "lamp", name: "Desk Lamp With Suspicious Confidence", price: 32.75, qty: 1 }
];

const deliveryPrices = { free: 0, fast: 7.99, dramatic: 12.49 };

function renderCheckoutProducts() {
  const container = document.querySelector("#checkoutProducts");
  container.innerHTML = "";
  checkoutProducts.forEach((product) => {
    const row = document.createElement("article");
    row.className = "card";
    row.innerHTML = `
      <h3>${product.name}</h3>
      <p>${money(product.price)} each</p>
      <label>Quantity
        <input data-quantity="${product.id}" type="number" min="0" max="9" value="${product.qty}" aria-label="Quantity for ${product.name}">
      </label>
    `;
    container.append(row);
  });
}

function updateTotals() {
  const items = checkoutProducts.reduce((sum, product) => sum + product.price * product.qty, 0);
  const delivery = deliveryPrices[document.querySelector("input[name='delivery']:checked").value];
  const tax = (items + delivery) * 0.0825;
  const total = items + delivery + tax;
  document.querySelector("#itemsTotal").textContent = money(items);
  document.querySelector("#deliveryTotal").textContent = money(delivery);
  document.querySelector("#taxTotal").textContent = money(tax);
  document.querySelector("#orderTotal").textContent = money(total);
  return total;
}

document.addEventListener("input", (event) => {
  const id = event.target.getAttribute("data-quantity");
  if (!id) return;
  const product = checkoutProducts.find((item) => item.id === id);
  product.qty = Number(event.target.value);
  const total = updateTotals();
  announce(`Quantity updated. Current order total is ${money(total)}.`);
});

document.addEventListener("change", (event) => {
  if (event.target.name !== "delivery") return;
  const total = updateTotals();
  announce(`Delivery option changed. Current order total is ${money(total)}.`);
});

document.querySelector("#placeOrder").addEventListener("click", () => {
  announce("Dummy order placed. Confirmation number is pretend 2048.");
});

renderCheckoutProducts();
updateTotals();
