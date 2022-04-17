const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let record = 0;
let recordStorage = 0;

let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "black");
gradient.addColorStop("0.5", "green");
gradient.addColorStop("1.0", "black");

const eatSound = new Audio("./assets/eat.wav");

const apple = new Image();
apple.src = "./assets/apple.png";

const backgroundImage = new Image();
backgroundImage.src = "./assets/background.jpg";
backgroundImage.width = 400;
backgroundImage.height = 400;

let previousXVelocity = 0;
let previousYVelocity = 0;

//game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  //Was moving right and try to move left
  if (previousXVelocity === 1 && xVelocity === -1) {
    xVelocity = previousXVelocity;
  }

  //Was moving left and try to move right
  if (previousXVelocity === -1 && xVelocity === 1) {
    xVelocity = previousXVelocity;
  }

  //Was moving up and try to move down
  if (previousYVelocity === -1 && yVelocity === 1) {
    yVelocity = previousYVelocity;
  }

  //Was moving down and try to move up
  if (previousYVelocity === 1 && yVelocity === -1) {
    yVelocity = previousYVelocity;
  }

  previousXVelocity = xVelocity;
  previousYVelocity = yVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    document.body.removeEventListener("keydown", keyDown);
    gameOver();
    return;
  }

  clearScreen();
  drawBack();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 12;
  }
  if (score > 15) {
    speed = 15;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
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

function drawBack() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "12px Verdana";
  ctx.fillText("Record: " + record, 15, 15);
  ctx.fillStyle = "white";
  ctx.font = "12px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 70, 15);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthest item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
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
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    eatSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    inputsYVelocity = 0;
    inputsXVelocity = 1;
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
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  } else if (swipeDistanceY > touchTreshold) {
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  if (swipeDistanceX < -touchTreshold) {
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  } else if (swipeDistanceX > touchTreshold) {
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
});

// ---

drawGame();

function startGame() {
  checkLocalStorage();
  let gameStartLayer = document.getElementById("gameStart");
  gameStartLayer.style.display = "none";
}

function gameOver() {
  checkLocalStorage();
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  let gameOver = document.getElementById("gameOver");
  gameOver.style.display = "flex";
  let totalRecord = document.getElementById("record");
  totalRecord.textContent = `Record: ${record}`;
  let totalScore = document.getElementById("score");
  totalScore.textContent = `Score: ${score}`;
}

function restartGame() {
  let gameOver = document.getElementById("gameOver");
  gameOver.style.display = "none";
  location.reload();
}

function startGameMobile() {
  checkLocalStorage();
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

// ---

function checkLocalStorage() {
  if (localStorage.length) {
    recordStorage = localStorage.getItem("record");
    record = recordStorage;
  } else {
    localStorage.setItem("record", "0");
  }
  compareRecord(recordStorage);
}

function compareRecord(recordStorage) {
  if (score > recordStorage) {
    record = score;
    localStorage.setItem("record", score);
  }
}
