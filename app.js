const WHATSAPP_NUMBER = "212600000000";

const products = [
  {
    id: "mini-usb",
    name: "Mini ventilateur USB",
    category: "portable",
    badge: "Best seller",
    description: "Format poche, batterie rechargeable, parfait pour trajet, bureau et vacances.",
    price: 89,
    oldPrice: 119,
    imagePosition: "15% center",
  },
  {
    id: "neck-cool",
    name: "Ventilateur de cou",
    category: "portable",
    badge: "Mains libres",
    description: "Leger, confortable et pratique pour marcher, travailler ou voyager.",
    price: 149,
    oldPrice: 189,
    imagePosition: "42% center",
  },
  {
    id: "desk-quiet",
    name: "Ventilateur bureau silencieux",
    category: "bureau",
    badge: "Silencieux",
    description: "Design compact, plusieurs vitesses, ideal pour chambre, bureau ou comptoir.",
    price: 129,
    oldPrice: 169,
    imagePosition: "68% center",
  },
  {
    id: "clip-fan",
    name: "Ventilateur clip portable",
    category: "bureau",
    badge: "Multi-usage",
    description: "Se fixe sur poussette, table, lit ou etagere avec rotation ajustable.",
    price: 139,
    oldPrice: 179,
    imagePosition: "84% center",
  },
  {
    id: "summer-duo",
    name: "Pack Duo Fraicheur",
    category: "pack",
    badge: "Pack",
    description: "Deux mini ventilateurs rechargeables pour vendre plus avec une offre simple.",
    price: 159,
    oldPrice: 238,
    imagePosition: "28% center",
  },
  {
    id: "family-pack",
    name: "Pack Famille",
    category: "pack",
    badge: "Economique",
    description: "Trois modeles differents pour maison, voiture et sorties d'ete.",
    price: 299,
    oldPrice: 397,
    imagePosition: "55% center",
  },
];

const cart = new Map();

const grid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector("#cart-drawer");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");

function money(value) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

function renderProducts(filter = "all") {
  const visibleProducts = filter === "all"
    ? products
    : products.filter((product) => product.category === filter);

  grid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual">
            <img src="assets/fan-products.png" alt="${product.name}" style="object-position: ${product.imagePosition}" />
            <span class="badge">${product.badge}</span>
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price-row">
              <span class="price">${money(product.price)}</span>
              <span class="old-price">${money(product.oldPrice)}</span>
            </div>
            <button class="add-button" type="button" data-add="${product.id}">Ajouter au panier</button>
          </div>
        </article>
      `
    )
    .join("");
}

function getCartItems() {
  return [...cart.entries()].map(([id, quantity]) => ({
    ...products.find((product) => product.id === id),
    quantity,
  }));
}

function renderCart() {
  const items = getCartItems();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = money(totalPrice);
  cartEmpty.classList.toggle("visible", items.length === 0);
  checkoutButton.disabled = items.length === 0;

  cartItems.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <span>${money(item.price)} x ${item.quantity}</span>
            <div class="qty" aria-label="Quantite ${item.name}">
              <button class="qty-button" type="button" data-dec="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="qty-button" type="button" data-inc="${item.id}">+</button>
            </div>
          </div>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  openCart();
}

function changeQuantity(id, delta) {
  const nextQuantity = (cart.get(id) || 0) + delta;
  if (nextQuantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, nextQuantity);
  }
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function checkout() {
  const items = getCartItems();
  if (!items.length) return;

  const lines = items.map((item) => `- ${item.name} x${item.quantity}: ${money(item.price * item.quantity)}`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = [
    "Bonjour FreshFan, je veux commander:",
    ...lines,
    `Total: ${money(total)}`,
    "Ville:",
    "Nom:",
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const incButton = event.target.closest("[data-inc]");
  const decButton = event.target.closest("[data-dec]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) addToCart(addButton.dataset.add);
  if (incButton) changeQuantity(incButton.dataset.inc, 1);
  if (decButton) changeQuantity(decButton.dataset.dec, -1);

  if (filterButton) {
    document.querySelectorAll(".filter").forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    renderProducts(filterButton.dataset.filter);
  }
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
checkoutButton.addEventListener("click", checkout);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
