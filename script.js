const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let running = false;
let paused = false;
let gameOver = false;

let score = 0;
let level = 1;

let roadY = 0;
let wheelRotation = 0;

let carColor = "red";


let baseSpeed = 10;
let carSpeed = baseSpeed;
let maxSpeed = 100;
let minSpeed = 2;


let accelerating = false;
let braking = false;


let player = {
    x: canvas.width / 2,
    y: canvas.height - 160,
    w: 50,
    h: 100
};

let enemies = [];


function startGame() {
    if (running) return;
    running = true;
    loop();
}


function pauseGame() {
    if (!running || gameOver) return;
    paused = !paused;
}


function restartGame() {
    running = false;
    paused = false;
    gameOver = false;

    score = 0;
    level = 1;
    carSpeed = baseSpeed;
    enemies = [];

    player.x = canvas.width / 2;

    updateUI();
    startGame();
}


function selectCar(color) {
    carColor = color;
}


function left() {
    if (!running || paused) return;
    player.x -= carSpeed * 0.5;
}

function right() {
    if (!running || paused) return;
    player.x += carSpeed * 0.5;
}


function accelerateStart() {
    accelerating = true;
}

function accelerateStop() {
    accelerating = false;
}

function brakeStart() {
    braking = true;
}

function brakeStop() {
    braking = false;
}


document.addEventListener("keydown", e => {
    if (paused) return;

    if (e.key === "ArrowLeft") left();
    if (e.key === "ArrowRight") right();

    if (e.key === "ArrowUp") accelerating = true;
    if (e.key === "ArrowDown") braking = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowUp") accelerating = false;
    if (e.key === "ArrowDown") braking = false;
});


function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 60),
        y: -120,
        w: 50,
        h: 100,
        speed: 4 + level * 0.5
    });
}


function drawRoad() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    roadY += paused ? 0 : carSpeed * 0.8;
    if (roadY > 60) roadY = 0;

    for (let i = 0; i < canvas.height; i += 60) {
        ctx.fillRect(canvas.width / 2, i + roadY, 5, 40);
    }
}

function drawCar(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 50, 100);

    ctx.fillStyle = "#222";
    ctx.fillRect(x + 8, y + 10, 34, 20);

    wheelRotation += paused ? 0 : 0.3;

    let offset = Math.sin(wheelRotation) * 2;

    ctx.fillStyle = "black";
    ctx.fillRect(x - 6, y + 15 + offset, 8, 20);
    ctx.fillRect(x - 6, y + 65 - offset, 8, 20);
    ctx.fillRect(x + 48, y + 15 - offset, 8, 20);
    ctx.fillRect(x + 48, y + 65 + offset, 8, 20);
}


function endGame() {
    running = false;
    gameOver = true;
}


function drawEnemies() {
    enemies.forEach((e, i) => {
        e.y += paused ? 0 : e.speed;

        drawCar(e.x, e.y, "gray");

        if (
            player.x < e.x + e.w &&
            player.x + player.w > e.x &&
            player.y < e.y + e.h &&
            player.y + player.h > e.y
        ) {
            endGame();
        }

        if (e.y > canvas.height) {
            enemies.splice(i, 1);
            score += 10;

            if (score % 100 === 0) level++;

            updateUI();
        }
    });
}


function updateUI() {
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("speed").innerText = Math.floor(carSpeed);
}


function loop() {
    if (!running) return;

  
    if (accelerating && carSpeed < maxSpeed) {
        carSpeed += 0.5;
    }

    if (braking && carSpeed > minSpeed) {
        carSpeed -= 0.7;
    }

    
    if (!accelerating && !braking && carSpeed > baseSpeed) {
        carSpeed -= 0.1;
    }

    drawRoad();
    drawCar(player.x, player.y, carColor);
    drawEnemies();

    updateUI();

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";

        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 60);
        return;
    }

    if (!paused && Math.random() < 0.03) {
        spawnEnemy();
    }

    requestAnimationFrame(loop);
}