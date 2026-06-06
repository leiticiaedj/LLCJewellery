const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

const cartCount = document.getElementById("cartCount");
const openCart = document.getElementById("openCart");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const message = document.getElementById("message");

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
    window.location.href = "index.html#products";
  });
}

function showLogin(){
  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  loginForm.classList.add("active");
  registerForm.classList.remove("active");

  hideMessage();
}

function showRegister(){
  registerTab.classList.add("active");
  loginTab.classList.remove("active");

  registerForm.classList.add("active");
  loginForm.classList.remove("active");

  hideMessage();
}

if(loginTab){
  loginTab.addEventListener("click", showLogin);
}

if(registerTab){
  registerTab.addEventListener("click", showRegister);
}

if(goRegister){
  goRegister.addEventListener("click", showRegister);
}

if(goLogin){
  goLogin.addEventListener("click", showLogin);
}

document.querySelectorAll(".show-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;

    if(input.type === "password"){
      input.type = "text";
      button.textContent = "Cacher";
    }else{
      input.type = "password";
      button.textContent = "Voir";
    }
  });
});

function showMessage(text, type){
  message.textContent = text;
  message.className = `message ${type}`;
}

function hideMessage(){
  message.textContent = "";
  message.className = "message";
}

if(registerForm){
  registerForm.addEventListener("submit", function(e){
    e.preventDefault();

    const user = {
      lastName: document.getElementById("lastName").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      email: document.getElementById("registerEmail").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      zip: document.getElementById("zip").value.trim(),
      password: document.getElementById("registerPassword").value
    };

    if(user.password.length < 6){
      showMessage("Le mot de passe doit contenir au moins 6 caractères.", "error");
      return;
    }

    localStorage.setItem("lcJewelleryUser", JSON.stringify(user));

    showMessage("Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.", "success");

    setTimeout(() => {
      showLogin();
      document.getElementById("loginEmail").value = user.email;
    }, 1500);
  });
}

if(loginForm){
  loginForm.addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const savedUser = JSON.parse(localStorage.getItem("lcJewelleryUser"));

    if(!savedUser){
      showMessage("Aucun compte trouvé. Veuillez créer un compte d’abord.", "error");
      return;
    }

    if(email === savedUser.email && password === savedUser.password){
      showMessage(`Bienvenue ${savedUser.firstName}, vous êtes connectée à votre espace privé.`, "success");
    }else{
      showMessage("Email ou mot de passe incorrect.", "error");
    }
  });
}