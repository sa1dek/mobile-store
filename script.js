// ===================== NAVIGATION MENU =====================
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

// if (bar) {
//   bar.addEventListener("click", () => nav.classList.add("active"));
// }
// if (close) {
//   close.addEventListener("click", () => nav.classList.remove("active"));
// }

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
    document.getElementById("mobile").style.display = "none";
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
    document.getElementById("mobile").style.display = "flex";
  });
}

// ===================== CART INITIALIZATION =====================
let cart = [];
// ===================== PRODUCTS DATA =====================
const products = [
  { id: 1, name: "AirPods Pro", price: 249.99, image: "image/products/f1.jpg" },
  { id: 2, name: "Mouse Pro", price: 600.0, image: "image/products/f2.jpg" },
  { id: 3, name: "Wheel", price: 1600, image: "image/products/f3.jpg" },
  { id: 4, name: "HeadPhone", price: 100.0, image: "image/products/f4.jpg" },
  { id: 5, name: "caliphal", price: 129.99, image: "image/products/f5.jpg" },
  { id: 6, name: "AirPods", price: 120, image: "image/products/f6.jpg" },
  { id: 7, name: "Phone Cover", price: 70, image: "image/products/f7.jpg" },
  { id: 8, name: "Watch", price: 89.99, image: "image/products/f8.jpg" },
];

// ===================== UTILITY FUNCTIONS =====================
function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Failed to load cart:", error);
    cart = [];
  }
}

function showAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert-box";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 2000);
}

// ===================== PRODUCT FUNCTIONS =====================
function renderProducts() {
  const productsCont = document.getElementById("pro-container");
  if (!productsCont) return;

  const productsHTML = products
    .map(
      (product) => `
    <div class="pro">
      <img src="${product.image}" alt="${
        product.name
      }" class="product-image" onclick="openProduct(${product.id})" />
      <div class="des">
        <h5 class="product-name" onclick="openProduct(${product.id})">${
        product.name
      }</h5>
        <div class="star"></div>
        <h4>${Number(product.price).toFixed(2)}</h4>
      </div>
      <a href="#" class="cart" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${
        product.id
      })">
        <i class="fa-solid fa-cart-shopping"></i>
      </a>
    </div>
  `
    )
    .join("");

  productsCont.innerHTML = productsHTML;
}

function openProduct(id) {
  const selected = products.find((p) => p.id === id);
  if (!selected) return;
  try {
    localStorage.setItem("selectedProduct", JSON.stringify(selected));
    window.location.href = "sproduct.html";
  } catch (error) {
    console.error("Failed to save selected product:", error);
  }
}

