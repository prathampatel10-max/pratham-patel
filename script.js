let cart = [];
let total = 0;
let discountApplied = false;
let discountedTotal = 0;

function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  updateCart();
}

function updateCart() {
  let cartList = document.getElementById("cart-items");
  if (!cartList) return;
  cartList.innerHTML = "";

  let productList = [];
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item.name + " - ₹" + item.price;
    cartList.appendChild(li);
    productList.push(item.name);
  });

  // Show totals
  document.getElementById("cart-total").textContent = total.toLocaleString("en-IN");

  if (discountApplied) {
    document.getElementById("discounted-total").textContent = discountedTotal.toLocaleString("en-IN");
    document.getElementById("discounted-row").style.display = "block";
  } else {
    document.getElementById("discounted-row").style.display = "none";
  }

  // Fill hidden fields for Formspree checkout
  const productField = document.getElementById("productField");
  const totalField = document.getElementById("totalField");
  if (productField && totalField) {
    productField.value = productList.join(", ");
    totalField.value = discountApplied ? discountedTotal : total;
  }
}

function applyCoupon() {
  const code = document.getElementById("coupon-code").value.trim();
  if (code === "prajay20" && !discountApplied) {
    const discount = total * 0.20;
    discountedTotal = total - discount;
    discountApplied = true;
    alert("Coupon applied! You saved 20% as a first-time user.");
    updateCart();
  } else if (discountApplied) {
    alert("Coupon can only be used once by first-time users.");
  } else {
    alert("Invalid coupon code.");
  }
}

// Handle checkout form submission
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const form = event.target;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        document.getElementById("confirmationMessage").style.display = "block";
        form.reset();
        cart = [];
        total = 0;
        discountApplied = false;
        discountedTotal = 0;
        updateCart();
      } else {
        alert("There was a problem submitting your order.");
      }
    });
  });
}
