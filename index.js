const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

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

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");

    if(mainNav){
      mainNav.classList.remove("open");
    }
  });
});

function showCart(){
  if(cartDrawer && cartBackdrop){
    cartDrawer.classList.add("open");
    cartBackdrop.classList.add("open");
  }
}

function hideCart(){
  if(cartDrawer && cartBackdrop){
    cartDrawer.classList.remove("open");
    cartBackdrop.classList.remove("open");
  }
}

if(openCart){
  openCart.addEventListener("click", showCart);
}

if(closeCart){
  closeCart.addEventListener("click", hideCart);
}

if(cartBackdrop){
  cartBackdrop.addEventListener("click", hideCart);
}

document.querySelectorAll(".wishlist-btn").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");

    const icon = button.querySelector("i");

    if(icon){
      icon.className = button.classList.contains("liked")
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";
    }
  });
});

document.querySelectorAll(".cart-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");

    if(!card) return;

    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    cart.push({
      name: name,
      price: price
    });

    updateCart();

    button.textContent = "Ajouté ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.textContent = "Ajouter au panier";
      button.classList.remove("added");
    }, 1600);

    showCart();
  });
});

function updateCart(){
  localStorage.setItem("lcCart", JSON.stringify(cart));

  if(cartCount){
    cartCount.textContent = cart.length;
  }

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price);
  }, 0);

  if(cartTotal){
    cartTotal.textContent = `${total}€`;
  }

  if(!cartItems) return;

  if(cart.length === 0){
    cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <span>${item.price}€</span>
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

if(checkoutBtn){
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0){
      alert("Votre panier est vide.");
      return;
    }

    localStorage.setItem("lcCart", JSON.stringify(cart));
    window.location.href = "commande.html";
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

updateCart();