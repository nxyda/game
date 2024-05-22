const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    direction: 1,
};

const spikes = [];
const spikeWidth = 30;
const spikeHeight = 30;
const spikeSpeed = 2;

function createSpike() {
    const x = Math.random() * (canvas.width - spikeWidth);
    spikes.push({ x, y: 0, width: spikeWidth, height: spikeHeight });
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
            alert('Game Over!');
            document.location.reload();
        }
    }
}

function checkCollision(player, spike) {
    return !(player.x > spike.x + spike.width ||
        player.x + player.width < spike.x ||
        player.y > spike.y + spike.height ||
        player.y + player.height < spike.y);
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

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    updatePlayer();
    updateSpikes();
    drawPlayer();
    drawSpikes();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        player.direction *= -1;
    }
});

setInterval(createSpike, 1000);

gameLoop();