// ===================== CART FUNCTIONS =====================
function addToCart(productId) {
  if (!productId || typeof productId !== "number") return;

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((p) => p.id === productId);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 0) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartBadge();
  saveCart();
  updateCartCount();
  showAlert("Product added to cart ✓");
  if (document.getElementById("cart-body")) renderCartItems();
}
// =====================| Render Cart Products |=====================
function renderCartItems() {
  const cartBody = document.getElementById("cart-body");
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Your cart is empty.</td></tr>`;
    updateCartTotals();
    return;
  }

  const cartHTML = cart
    .map((item) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      return `
      <tr>
        <td><i class="fa-solid fa-trash-can" onclick="removeFromCart(${
          item.id
        })" style="cursor:pointer"></i></td>
        <td><img src="${item.image}" alt="${
        item.name
      }" style="width:60px;height:auto;" /></td>
        <td>${item.name}</td>
        <td>${Number(item.price).toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${
            item.quantity
          }" onchange="changeQty(${item.id}, this.value)" />
        </td>
        <td>${itemTotal}</td>
      </tr>
    `;
    })
    .join("");

  cartBody.innerHTML = cartHTML;
  updateCartTotals();
}
// =====================|  |=====================
function changeQty(id, value) {
  const qty = parseInt(value, 10);
  if (isNaN(qty) || qty < 1) return;

  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.quantity = qty;
  saveCart();
  renderCartItems();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter((p) => p.id !== id);
  saveCart();
  renderCartItems();
  updateCartCount();
  showAlert("Item removed ×");
}
// =====================| Update Cart Counter & Total Price |=====================
function updateCartCount() {
  const cartBadge = document.getElementById("cart-badge");
  if (!cartBadge) return;

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartBadge.textContent = totalItems;
}

function updateCartTotals() {
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = subtotal.toFixed(2);
}

// =====================| CHECKOUT FUNCTIONS |=====================
function renderCheckoutTotals() {
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (!subtotalEl || !totalEl) return;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  subtotalEl.textContent = subtotal.toFixed(2);
  totalEl.textContent = subtotal.toFixed(2);
}

function checkout() {
  if (cart.length === 0) {
    showAlert("Your cart is empty!");
    return;
  }
  showAlert("Order placed successfully!");
  cart = [];
  saveCart();
  renderCartItems();
  updateCartCount();
  renderCheckoutTotals();
}
// =====================| SINGLE PRODUCT PAGE |=====================
function handleAddToCartFromProduct() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  const qtyInput = document.getElementById("productQty");
  const qty = parseInt(qtyInput?.value || 1, 10);
  if (isNaN(qty) || qty < 1) return;

  const existingItem = cart.find((p) => p.id === product.id);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  saveCart();
  updateCartCount();
  showAlert("Product added to cart ✓");
}
// =====================| Update Cart Counter |=====================
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;

  // Desktop badge
  const desktopBadge = document.getElementById("cart-badge");
  if (desktopBadge) desktopBadge.textContent = count;

  // Mobile badge
  const mobileBadge = document.getElementById("cart-badge-mobile");
  if (mobileBadge) mobileBadge.textContent = count;

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badges = document.querySelectorAll("#cart-badge");
  badges.forEach((badge) => {
    badge.textContent = totalQty;
  });
  // Desktop badge
  if (desktopBadge) desktopBadge.textContent = totalQty;

  // Mobile badge
  if (mobileBadge) mobileBadge.textContent = totalQty;
}

// =====================| SEND ORDER TO GOOGLE SHEETS |=====================
const scriptURL =
  "https://script.google.com/macros/s/AKfycbxgGo_ZRj8_e-m7OfdZcfO71sPJ1_R1GETKO9q0AUIv76T9VI9LS8zHzm97aaR2zT3v/exec";

function sendOrderToSheet() {
  console.log("sendOrderToSheet() called");
  loadCart();

  const name = document.querySelector("input[name='name']").value.trim();
  const phone = document.querySelector("input[name='phone']").value.trim();
  const email = document.querySelector("input[name='email']").value.trim();
  const message = document
    .querySelector("textarea[name='message']")
    .value.trim();

  if (!name || !phone || !email) {
    showAlert("من فضلك املأ البيانات المطلوبة");
    return;
  }

  if (!cart || cart.length === 0) {
    showAlert("سلة المشتريات فاضية!");
    return;
  }

  const cartDetails = cart.map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.quantity,
    price: Number(item.price).toFixed(2),
    lineTotal: (item.price * item.quantity).toFixed(2),
  }));

  const totalPrice = cartDetails
    .reduce((sum, it) => sum + parseFloat(it.lineTotal), 0)
    .toFixed(2);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("message", message);
  formData.append("cart", JSON.stringify(cartDetails));
  formData.append("total", totalPrice);

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      let text = "";
      try {
        text = await res.text();
      } catch {}

      console.log("Server response:", text);
      showAlert("تم إرسال الطلب بنجاح ✓");

      // مسح السلة
      cart = [];
      saveCart();
      updateCartCount();

      // مسح الفورم
      document.getElementById("contact-form").reset();

      // تحويل لصفحة الشكر
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 700);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      showAlert("حصل خطأ أثناء الإرسال!");
    });
}

// =====================| PAGE INITIALIZATION |=====================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  const sendOrderBtn = document.getElementById("sendOrder");
  if (sendOrderBtn) {
    sendOrderBtn.addEventListener("click", sendOrderToSheet);
  }
  updateCartCount();
  renderProducts();
  renderCartItems();
  renderCheckoutTotals();

  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", handleAddToCartFromProduct);
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
});
document.addEventListener("DOMContentLoaded", updateCartBadge);
// =====================| Connecting the contact section to Google Sheets |=====================
const contactScriptURL =
  "https://script.google.com/macros/s/AKfycbx8bpvSQmQNHXHFEgVYF8pKU5UcagB1BzUh8eLc45W1BuaF2XJZO4WgVhobF3GQXPJn2Q/exec";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (!form) {
    console.log("Contact form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(contactScriptURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((data) => {
        console.log("Server response:", data);
        alert("تم إرسال الرسالة بنجاح ✅");
        form.reset();
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("حصل خطأ أثناء الإرسال ❌");
      });
  });
});
