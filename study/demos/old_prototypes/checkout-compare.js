const compareProducts = [
  { id: "calendar", name: "Calendar With Only Wednesdays", expressive: "C'a'a'a'a'a'al'e'e'e'e'endar With O'o'o'o'o'only W'e'e'e'e'e'dnesdays", price: 9.25, qty: 1, note: "Ships flat" },
  { id: "plant", name: "Office Plant Named Gerald", expressive: "O'o'o'o'o'office Plant Named G'e'e'e'e'er'r'r'r'ald", price: 18.4, qty: 1, note: "Needs indirect light" },
  { id: "stickers", name: "Tiny Stickers for Very Large Feelings", expressive: "T'i'i'i'i'iny Stick'e'e'e'e'ers for V'e'e'e'e'ery L'a'a'a'a'arge F'e'e'e'e'el'i'i'i'i'ings", price: 6.3, qty: 3, note: "Envelope delivery" }
];

const compareDelivery = { slow: 0, steady: 5.99, fast: 14.99 };

function renderCompareRows() {
  const body = document.querySelector("#compareRows");
  body.innerHTML = "";
  compareProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${product.name}</th>
      <td>${money(product.price)}</td>
      <td>
        <div class="inline">
          <button class="secondary" data-dec="${product.id}" data-label-plain="Decrease quantity for ${product.name}" data-label-expressive="Decrease quantity for ${product.expressive}" data-label-eci="‵vs92 Decrease quantity for ${product.expressive}">-</button>
          <span id="qty-${product.id}">${product.qty}</span>
          <button class="secondary" data-inc="${product.id}" data-label-plain="Increase quantity for ${product.name}" data-label-expressive="Increase quantity for ${product.expressive}" data-label-eci="‵vs92 Increase quantity for ${product.expressive}">+</button>
        </div>
      </td>
      <td>${product.note}</td>
    `;
    body.append(row);
  });
  applySpeechMode(body);
}

function updateCompareSummary() {
  const items = compareProducts.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = compareDelivery[document.querySelector("#deliverySelect").value];
  const totalItems = compareProducts.reduce((sum, item) => sum + item.qty, 0);
  const total = items + delivery;
  document.querySelector("#compareSummary").textContent = `${totalItems} items. Products ${money(items)}. Delivery ${money(delivery)}. Total ${money(total)}.`;
  return total;
}

document.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]")?.getAttribute("data-inc");
  const dec = event.target.closest("[data-dec]")?.getAttribute("data-dec");
  const id = inc || dec;
  if (!id) return;
  const product = compareProducts.find((item) => item.id === id);
  product.qty = inc ? product.qty + 1 : Math.max(0, product.qty - 1);
  document.querySelector(`#qty-${id}`).textContent = product.qty;
  const total = updateCompareSummary();
  announce(`${product.name} quantity is now ${product.qty}. Comparison total is ${money(total)}.`);
});

document.querySelector("#deliverySelect").addEventListener("change", () => {
  const total = updateCompareSummary();
  announce(`Delivery preference changed. Comparison total is ${money(total)}.`);
});

document.querySelector("#confirmCompare").addEventListener("click", () => {
  announce("Dummy comparison checkout confirmed.");
});

renderCompareRows();
updateCompareSummary();
