const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

const cartCount = document.getElementById("cartCount");
const openCart = document.getElementById("openCart");

let cart = JSON.parse(localStorage.getItem("lcCart")) || [];

if(cartCount){
  cartCount.textContent = cart.length;
}

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
    if(mainNav){
      mainNav.classList.remove("open");
    }
  });
});

if(openCart){
  openCart.addEventListener("click", () => {
    window.location.href = "acceuil.html#products";
  });
}

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(element => {
  observer.observe(element);
});