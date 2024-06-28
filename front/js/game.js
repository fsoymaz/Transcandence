document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;

    // Pedal özellikleri
    const paddleWidth = 10;
    const paddleHeight = 100;
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;

    function drawEverything() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw paddles
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

        ctx.fillStyle = 'green';
        ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        // Draw ball
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function moveEverything() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX >= canvas.width || ballX <= 0) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballY >= canvas.height || ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function gameLoop() {
        moveEverything();
        drawEverything();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
