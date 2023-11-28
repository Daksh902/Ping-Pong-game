import "./styles.css";

// JavaScript for game logic goes here

const gameContainer = document.getElementById("game-container");
const paddleTop = document.getElementById("paddle-top");
const paddleBottom = document.getElementById("paddle-bottom");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");

// Set the height of the game container based on the window's inner height
gameContainer.style.height = `${window.innerHeight}px`;

let ballSpeedX = 2;
let ballSpeedY = 2;
let score = 0;
let winningPlayer = "";

// Retrieve highest score and scorer from local storage
let highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
let highestScorer = localStorage.getItem("highestScorer") || "";

if (highestScore !== 0) {
  alert(`Highest Score: ${highestScore} by ${highestScorer}`);
} else {
  alert("This is your first time.");
}

document.addEventListener("keydown", function (event) {
  if (event.key === "a" || event.key === "d") {
    // Move both paddles left or right within the boundaries of the game container
    let currentPosition = parseInt(paddleTop.style.left) || 0;
    if (event.key === "a" && currentPosition > 0) {
      currentPosition -= 10;
    } else if (
      event.key === "d" &&
      currentPosition < gameContainer.offsetWidth - paddleTop.offsetWidth
    ) {
      currentPosition += 10;
    }

    paddleTop.style.left = `${currentPosition}px`;
    paddleBottom.style.left = `${currentPosition}px`;
  } else if (event.key === "Enter") {
    startRound();
  }
});

function startRound() {
  // Reset positions for paddles and ball
  paddleTop.style.left = "350px";
  paddleBottom.style.left = "350px";
  ball.style.left = "390px";
  ball.style.top = "190px";

  // Determine winning player from the previous round
  if (score % 2 === 0) {
    winningPlayer = "Rod 1";
  } else {
    winningPlayer = "Rod 2";
  }

  alert(`${winningPlayer} wins with a score of ${score}`);

  // Update highest score in local storage
  if (score > highestScore) {
    highestScore = score;
    highestScorer = winningPlayer;
    localStorage.setItem("highestScore", highestScore);
    localStorage.setItem("highestScorer", highestScorer);
    alert(`New Highest Score! ${highestScorer} scored ${highestScore}`);
  }

  // Reset score for the new round
  score = 0;
  updateScore();
}

function update() {
  // Update ball position
  ball.style.left = `${parseInt(ball.style.left) + ballSpeedX}px`;
  ball.style.top = `${parseInt(ball.style.top) + ballSpeedY}px`;

  // Change ball color continually
  ball.style.backgroundColor = getRandomColor();

  // Check for collisions with paddles
  if (isCollision(ball, paddleTop) || isCollision(ball, paddleBottom)) {
    ballSpeedY = -ballSpeedY;
    score++;
    updateScore();
  }

  // Check for collisions with walls
  if (parseInt(ball.style.left) <= 0 || parseInt(ball.style.left) + 20 >= 800) {
    ballSpeedX = -ballSpeedX;
  }

  // Check for scoring
  if (
    parseInt(ball.style.top) <= 0 ||
    parseInt(ball.style.top) + 20 >= window.innerHeight
  ) {
    resetGame();
  }

  requestAnimationFrame(update);
}

function isCollision(ball, paddle) {
  const ballRect = ball.getBoundingClientRect();
  const paddleRect = paddle.getBoundingClientRect();

  return (
    ballRect.top < paddleRect.bottom &&
    ballRect.bottom > paddleRect.top &&
    ballRect.left < paddleRect.right &&
    ballRect.right > paddleRect.left
  );
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function resetGame() {
  // Determine which player lost the match
  const losingPlayer = score % 2 === 0 ? "Rod 2" : "Rod 1";
  alert(
    `Game Over! ${losingPlayer} lost. ${winningPlayer} wins with a score of ${score}`,
  );

  // Move ball and paddles to center
  ball.style.left = "390px";
  ball.style.top = "190px";
  paddleTop.style.left = "350px";
  paddleBottom.style.left = "350px";
}

// Start the game loop
update();

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
