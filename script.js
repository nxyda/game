const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
let score = 0;

canvas.width = 400;
canvas.height = 300;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5,
    direction: 1,
};

const spikes = [];
const spikeWidth = 40;
const spikeHeight = 40;
const spikeSpeed = 2.5;
let gameOver = false;

const circles = [];
const circleWidth = 40;
const circleHeight = 40;
const circleSpeed = 2.5;

function updateScore() {
    score++;
    scoreElement.textContent = "Punkty: " + score;
}

function initializeGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 60;
    spikes.length = 0;
    circles.length = 0;
    score = 0;
    updateScore();
    gameOver = false;
    gameOverScreen.style.display = 'none';
    gameLoop();
}

function createSpike() {
    const x = Math.random() * (canvas.width - spikeWidth);
    spikes.push({ x, y: 0, width: spikeWidth, height: spikeHeight });
}

function createCircles() {
    const x = Math.random() * (canvas.width - circleWidth);
    circles.push({ x, y: 0, width: circleWidth, height: circleHeight });
}

function updatePlayer() {
    if (player.direction === 1 && player.x + player.width < canvas.width) {
        player.x += player.speed;
    } else if (player.direction === -1 && player.x > 0) {
        player.x -= player.speed;
    }
}

function updateSpikes() {
    for (let i = spikes.length - 1; i >= 0; i--) {
        spikes[i].y += spikeSpeed;
        if (spikes[i].y > canvas.height) {
            spikes.splice(i, 1);
        } else if (checkCollision(player, spikes[i])) {
            endGame();
        }
    }
}

function updateCircles() {
    for (let i = circles.length - 1; i >= 0; i--) {
        circles[i].y += circleSpeed;
        if (circles[i].y > canvas.height) {
            circles.splice(i, 1);
        } else if (checkCollision(player, circles[i])) {
            updateScore();
            circles.splice(i, 1);
        }
    }
}

function checkCollision(player, object) {
    return !(player.x > object.x + object.width ||
        player.x + player.width < object.x ||
        player.y > object.y + object.height ||
        player.y + player.height < object.y);
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawSpikes() {
    ctx.fillStyle = 'red';
    for (const spike of spikes) {
        ctx.beginPath();
        ctx.moveTo(spike.x, spike.y + spike.height);
        ctx.lineTo(spike.x + spike.width / 2, spike.y);
        ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
        ctx.closePath();
        ctx.fill();
    }
}

function drawCircles() {
    ctx.fillStyle = 'yellow';
    for (const circle of circles) {
        ctx.beginPath();
        ctx.arc(circle.x + circle.width / 2, circle.y + circle.height / 2, circle.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (!gameOver) {
        clearCanvas();
        updatePlayer();
        updateSpikes();
        updateCircles();
        drawPlayer();
        drawSpikes();
        drawCircles();
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    gameOver = true;
    gameOverScreen.style.display = 'flex';
    clearInterval(scoreTimer);
}

function restartGame() {
    clearInterval(scoreTimer);
    initializeGame();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        player.direction *= -1;
    }
});

restartButton.addEventListener('click', restartGame);

setInterval(createSpike, 1000);
setInterval(createCircles, 2000);
initializeGame();
