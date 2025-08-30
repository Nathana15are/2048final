let score = 0;
let board = [];
let size = 4;
let likeCount = 100;
let gamesCount = 200;

// Initialisation
window.onload = () => {
  startGame("normal");
  updateLikes();
  updateGames();

  // Fake global increments
  setInterval(() => {
    likeCount += 2;
    updateLikes();
  }, 10000);

  setInterval(() => {
    gamesCount += 5;
    updateGames();
  }, 10000);

  document.getElementById("likeBtn").addEventListener("click", () => {
    likeCount++;
    updateLikes();
    spawnHeart();
  });

  // Swipe tactile
  let touchStartX, touchStartY;
  const gameContainer = document.getElementById("game-container");
  gameContainer.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  gameContainer.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) move("right"); else move("left");
    } else {
      if (dy > 0) move("down"); else move("up");
    }
  });
};

function updateLikes() {
  document.getElementById("likeCount").textContent = likeCount;
}
function updateGames() {
  document.getElementById("gamesCount").textContent = gamesCount;
}
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = (window.innerWidth/2) + "px";
  heart.style.top = "50%";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
}

function startGame(mode) {
  score = 0;
  board = Array(size).fill().map(() => Array(size).fill(0));
  addRandom();
  addRandom();
  renderBoard();
}

function addRandom() {
  let empty = [];
  for (let i=0;i<size;i++){
    for (let j=0;j<size;j++){
      if (board[i][j] === 0) empty.push({x:i,y:j});
    }
  }
  if (empty.length > 0) {
    let spot = empty[Math.floor(Math.random()*empty.length)];
    board[spot.x][spot.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function renderBoard() {
  let grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (let i=0;i<size;i++){
    for (let j=0;j<size;j++){
      let cell = document.createElement("div");
      cell.className = "cell";
      if (board[i][j] !== 0) {
        cell.textContent = board[i][j];
        cell.style.background = `hsl(${(board[i][j]*5)%360},80%,50%)`;
      }
      grid.appendChild(cell);
    }
  }
  document.getElementById("score").textContent = score;
}

function move(direction) {
  let rotated = false;
  let flipped = false;

  if (direction === "up") { board = rotate(board); rotated = true; }
  if (direction === "down") { board = rotate(board); board = flip(board); rotated = true; flipped = true; }
  if (direction === "right") { board = flip(board); flipped = true; }

  let newBoard = [];
  for (let row of board) {
    let arr = row.filter(x => x);
    for (let i=0;i<arr.length-1;i++) {
      if (arr[i] === arr[i+1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i+1] = 0;
      }
    }
    arr = arr.filter(x => x);
    while (arr.length < size) arr.push(0);
    newBoard.push(arr);
  }
  board = newBoard;

  if (flipped) board = flip(board);
  if (rotated) board = rotate(board, true);

  addRandom();
  renderBoard();
}

function rotate(b, anticlockwise=false) {
  let newBoard = Array(size).fill().map(()=>Array(size).fill(0));
  for (let i=0;i<size;i++){
    for (let j=0;j<size;j++){
      if (anticlockwise) newBoard[i][j] = b[j][i];
      else newBoard[j][i] = b[i][j];
    }
  }
  return newBoard;
}
function flip(b) {
  return b.map(r => r.reverse());
}

// Partage score
function shareScore() {
  const score = document.getElementById("finalScore").textContent;
  if (navigator.share) {
    navigator.share({title:"Mon score 2048", text:`J'ai fait ${score} points sur 2048 Ultra Deluxe !`, url:window.location.href});
  } else {
    alert("Ton score : " + score);
  }
}
