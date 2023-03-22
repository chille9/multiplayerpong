const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const speedIncreaseFactor = 1.1;
let lastSpeedIncrease = 0;
const speedIncreaseInterval = 500;


const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 5
};

const rightPaddle = {
  x: canvas.width - 20 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 5
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: ballSize,
  dx: 2,
  dy: 2
};


let leftScore = 0;
let rightScore = 0;

function drawPaddle(x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawBall(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawScore(left, right) {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(left, canvas.width / 4, 30);
  ctx.fillText(right, (canvas.width / 4) * 3, 30);
}

function collision(ball, paddle) {
  return (
    ball.x + ball.size >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y + ball.size >= paddle.y &&
    ball.y <= paddle.y + paddle.height
  );
}

const keyState = {};

function movePaddles() {
  document.addEventListener('keydown', (e) => {
    keyState[e.key] = true;
  });

  document.addEventListener('keyup', (e) => {
    keyState[e.key] = false;
  });

  if (keyState['ArrowUp']) {
    rightPaddle.y -= rightPaddle.dy;
  }
  if (keyState['ArrowDown']) {
    rightPaddle.y += rightPaddle.dy;
  }
  if (keyState['w'] || keyState['W']) {
    leftPaddle.y -= leftPaddle.dy;
  }
  if (keyState['s'] || keyState['S']) {
    leftPaddle.y += leftPaddle.dy;
  }
}

// Add this function to create the screen shake effect
function shakeScreen(duration, intensity) {
  const originalPosition = canvas.style.position;
  const startTime = performance.now();

  function shake() {
    const elapsed = performance.now() - startTime;
    if (elapsed < duration) {
      canvas.style.position = 'relative';
      canvas.style.left = Math.random() * intensity * 2 - intensity + 'px';
      canvas.style.top = Math.random() * intensity * 2 - intensity + 'px';
      requestAnimationFrame(shake);
    } else {
      canvas.style.position = originalPosition;
      canvas.style.left = '';
      canvas.style.top = '';
    }
  }

  shake();
}

// Add this function to centralize the ball resetting logic
function resetBall(delay) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 0;
  ball.dy = 0;

  setTimeout(() => {
    ball.dx = Math.random() > 0.5 ? 2 : -2;
    ball.dy = 2;
  }, delay);
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - leftPaddle.height), 0);
  rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - rightPaddle.height), 0);

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

 if (collision(ball, leftPaddle) || collision(ball, rightPaddle)) {
  const currentTime = performance.now();

  if (currentTime - lastSpeedIncrease > speedIncreaseInterval) {
    ball.dx *= -speedIncreaseFactor;
    ball.dy *= speedIncreaseFactor;
    lastSpeedIncrease = currentTime;
  } else {
    ball.dx *= -1;
  }
}



  if (ball.x < 0) {
  rightScore++;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 2;
  ball.dy = 2;
  shakeScreen(300, 5); // Duration: 300ms, Intensity: 5px
    resetBall(1000); // Delay: 1000ms
}

if (ball.x > canvas.width) {
  leftScore++;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -2;
  ball.dy = 2;
  shakeScreen(300, 5); // Duration: 300ms, Intensity: 5px
    resetBall(1000); // Delay: 1000ms
}


  drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  drawBall(ball.x, ball.y, ball.size);
  drawScore(leftScore, rightScore);

  movePaddles();
  requestAnimationFrame(gameLoop);
}

gameLoop();


