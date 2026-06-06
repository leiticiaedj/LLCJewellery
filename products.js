const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.querySelector(".checkout-btn");

let cart = JSON.parse(localStorage.getItem("lcCart")) || [];

if(header){
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });
}

if(navToggle && mainNav){
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

function showCart(){
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
}

function hideCart(){
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
}

openCart.addEventListener("click", showCart);
closeCart.addEventListener("click", hideCart);
cartBackdrop.addEventListener("click", hideCart);

document.querySelectorAll(".wishlist-btn").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");
    const icon = button.querySelector("i");
    icon.className = button.classList.contains("liked")
      ? "fa-solid fa-heart"
      : "fa-regular fa-heart";
  });
});

document.querySelectorAll(".sizes").forEach(group => {
  const buttons = group.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

document.querySelectorAll(".cart-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const activeSize = card.querySelector(".sizes button.active");
    const size = activeSize ? activeSize.textContent : "Standard";

    cart.push({ name, price, size });

    updateCart();

    button.innerText = "Ajouté ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.innerText = "Ajouter au panier";
      button.classList.remove("added");
    }, 1500);

    showCart();
  });
});

function updateCart(){
  localStorage.setItem("lcCart", JSON.stringify(cart));

  cartCount.textContent = cart.length;

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  cartTotal.textContent = `${total}£`;

  if(cart.length === 0){
    cartItems.innerHTML = `<p class="empty-cart">Votre panier est vide.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>Taille : ${item.size}</small>
        <span>${item.price}£</span>
      </div>

      <button class="remove-item" data-index="${index}">
        Supprimer
      </button>
    </div>
  `).join("");

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      cart.splice(index, 1);
      updateCart();
    });
  });
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    document.querySelectorAll(".catalog-section .product-card").forEach(card => {
      if(filter === "all" || card.dataset.category === filter){
        card.classList.remove("hide");
      }else{
        card.classList.add("hide");
      }
    });
  });
});

const searchInput = document.getElementById("searchInput");

if(searchInput){
  searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();

    document.querySelectorAll(".catalog-section .product-card").forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category.toLowerCase();

      if(name.includes(value) || category.includes(value)){
        card.style.display = "block";
      }else{
        card.style.display = "none";
      }
    });
  });
}

const showSummerProducts = document.getElementById("showSummerProducts");
const summerProducts = document.getElementById("summerProducts");

if(showSummerProducts && summerProducts){
  showSummerProducts.addEventListener("click", () => {
    summerProducts.classList.add("active");
    summerProducts.scrollIntoView({ behavior:"smooth" });
  });
}

checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0){
    alert("Votre panier est vide.");
    return;
  }

  localStorage.setItem("lcCart", JSON.stringify(cart));
  window.location.href = "commande.html";
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{
  threshold:0.15
});

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

updateCart();
const launchDate = new Date("August 15, 2026 00:00:00").getTime();

function updateCountdown(){

  const now = new Date().getTime();
  const distance = launchDate - now;

  if(distance <= 0){

    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24))
    / (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60))
    / (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60))
    / 1000
  );

  document.getElementById("days").textContent =
    String(days).padStart(2,"0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2,"0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2,"0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2,"0");
}

updateCountdown();

setInterval(updateCountdown, 1000);