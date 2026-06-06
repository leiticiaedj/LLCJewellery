const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

const cartCount = document.getElementById("cartCount");
const openCart = document.getElementById("openCart");

const orderItems = document.getElementById("orderItems");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutContainer = document.getElementById("checkoutContainer");
const successMessage = document.getElementById("successMessage");

const receiptSection = document.getElementById("receiptSection");
const receiptNumber = document.getElementById("receiptNumber");
const receiptDate = document.getElementById("receiptDate");
const receiptAddress = document.getElementById("receiptAddress");
const receiptPayment = document.getElementById("receiptPayment");
const receiptProducts = document.getElementById("receiptProducts");
const receiptTotal = document.getElementById("receiptTotal");
const sendEmailBtn = document.getElementById("sendEmailBtn");
const printReceiptBtn = document.getElementById("printReceiptBtn");

const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");
const clientEmail = document.getElementById("clientEmail");

let cart = JSON.parse(localStorage.getItem("lcCart")) || [];
let lastOrder = null;

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
    window.location.href = "products.html";
  });
}

function displayOrder(){
  if(cart.length === 0){
    orderItems.innerHTML = `
      <p style="color:#7b6a63; line-height:1.7;">
        Votre panier est vide.
      </p>
    `;

    subtotal.textContent = "0£";
    total.textContent = "0£";
    return;
  }

  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <div>
        <strong>${item.name}</strong>
        ${item.size ? `<small style="display:block;color:#7b6a63;margin-top:4px;">Taille : ${item.size}</small>` : ""}
      </div>
      <span>${item.price}£</span>
    </div>
  `).join("");

  const sum = cart.reduce((acc, item) => acc + Number(item.price), 0);

  subtotal.textContent = `${sum}£`;
  total.textContent = `${sum}£`;
}

if(cardNumber){
  cardNumber.addEventListener("input", () => {
    let value = cardNumber.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    cardNumber.value = value.replace(/(.{4})/g, "$1 ").trim();
  });
}

if(cardExpiry){
  cardExpiry.addEventListener("input", () => {
    let value = cardExpiry.value.replace(/\D/g, "");
    value = value.substring(0, 4);

    if(value.length >= 3){
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    cardExpiry.value = value;
  });
}

if(cardCvv){
  cardCvv.addEventListener("input", () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, "").substring(0, 4);
  });
}

function generateOrderNumber(){
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LC-${new Date().getFullYear()}-${random}`;
}

function maskCard(number){
  const clean = number.replace(/\s/g, "");
  const last4 = clean.slice(-4);
  return `**** **** **** ${last4}`;
}

function buildReceipt(order){
  receiptNumber.textContent = order.numero;
  receiptDate.textContent = order.date;
  receiptAddress.textContent = order.adresse;
  receiptPayment.textContent = `${order.carte.nom} — ${order.carte.numeroMasque}`;

  receiptProducts.innerHTML = order.produits.map(item => `
    <div class="receipt-product">
      <div>
        <strong>${item.name}</strong>
        <small>Taille : ${item.size || "Standard"}</small>
      </div>
      <span>${item.price}£</span>
    </div>
  `).join("");

  receiptTotal.textContent = `${order.total}£`;
}

function buildEmailText(order){
  const productsText = order.produits.map(item => {
    return `- ${item.name} | Taille : ${item.size || "Standard"} | Prix : ${item.price}£`;
  }).join("%0D%0A");

  return `
Bonjour LC Jewellery,%0D%0A%0D%0A
Voici mon bon de commande :%0D%0A%0D%0A
Numéro : ${order.numero}%0D%0A
Date : ${order.date}%0D%0A
Adresse : ${order.adresse}%0D%0A
Paiement : ${order.carte.numeroMasque}%0D%0A%0D%0A
Produits :%0D%0A${productsText}%0D%0A%0D%0A
Total payé : ${order.total}£%0D%0A%0D%0A
Email client : ${order.email}%0D%0A
  `;
}

if(checkoutForm){
  checkoutForm.addEventListener("submit", function(e){
    e.preventDefault();

    if(cart.length === 0){
      successMessage.style.display = "block";
      successMessage.textContent = "Votre panier est vide. Veuillez ajouter un produit avant de commander.";
      return;
    }

    if(
      document.getElementById("adresse").value.trim() === "" ||
      clientEmail.value.trim() === "" ||
      cardName.value.trim() === "" ||
      cardNumber.value.trim().length < 19 ||
      cardExpiry.value.trim().length < 5 ||
      cardCvv.value.trim().length < 3
    ){
      successMessage.style.display = "block";
      successMessage.textContent = "Veuillez remplir correctement toutes les informations.";
      return;
    }

    const sum = cart.reduce((acc, item) => acc + Number(item.price), 0);

    lastOrder = {
      numero: generateOrderNumber(),
      date: new Date().toLocaleDateString("fr-FR"),
      adresse: document.getElementById("adresse").value.trim(),
      email: clientEmail.value.trim(),
      carte: {
        nom: cardName.value.trim(),
        numeroMasque: maskCard(cardNumber.value),
        expiration: cardExpiry.value
      },
      produits: cart,
      total: sum
    };

    localStorage.setItem("lcLastOrder", JSON.stringify(lastOrder));

    buildReceipt(lastOrder);

    successMessage.style.display = "block";
    successMessage.textContent = "Paiement effectué avec succès. Votre bon de commande est prêt.";

    checkoutContainer.style.display = "none";
    receiptSection.classList.add("active");

    localStorage.removeItem("lcCart");

    if(cartCount){
      cartCount.textContent = "0";
    }

    receiptSection.scrollIntoView({
      behavior:"smooth"
    });
  });
}

if(sendEmailBtn){
  sendEmailBtn.addEventListener("click", () => {
    if(!lastOrder){
      return;
    }

    const subject = `Bon de commande ${lastOrder.numero} - LC Jewellery`;
    const body = buildEmailText(lastOrder);

    window.location.href =
      `mailto:${lastOrder.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

if(printReceiptBtn){
  printReceiptBtn.addEventListener("click", () => {
    window.print();
  });
}

displayOrder();