export function setupGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 10;
    let ballSpeedY = 10;

    const paddleWidth = 10;
    const paddleHeight = 100;
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 10; // Paddle hareket hızı

    function drawEverything() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

        ctx.fillStyle = 'green';
        ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function moveEverything() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Topun hareket sınırlarını kontrol etmek
        if (ballX >= canvas.width || ballX <= 0) {
            if (ballX >= canvas.width) {
                // Sol taraftan gol oldu
                resetBall('left'); // Topu sol taraftan başlat
            } else if (ballX <= 0) {
                // Sağ taraftan gol oldu
                resetBall('right'); // Topu sağ taraftan başlat
            }
        }

        // Topun y ekseninde hareket sınırlarını kontrol etmek
        if (ballY >= canvas.height || ballY <= 0) {
            ballSpeedY = -ballSpeedY; // Topun hızını tersine çevir
        }

        // Paddle 1 hareketi (sol taraf)
        if (keys['w'] && paddle1Y > 0) {
            paddle1Y -= paddleSpeed;
        }
        if (keys['s'] && paddle1Y < canvas.height - paddleHeight) {
            paddle1Y += paddleSpeed;
        }

        // Paddle 2 hareketi (sağ taraf)
        if (keys['ArrowUp'] && paddle2Y > 0) {
            paddle2Y -= paddleSpeed;
        }
        if (keys['ArrowDown'] && paddle2Y < canvas.height - paddleHeight) {
            paddle2Y += paddleSpeed;
        }

        // Topun pedallara denk gelmesi durumunda hareket yönünü değiştirme
        if (ballX <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight && ballSpeedX < 0) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballX >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight && ballSpeedX > 0) {
            ballSpeedX = -ballSpeedX;
        }
    }

    // Oyun durumu ve tuş kontrolü
    const keys = {};
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function resetBall(side) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;

        if (side === 'left') {
            ballSpeedX = -ballSpeedX; // Topun hareket yönünü değiştir
        } else if (side === 'right') {
            ballSpeedX = -ballSpeedX; // Topun hareket yönünü değiştir
        }

        setTimeout(() => {
            ballSpeedX = -ballSpeedX; // Topun hareket yönünü değiştir
        }, 500); // 0.5 saniye beklet
    }

    function gameLoop() {
        moveEverything();
        drawEverything();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
