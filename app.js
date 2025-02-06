document.addEventListener('DOMContentLoaded', function () {
    const dino = document.querySelector('.dino');
    const grid = document.querySelector('.grid');
    let gravity = 0.9;
    let isJumping = false;
    let position = 0;
    let isGameOver = false;

    // Detect if it's a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    function startGame() {
        // Start the game
        document.getElementById("alert").textContent = "Game Started!";
        console.log("Game started!");
        generateObstacles();
    }

    function control(e) {
        if (e.code === "Space") {
            if (!isJumping) {
                jump();
            }
        }
    }

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let count = 0;

        let timerId = setInterval(function () {
            if (count === 15) {
                clearInterval(timerId);

                let downTimerId = setInterval(function () {
                    if (count === 0) {
                        clearInterval(downTimerId);
                        isJumping = false;
                    }
                    position -= 5;
                    count--;
                    position *= gravity;
                    dino.style.bottom = position + 'px';
                }, 20);
            }

            position += 30;
            count++;
            position = position * gravity;
            dino.style.bottom = position + 'px';
        }, 20);
    }

    function generateObstacles() {
        if (!isGameOver) {
            let randomTime = Math.random() * 4000;
            let obstaclePosition = 1000;
            const obstacle = document.createElement('div');
            obstacle.classList.add('obstacle');
            grid.appendChild(obstacle);
            obstacle.style.left = obstaclePosition + 'px';

            let timerId = setInterval(function () {
                if (obstaclePosition > 0 && obstaclePosition < 60 && position < 30) {
                    clearInterval(timerId);
                    gameOver();
                }
                obstaclePosition -= 10;
                obstacle.style.left = obstaclePosition + 'px';

                if (obstaclePosition < -60) {
                    grid.removeChild(obstacle);
                }
            }, 20);

            if (!isGameOver) {
                setTimeout(generateObstacles, randomTime);
            }
        }
    }

    function gameOver() {
        isGameOver = true;
        document.getElementById("alert").textContent = "Game Over!";
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => obstacle.remove());
        setTimeout(resetGame, 2000);
    }

    function resetGame() {
        isGameOver = false;
        isJumping = false;
        position = 0;

        let dino = document.querySelector('.dino');
        if (!dino) {
            dino = createDino();
        }
        dino.style.bottom = '0px';

        document.getElementById("alert").textContent = isMobile
            ? "Tap to Start Game"
            : "Press Space to Start";
        document.getElementById("alert").style.display = "block";

        const startHandler = (e) => {
            if (e.type === "keydown" && e.code === "Space" || e.type === "touchstart") {
                startGame();
                document.getElementById("alert").style.display = "none";
                document.removeEventListener('keydown', startHandler);
                document.removeEventListener('touchstart', startHandler);
            }
        };

        document.addEventListener('keydown', startHandler);
        document.addEventListener('touchstart', startHandler);
    }

    // Add both keydown and touchstart listeners for starting the game and jumping
    document.addEventListener('keydown', control);
    document.addEventListener('touchstart', function () {
        if (!isGameOver && !isJumping) {
            jump();
        }
    });

    // Set the initial alert text based on device type
    document.getElementById("alert").textContent = isMobile
        ? "Tap to Start Game"
        : "Press Space to Start";

    generateObstacles();
});