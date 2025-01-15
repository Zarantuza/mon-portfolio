import './style.css';

// Gestion du popup pour la galerie
const galleryItems = document.querySelectorAll('.gallery-item');
const popup = document.createElement('div');
popup.className = 'popup hidden';
popup.innerHTML = `
  <div class="popup-content">
    <button class="popup-arrow left">←</button>
    <img id="popup-img" class="hidden" src="" alt="">
    <video id="popup-video" class="hidden" controls>
      <source id="popup-video-source" src="" type="video/mp4">
      Votre navigateur ne supporte pas la lecture vidéo.
    </video>
    <button class="popup-arrow right">→</button>
    <div class="popup-text"></div>
  </div>
`;
document.body.appendChild(popup);

// Variables pour le popup
const popupImg = document.getElementById('popup-img');
const popupVideo = document.getElementById('popup-video');
const popupVideoSource = document.getElementById('popup-video-source');
const popupText = popup.querySelector('.popup-text');
const leftArrow = popup.querySelector('.popup-arrow.left');
const rightArrow = popup.querySelector('.popup-arrow.right');

let currentGallery = []; // Stocke les éléments de la galerie active
let currentIndex = 0; // Index actuel dans la galerie

// Met à jour le contenu du popup
function updatePopupContent(index) {
    const src = currentGallery[index];
    const isVideo = src.endsWith('.mp4');

    if (isVideo) {
        popupVideoSource.src = src;
        popupVideo.load();
        popupVideo.classList.remove('hidden');
        popupImg.classList.add('hidden');
    } else {
        popupImg.src = src;
        popupImg.classList.remove('hidden');
        popupVideo.classList.add('hidden');
    }

    // Masquer les flèches si un seul élément est présent
    if (currentGallery.length === 1) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    }
}


// Texte animé en haut de la page
const animatedTexts = [ // Liste des textes animés
  "Procédural modeling",
  "Pyro simulation",
  "RBD simulation",
  "Cloth simulation",
  "Texturing",
  "Python"
];
const animatedTextElement = document.getElementById('animated-text');
let currentTextIndex = 0; // Index actuel pour le texte animé

// Change le texte affiché
function changeAnimatedText() {
  animatedTextElement.textContent = animatedTexts[currentTextIndex];
  currentTextIndex = (currentTextIndex + 1) % animatedTexts.length; // Boucle sur les textes
}

// Change le texte toutes les 6 secondes
setInterval(changeAnimatedText, 6000);

// Initialisation
changeAnimatedText();

// Gestion de l'ouverture des popups
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        currentGallery = JSON.parse(item.dataset.gallery); // Récupère les éléments de la galerie
        currentIndex = 0; // Réinitialise l'index
        updatePopupContent(currentIndex); // Affiche le premier élément

        const project = item.dataset.project; // Récupère le nom du projet
        const description = item.dataset.description; // Récupère la description du projet
        popupText.textContent = `${project} - ${description}`;
        popup.classList.remove('hidden');
        document.body.classList.add('popup-active'); // Ajoute une classe pour désactiver le scroll
    });
});

// Navigation avec les flèches de la popup
leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updatePopupContent(currentIndex);
});

rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updatePopupContent(currentIndex);
});

// Navigation avec les touches du clavier
window.addEventListener('keydown', (e) => {
    if (popup.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updatePopupContent(currentIndex);
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updatePopupContent(currentIndex);
    }
});

// Fermer en cliquant à l'extérieur du contenu
popup.addEventListener('click', (e) => {
    if (!e.target.closest('.popup-content')) {
        popup.classList.add('hidden');
        document.body.classList.remove('popup-active');
        if (!popupVideo.classList.contains('hidden')) {
            popupVideo.pause();
        }
    }
});

// Gestion du scroll des flèches
const scrollArrow = document.getElementById('scroll-arrow');
const videoSection = document.querySelector('.video-section');
const gallerySection = document.getElementById('gallery');

function updateArrow() {
    if (!videoSection || !gallerySection) return;

    const videoRect = videoSection.getBoundingClientRect();
    const galleryRect = gallerySection.getBoundingClientRect();

    if (window.scrollY < videoRect.height - 10) {
        scrollArrow.textContent = '↓'; // Flèche vers le bas
        scrollArrow.style.display = 'block';
    } else if (window.scrollY > galleryRect.top - 10) {
        scrollArrow.textContent = '↑'; // Flèche vers le haut
        scrollArrow.style.display = 'block';
    } else {
        scrollArrow.style.display = 'none'; // Cache la flèche dans les autres cas
    }
}

// Gérer le clic de la flèche
scrollArrow?.addEventListener('click', () => {
    if (scrollArrow.textContent === '↓') {
        window.scrollTo({
            top: gallerySection.offsetTop,
            behavior: 'smooth'
        });
    } else if (scrollArrow.textContent === '↑') {
        window.scrollTo({
            top: videoSection.offsetTop,
            behavior: 'smooth'
        });
    }
});

// Mettre à jour la flèche lors du défilement
window.addEventListener('scroll', updateArrow);

// Initialiser la flèche
updateArrow();
