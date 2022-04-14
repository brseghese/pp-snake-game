const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLengt = 1;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "black");
gradient.addColorStop("0.5", "green");
gradient.addColorStop("1.0", "black");

const eatSound = new Audio("./assets/eat.wav");

const apple = new Image();
apple.src = "./assets/apple.png";

const green = new Image();
green.src = "./assets/background.jpg";
green.width = 400;
green.height = 400;

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function drawBack() {
  ctx.drawImage(green, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "12px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 70, 15);
}

function clearScreen() {
  // ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLengt) {
    snakeParts.shift();
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function updateSnake() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  // ctx.fillStyle = "red";
  // ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
  ctx.drawImage(
    apple,
    appleX * tileCount - 1,
    appleY * tileCount - 2,
    tileSize + 3,
    tileSize + 3
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLengt++;
    score++;
    eatSound.play();
  }
}

document.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (event.keyCode == 87 || event.keyCode == 38) {
    if (yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }
  if (event.keyCode == 83 || event.keyCode == 40) {
    if (yVelocity == -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }
  if (event.keyCode == 65 || event.keyCode == 37) {
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }
  if (event.keyCode == 68 || event.keyCode == 39) {
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
}

// ---

let touchX = "";
let touchY = "";
let touchTreshold = 30;

window.addEventListener("touchstart", (e) => {
  touchY = e.changedTouches[0].pageY;
  touchX = e.changedTouches[0].pageX;
});
window.addEventListener("touchmove", (e) => {
  const swipeDistanceX = e.changedTouches[0].pageX - touchX;
  const swipeDistanceY = e.changedTouches[0].pageY - touchY;

  if (swipeDistanceY < -touchTreshold) {
    if (yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
  } else if (swipeDistanceY > touchTreshold) {
    if (yVelocity == -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }
  if (swipeDistanceX < -touchTreshold) {
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
  } else if (swipeDistanceX > touchTreshold) {
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
});

// ---

function isGameOver() {
  let gameOver = false;

  if (xVelocity === 0 && yVelocity === 0) return false;

  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = gradient;
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over", canvas.width / 6.8, canvas.height / 2);
  }

  return gameOver;
}

function drawGame() {
  updateSnake();

  let result = isGameOver();
  if (result) {
    gameOver();
    return;
  }

  clearScreen();

  drawBack();

  checkAppleCollision();

  drawApple();
  drawSnake();
  drawScore();

  if (score >= 3) {
    speed = 9;
  }
  if (score >= 6) {
    speed = 11;
  }
  if (score >= 9) {
    speed = 13;
  }
  if (score >= 12) {
    speed = 15;
  }
  if (score >= 15) {
    speed = 17;
  }
  if (score >= 18) {
    speed = 19;
  }

  setTimeout(drawGame, 1000 / speed);
}

drawGame();

function startGame() {
  let gameStartLayer = document.getElementById("gameStart");
  gameStartLayer.style.display = "none";
}

function gameOver() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  let gameOver = document.getElementById("gameOver");
  gameOver.style.display = "flex";
  let resultadoP = document.getElementById("resultado");
  resultadoP.textContent = `Score: ${score}`;
}

function restartGame() {
  let gameOver = document.getElementById("gameOver");
  gameOver.style.display = "none";
  location.reload();
}

function startGameMobile() {
  let gameStartLayer = document.getElementById("gameStart");
  gameStartLayer.style.display = "none";
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      alert(`Error, can't enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}
