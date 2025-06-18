// Catalogue produits
const products = [
  {id: 1, title: "Bouquet de fleur d'argent", price: 50, category: "Décoration", image: "BOUQUET DE FLEURS VISIBLE.jpg"},
  {id: 2, title: "Color glass", price: 0.5, category: "Accessoire", image: "COLOR GLASSE 5.jpg"},
  {id: 4, title: "Décoration blanc et or", price: 10.00, category: "Décoration", image: "DECORATION BLANC OR.jpg"},
  {id: 13, title: "Sac dior", price: 15, category: "Sac", image: "SAC DIOR.jpg"},
  {id: 15, title: "vantouse de telephone", price: 3.00, category: "Accessoire", image: "VENTOUSE POUR PHONE 3.jpg"},
  {id: 7, title: "Décoration rose", price: 20.00, category: "Décoration", image: "DECOREATION ROSE.jpg"},
  {id: 8, title: "Electro-dentifrice", price: 5.00, category: "Accessoire", image: "ELECTRO DENTIFRICE 5.jpg"},
  {id: 9, title: "lumineur photo", price: 10.00, category: "Accessoire", image: "LUMINEUR PHOTO 10.jpg"},
  {id: 10, title: "Mixeur fruit", price: 10.00, category: "maison", image: "MIXEUR FRUIT 10.jpg"},
  {id: 16, title: "Selfie lumineux", price: 5.00, category: "Accessoire", image: "SELFIE LUMINEUX 10.jpg"},
];
// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let loggedUser = localStorage.getItem('loggedUser') || null;


// Exemple de produits à afficher dans le carrousel (tu peux utiliser une partie de ton tableau products)
const featuredProducts = [
   {id: 1, title: "Bouquet de fleur d'argent", price: 10.00, category: "Décoration", image: "BOUQUET DE FLEURS VISIBLE.jpg"},
   {id: 2, title: "Color glass", price: 5.00, category: "Accessoire", image: "COLOR GLASSE 5.jpg"},
   {id: 4, title: "Décoration blanc et or", price: 20.00, category: "Décoration", image: "DECORATION BLANC OR.jpg"},
   {id: 13, title: "Sac dior", price: 15.00, category: "Sac", image: "SAC DIOR.jpg"},
   {id: 15, title: "vantouse de telephone", price: 3.00, category: "Accessoire", image: "VENTOUSE POUR PHONE 3.jpg"},
   {id: 7, title: "Décoration rose", price: 20.00, category: "Décoration", image: "DECOREATION ROSE.jpg"},
];
const carouselTrack = document.getElementById('carouselTrack');
let currentIndex = 0;

// Fonction pour afficher les produits dans le carrousel
function displayCarouselProducts() {
  carouselTrack.innerHTML = '';
  featuredProducts.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-title">${product.title}</div>
      <div class="product-price">${product.price.toFixed(2)} $</div>
    `;
    carouselTrack.appendChild(li);
  });
}

// Fonction pour déplacer le carrousel
function moveCarousel(direction) {
  const itemWidth = carouselTrack.querySelector('li').offsetWidth + 20; // largeur + margin
  const visibleItems = Math.floor(carouselTrack.parentElement.offsetWidth / itemWidth);
  const maxIndex = featuredProducts.length - visibleItems;

  if(direction === 'next' && currentIndex < maxIndex) {
    currentIndex++;
  } else if(direction === 'prev' && currentIndex > 0) {
    currentIndex--;
  }

  carouselTrack.style.transform ='translateX(-${ currentIndex * itemWidth }px)';
}

// Événements boutons
document.querySelector('.carousel-btn.prev').addEventListener('click', () => moveCarousel('prev'));
document.querySelector('.carousel-btn.next').addEventListener('click', () => moveCarousel('next'));

// Initialisation
displayCarouselProducts();



// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartModal = document.getElementById('cartModal');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalDiv = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentModal = document.getElementById('paymentModal');
const paymentMessage = document.getElementById('paymentMessage');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Affiche les produits
function displayProducts(list) {
  productGrid.innerHTML = '';
  if(list.length === 0) {
    productGrid.innerHTML = '<p>Aucun produit trouvé.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="product-image" />
      <div class="product-title">${p.title}</div>
      <div class="product-price">${p.price.toFixed(2)} $</div>
      <button class="btn-add" onclick="addToCart(${p.id})">Ajouter au panier</button>
    `;
    productGrid.appendChild(card);
  });
}

// Filtrer par catégorie
function filterCategory(cat) {
  if(cat === 'all') {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat);
    displayProducts(filtered);
  }
}

// Recherche simple
function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  displayProducts(filtered);
}

// Ajouter au panier
function addToCart(productId) {
  if(!loggedUser) {
    alert("Veuillez vous connecter pour ajouter des produits au panier.");
    toggleLogin();
    return;
  }
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if(existing) {
    existing.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  saveCart();
  updateCartCount();
  alert(`Produit ajouté au panier : ${product.title}`);
}

// Sauvegarder panier dans localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Met à jour le compteur du panier
function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountSpan.textContent = totalQty;
  checkoutBtn.disabled = totalQty === 0;
}

// Affiche ou cache le panier
function toggleCart() {
  if(cartModal.style.display === 'flex') {
    cartModal.style.display = 'none';
  } else {
    renderCart();
    cartModal.style.display = 'flex';
  }
}

