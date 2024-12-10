let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts();
    updateCartUI();
  });

function renderProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; 

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productGrid.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const totalItems = document.getElementById("total-items");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = ""; 
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      total += item.price * item.quantity;
      count += item.quantity;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <p>${item.name}</p>
        <div>
          <button onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
        </div>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
    <button class="remove-btn" onclick="removeFromCart(${
      item.id
    })">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  totalItems.textContent = count;
  totalPrice.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

function updateCartItemQuantity(productId, increment) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += increment;
    if (item.quantity <= 0) removeFromCart(productId);
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.getElementById("cart-toggle").addEventListener("click", () => {
  document.getElementById("shopping-cart").classList.toggle("active");
});
