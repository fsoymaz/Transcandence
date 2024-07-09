export function setupGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 7;
    let ballSpeedY = 7;

    const initialBallSpeedX = 7; // Initial ball speed along X-axis
    const initialBallSpeedY = 7; // Initial ball speed along Y-axis

    const paddleWidth = 15;
    const paddleHeight = 130;
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 15; // Paddle hareket hızı

    let player1Score = 0;
    let player2Score = 0;

    function drawEverything() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paddle 1
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

        // Paddle 2
        ctx.fillStyle = 'green';
        ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        // Ball
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
        ctx.fill();

        // Scores
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(player2Score.toString(), canvas.width / 4, canvas.height - 50);
        ctx.fillText(player1Score.toString(), (canvas.width * 3) / 4, canvas.height - 50);
    }

    function moveEverything() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with walls
        if (ballX >= canvas.width || ballX <= 0) {
            if (ballX >= canvas.width) {
                // Left side scores
                player2Score++;
                resetBall('left');
            } else if (ballX <= 0) {
                // Right side scores
                player1Score++;
                resetBall('right');
            }
        }

        // Ball collision with top/bottom walls
        if (ballY >= canvas.height || ballY <= 0) {
            ballSpeedY = -ballSpeedY; // Reverse ball's Y direction
        }

        // Paddle 1 movement (left side)
        if (keys['w'] && paddle1Y > 0) {
            paddle1Y -= paddleSpeed;
        }
        if (keys['s'] && paddle1Y < canvas.height - paddleHeight) {
            paddle1Y += paddleSpeed;
        }

        // Paddle 2 movement (right side)
        if (keys['ArrowUp'] && paddle2Y > 0) {
            paddle2Y -= paddleSpeed;
        }
        if (keys['ArrowDown'] && paddle2Y < canvas.height - paddleHeight) {
            paddle2Y += paddleSpeed;
        }

        // Ball collision with paddles
        if (ballX <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight && ballSpeedX < 0) {
            // Increase ball speed when hitting paddle 1
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.1; // Increase speed by 10%
            ballSpeedY *= 1.1; // Increase speed by 10%
        }

        if (ballX >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight && ballSpeedX > 0) {
            // Increase ball speed when hitting paddle 2
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.1; // Increase speed by 10%
            ballSpeedY *= 1.1; // Increase speed by 10%
        }
    }

    // Game state and key controls
    const keys = {};
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Reset ball position and speed
    function resetBall(side) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = initialBallSpeedX;
        ballSpeedY = initialBallSpeedY;
    }

    // Game loop
    function gameLoop() {
        moveEverything();
        drawEverything();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