// Affiche les items dans le panier
function renderCart() {
  cartItemsDiv.innerHTML = '';
  if(cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Votre panier est vide.</p>';
    cartTotalDiv.textContent = '';
    checkoutBtn.disabled = true;
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>${item.title} (x${item.qty})</div>
      <div>${(item.price * item.qty).toFixed(2)} € 
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Supprimer">×</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalDiv.textContent = `Total : ${total.toFixed(2)} €`;
  checkoutBtn.disabled = false;
}

// Supprimer un produit du panier
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

// Affiche le formulaire de paiement
function showPayment() {
  cartModal.style.display = 'none';
  paymentModal.style.display = 'flex';
  paymentMessage.textContent = '';
  document.getElementById('paymentForm').reset();
}

// Ferme le modal paiement
function closePayment() {
  paymentModal.style.display = 'none';
}

// Traite le paiement (simulation)
function processPayment() {
  const form = document.getElementById('paymentForm');
  const method = form.paymentMethod.value;
  const phone = document.getElementById('phoneNumber').value.trim();

  if(!method || !phone) {
    paymentMessage.textContent = 'Veuillez remplir tous les champs.';
    paymentMessage.style.color = 'red';
    return;
  }

  // Simulation de traitement
  paymentMessage.style.color = 'green';
  paymentMessage.textContent = `Paiement de ${cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)} € via ${method} en cours...`;

  setTimeout(() => {
    paymentMessage.textContent = 'Paiement réussi ! Merci pour votre achat.';
    cart = [];
    saveCart();
    updateCartCount();
    setTimeout(() => {
      closePayment();
      showPage('accueil');
    }, 3000);
  }, 2000);
}

// Affiche une page donnée
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const page = document.getElementById(`page-${pageId}`);
  if(page) page.classList.add('active');
  // Fermer modals si ouverts
  cartModal.style.display = 'none';
  paymentModal.style.display = 'none';
  loginModal.style.display = 'none';
  // Reset recherche
  document.getElementById('searchInput').value = '';
  if(pageId === 'boutique') {
    displayProducts(products);
  }
}

// Gestion menu hamburger
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Connexion utilisateur (simulation)
function toggleLogin() {
  if(loginModal.style.display === 'flex') {
    loginModal.style.display = 'none';
  } else {
    loginModal.style.display = 'flex';
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('loginForm').reset();
  }
}

function loginUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Simple validation (simulation)
  if(username === '' || password === '') {
    document.getElementById('loginMessage').textContent = 'Veuillez remplir tous les champs.';
    document.getElementById('loginMessage').style.color = 'red';
    return;
  }
}
  // Simuler succès
  // Récupération des utilisateurs enregistrés depuis localStorage
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// Sauvegarde des utilisateurs dans localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Basculer entre formulaire connexion et inscription
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTitle = document.getElementById('loginTitle');
  const toggleText = document.getElementById('toggleText');
  const loginMessage = document.getElementById('loginMessage');

  if(loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginTitle.textContent = 'Connexion';
    toggleText.innerHTML = '<a href="#" onclick="toggleForms()">Créer un compte</a>';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginTitle.textContent = 'Inscription';
    toggleText.innerHTML = '<a href="#" onclick="toggleForms()">Déjà un compte ? Connectez-vous</a>';
  }
  loginMessage.textContent = '';
}

// Inscription utilisateur
function registerUser() {
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  const users = getUsers();

  // Vérifier unicité email
  if(users.some(u => u.email === email)) {
    document.getElementById('loginMessage').textContent = 'Cet email est déjà utilisé.';
    document.getElementById('loginMessage').style.color = 'red';
    return;
  }

  // Ajouter utilisateur
  users.push({username, email, password});
  saveUsers(users);

  document.getElementById('loginMessage').textContent = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
  document.getElementById('loginMessage').style.color = 'green';

  // Basculer vers connexion
  setTimeout(() => {
    toggleForms();
  }, 2000);
}

// Connexion utilisateur
function loginUser() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if(user) {
    // Stocker utilisateur connecté
    localStorage.setItem('loggedUser', JSON.stringify(user));
    loggedUser = user.username;
    updateUserUI();
    toggleLogin();
    alert(`Bienvenue, ${user.username} !`);
  } else {
    document.getElementById('loginMessage').textContent = 'Email ou mot de passe incorrect.';
    document.getElementById('loginMessage').style.color = 'red';
  }
}

// Mise à jour interface utilisateur selon connexion
function updateUserUI() {
  const userData = localStorage.getItem('loggedUser');
  if(userData) {
    const user = JSON.parse(userData);
    loggedUser = user.username;
    userGreeting.textContent = `Bonjour, ${loggedUser}`;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loggedUser = null;
    userGreeting.textContent = '';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

// Déconnexion
function logout() {
  localStorage.removeItem('loggedUser');
  loggedUser = null;
  updateUserUI();
  cart = [];
  saveCart();
  updateCartCount();
  alert('Vous êtes déconnecté.');
  showPage('accueil');
}

function submitContactForm() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const responseDiv = document.getElementById('contactResponse');

  if(!name || !email || !message) {
    responseDiv.style.color = 'red';
    responseDiv.textContent = 'Veuillez remplir tous les champs.';
    return;
  }

  // Ici tu peux ajouter un appel API pour envoyer le message au serveur
  // Pour l’instant on simule un envoi réussi
  responseDiv.style.color = 'green';
  responseDiv.textContent = 'Merci pour votre message. Nous vous répondrons rapidement.';

  // Réinitialiser le formulaire
  document.getElementById('contactForm').reset();
}

// Gestion accordéon FAQ
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    const answer = button.nextElementSibling;
    if (answer) {
      if (expanded) {
        answer.hidden = true;
      } else {
        answer.hidden = false;
      }
    }
  });
});



// Initialisation
updateUserUI();
updateCartCount();
showPage('accueil');
