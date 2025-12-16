document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  document.getElementById("productImg").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;

  const addBtn = document.getElementById("addToCartBtn");
  const qtyInput = document.getElementById("productQty");

  addBtn.onclick = () => {
    let qty = parseInt(qtyInput.value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find((p) => p.id === product.id);

    if (item) {
      item.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart ✓");
  };

  updateCartCount();
});
