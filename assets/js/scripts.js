// Cart array to store added items
let cart = [];
// Initialize EmailJS
emailjs.init({ publicKey: "QbvIcH_2A6Ogz3ACT" });
// Function to send email
function sendEmail(data) {
  return emailjs.send('service_g281vo5', 'template_ktbz45d', {
    full_name: data.name,
    user_email: data.email,
    phone: data.phone,
    order_details: data.orderDetails,
    total_amount: `${data.total}`
  });
}
// Book form submission
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.querySelector(".book-form");
  const bookName = document.getElementById("name");
  const bookEmail = document.getElementById("email");
  const bookPhone = document.getElementById("phone");
  const bookErrors = bookForm.querySelectorAll(".field-error");
  const inputs = bookForm.querySelectorAll("input");
  const message = document.querySelector(".show-message");
  const bookNowButton = document.querySelector(".book-button");
  const noItemsDiv = document.querySelector(".no-items-added");
  const addedItemsList = document.querySelector(".added-items-list");
  const totalAmountSpan = document.querySelector(".total-amount");
  // Show message when clicking inputs without items in cart
  inputs.forEach((input) => {
    input.addEventListener("click", () => {
      if (cart.length === 0) {
        message.style.display = "block";
        message.style.color = "red";
        message.innerHTML = `Add items to cart first!`;
        setTimeout(() => {
          message.style.display = "none";
        }, 3000);
      }
    });
  });
  // Handle Add/Remove Item button clicks
  const serviceButtons = document.querySelectorAll(".service-item .service-button");
  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceItem = button.closest(".service-item");
      const serviceName = serviceItem.getAttribute("data-name");
      const servicePrice = parseFloat(serviceItem.getAttribute("data-price"));
      // Check if item is already in cart
      const existingItemIndex = cart.findIndex((item) => item.name === serviceName);
      if (existingItemIndex === -1) {
        // Add item to cart
        cart.push({ name: serviceName, price: servicePrice });
        button.textContent = "Remove Item -";
        button.classList.add("remove-item");
      } else {
        // Remove item from cart
        cart.splice(existingItemIndex, 1);
        button.textContent = "Add Item +";
        button.classList.remove("remove-item");
      }
      updateCart();
    });
  });
  // Function to update cart display
  function updateCart() {
    if (cart.length === 0) {
      noItemsDiv.style.display = "block";
      addedItemsList.innerHTML = "";
      totalAmountSpan.textContent = "₹0.00";
      bookNowButton.disabled = true;
    } else {
      noItemsDiv.style.display = "none";
      bookNowButton.disabled = false;
      let cartHTML = "";
      let total = 0;
      cart.forEach((item, index) => {
        cartHTML += `<div class="added-item-row">
          <span>${index + 1}</span>
          <span>${item.name}</span>
          <span>₹${item.price.toFixed(2)}</span>
        </div>`;
        total += item.price;
      });
      addedItemsList.innerHTML = cartHTML;
      totalAmountSpan.textContent = `₹${total.toFixed(2)}`;
    }
  }
  // Book form submission
  bookForm.onsubmit = (e) => {
    e.preventDefault();
    bookErrors.forEach((error) => (error.innerText = ""));
    if (!bookName.value.trim()) {
      bookErrors[0].innerText = "Enter Name";
      return;
    } else if (!bookEmail.value.includes("@")) {
      bookErrors[1].innerText = "Enter valid email";
      return;
    } else if (bookPhone.value.length !== 10 || isNaN(bookPhone.value)) {
      bookErrors[2].innerText = "Enter 10 digit phone number";
      return;
    } else {
      // Send email
      const orderDetails = cart.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price.toFixed(2)}`).join('\n');
      const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
      sendEmail({
        name: bookName.value.trim(),
        email: bookEmail.value.trim(),
        phone: bookPhone.value.trim(),
        orderDetails,
        total: `₹${total}`
      });
      // Reset form
      bookName.value = "";
      bookEmail.value = "";
      bookPhone.value = "";
      // Reset cart
      cart = [];
      serviceButtons.forEach((button) => {
        button.textContent = "Add Item +";
        button.classList.remove("remove-item");
      });
      updateCart();
      // Show success message
      message.style.display = "block";
      message.style.color = "green";
      message.innerText = "Thanks for booking! We'll get back to you soon.";
      setTimeout(() => {
        message.style.display = "none";
      }, 3000);
    }
  };
});
// Newsletter form submission
document.addEventListener("DOMContentLoaded", () => {
  const newsletterForm = document.querySelector(".newsletter-form");
  const newsName = newsletterForm.querySelector("#name");
  const newsEmail = newsletterForm.querySelector("#email");
  const newsErrors = newsletterForm.querySelectorAll(".field-error");
  const message = newsletterForm.querySelector(".newsletter-msg");
  newsletterForm.onsubmit = e => {
      e.preventDefault();
      newsErrors.forEach(error => error.innerText = "");
      if (!newsName.value.trim()) {
          newsErrors[0].innerText = "Enter Name";
          return;
      } else if (!newsEmail.value.includes("@")) {
          newsErrors[1].innerText = "Enter valid email";
          return;
      } else {
          // Reset form
          newsName.value = "";
          newsEmail.value = "";
          // Show success message
          message.style.display = "block";
          message.style.color = "green";
          message.innerText = "Thanks for subscribing! We'll get back to you soon.";
          setTimeout(() => {
              message.style.display = "none";
          }, 3000);
      }
  };
});
// Mobile menu functionality
function initMobileMenu() {
  const toggle = document.querySelector('.menu-button'), navbar = document.querySelector('.navbar'), navLinks = document.querySelector('.nav-links');
  if (!toggle) return;
  // Toggle mobile menu
  toggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      navLinks.classList.toggle('active');
  });
  // Close mobile menu when clicking links
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navbar.classList.remove('active');
      navLinks.classList.remove('active');
  }));
  // Close mobile menu when clicking outside
  document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navbar.classList.contains('active')) {
          navbar.classList.remove('active');
          navLinks.classList.remove('active');
      }
  });
}
// Initialize mobile menu
initMobileMenu();