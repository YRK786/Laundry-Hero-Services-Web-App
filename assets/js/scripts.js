let total = 0;
const cartList = document.querySelector(".added-items-list");
const bookBtn  = document.querySelector(".book-btn");
bookBtn.disabled = true;
function toggle(btn) {
  const card   = btn.closest(".service-item");
  const name   = card.dataset.name;
  const price  = +card.dataset.price;
  const adding = card.dataset.added !== "true";
  card.dataset.added = adding;
  document.querySelector(".cart-warning").style.display = "none";
  if (adding) {
    total += price;
    btn.innerText    = "Remove Item -";
    btn.style.cssText = "background:#ffe7eb;color:#ec4f76";
    document.querySelector(".no-items-added").style.display = "none";
    cartList.innerHTML += `<div class="added-row" data-name="${name}"><span></span><span>${name}</span><span>₹${price}</span></div>`;
  } else {
    total -= price;
    btn.innerText    = "Add Item +";
    btn.style.cssText = "";
    cartList.querySelector(`[data-name="${name}"]`).remove();
    if (!cartList.querySelector(".added-row")) document.querySelector(".no-items-added").style.display = "block";
  }
  document.querySelector(".total-amount").innerText = "₹" + total;
  cartList.querySelectorAll(".added-row").forEach((r, i) => r.children[0].innerText = i + 1);
  bookBtn.disabled = !cartList.querySelector(".added-row");
}
document.querySelectorAll(".book-form input").forEach(input => {
  input.onfocus = () => document.querySelector(".cart-warning").style.display = cartList.querySelector(".added-row") ? "none" : "block";
});

(function() {
  emailjs.init({
    publicKey: "QbvIcH_2A6Ogz3ACT",
  });
})();

window.onload = function() {
  document.querySelector(".book-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var name  = document.getElementById("fullName").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var orderDetails = "";
    var rows = cartList.querySelectorAll(".added-row");
    for (var i = 0; i < rows.length; i++) {
      orderDetails += rows[i].children[1].innerText + " - " + rows[i].children[2].innerText + "\n";
    }
    bookBtn.disabled = true;
    emailjs.send("service_g281vo5", "template_ktbz45d", {
      full_name:     name,
      user_email:    email,
      phone:         phone,
      order_details: orderDetails,
      total_amount:  "Rs. " + total
    }).then(() => {
      document.querySelector(".book-success").style.display = "block";
      document.querySelector(".book-form").reset();
      bookBtn.innerText = "Book now";
      cartList.innerHTML = "";
      total = 0;
      document.querySelector(".total-amount").innerText = "Rs. 0";
      document.querySelector(".no-items-added").style.display = "block";
      bookBtn.disabled = true;
      document.querySelectorAll(".service-item").forEach(card => {
        card.dataset.added = "false";
        var btn = card.querySelector(".service-btn");
        btn.innerText = "Add Item +";
        btn.style.cssText = "";
      });
    }).catch((error) => {
      console.log("FAILED...", error);
      alert("Something went wrong. Please try again.");
      bookBtn.disabled = false;
      bookBtn.innerText = "Book now";
    });
  });
}