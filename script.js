let likeCount = 50; // compteur de départ (fake global)
const likeBtn = document.getElementById("like-btn");
const likeDisplay = document.getElementById("like-count");

// Mise à jour affichage avec animation
function updateLikes() {
  likeDisplay.textContent = likeCount;

  // Animation pulse
  likeDisplay.classList.add("like-anim");
  setTimeout(() => {
    likeDisplay.classList.remove("like-anim");
  }, 400);
}

// Spawn d'un cœur animé
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤️";

  // Position proche du bouton
  const btnRect = likeBtn.getBoundingClientRect();
  heart.style.left = btnRect.left + btnRect.width/2 + "px";
  heart.style.top = btnRect.top + "px";

  document.body.appendChild(heart);

  // Supprimer après anim
  setTimeout(() => {
    heart.remove();
  }, 1000);
}

// Clique → +1 et cœur animé
likeBtn.addEventListener("click", () => {
  likeCount++;
  updateLikes();
  spawnHeart();
});

// Fake global → +2 toutes les 10 sec
setInterval(() => {
  likeCount += 2;
  updateLikes();
}, 10000);

// Initialiser affichage
updateLikes();

// --- 2048 simplifié ---
const gridContainer = document.getElementById("grid-container");
let score = 0;

function createGrid() {
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = "";
    gridContainer.appendChild(tile);
  }
}

createGrid();
