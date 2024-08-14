// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 200;

let player = {
    x: 50,
    y: 150,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 1,
    jumpStrength: -15,
    isJumping: false,
    image: new Image()
};

player.image.src = 'your-player-image-url.png'; // Replace with your picture URL

let obstacles = [];
let score = 0;
let obstacleCount = 10; // Reduced number of obstacles to 10
let gameOver = false;
const initialObstacleSpeed = 5; // Set initial obstacle speed
let obstacleSpeed = initialObstacleSpeed; // Variable to control the obstacle speed
let obstacleFrequency = 90; // Set how often obstacles are created (in frames)
let frameCount = 0;

// Create obstacles
function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 150,
        width: 20, // Thin rectangle width
        height: 50,
        color: '#FFB6C1' // Light pink
    };
    obstacles.push(obstacle);
}

// Draw obstacle as a thin rectangle
function drawObstacle(obstacle) {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Create obstacles at a consistent frequency
    frameCount++;
    if (frameCount % obstacleFrequency === 0 && obstacles.length < obstacleCount) {
        createObstacle();
    }

    // Obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById('score-display').innerText = `Obstacles Passed: ${score}`;
        }

        // Collision detection
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            resetGame();
        }

        drawObstacle(obstacle);
    });

    if (!gameOver) {
        if (score < obstacleCount) {
            requestAnimationFrame(gameLoop);
        } else {
            showBirthdayMessage();
        }
    }
}

// Jumping
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !player.isJumping) {
        player.velocityY = player.jumpStrength;
        player.isJumping = true;
    }
});

// Start the game
gameLoop();

// Reset game on collision
function resetGame() {
    score = 0;
    obstacles = [];
    frameCount = 0; // Reset frame count
    obstacleSpeed = initialObstacleSpeed; // Reset obstacle speed to initial value
    document.getElementById('score-display').innerText = 'Obstacles Passed: 0';
    gameLoop();
}

// Show birthday message
function showBirthdayMessage() {
    gameOver = true;
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('birthday-message').classList.remove('hidden');
    startCountdown();

     // Play birthday song
     const audio = document.getElementById('birthday-song');
     audio.play();
}

// Countdown timer
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    const endDate = new Date('August 15, 2024 00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance <= 0) {
            countdownElement.innerHTML = 'It\'s your birthday!';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
}
