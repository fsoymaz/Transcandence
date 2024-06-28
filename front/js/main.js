document.addEventListener('DOMContentLoaded', function() {
    setupNavLinks();
    window.addEventListener('popstate', function(event) {
        const page = getPageFromURL();
        loadPage(page, false);
    });

    // Başlangıç sayfasını yükle
    const initialPage = getPageFromURL();
    loadPage(initialPage, false);
});

function setupNavLinks() {
    document.getElementById('home-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('index', true);
    });

    document.getElementById('register-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('register', true);
    });

    document.getElementById('login-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('login', true);
    });

    document.getElementById('game-link').addEventListener('click', function(event) {
        event.preventDefault();
        if (localStorage.getItem('jwt')) {
            loadPage('game', true);
        } else {
            alert('Please log in to access the game.');
            loadPage('login', true);
        }
    });

    document.getElementById('logout-link').addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
}

// URL'den sayfa adını al
function getPageFromURL() {
    const hash = window.location.hash;
    if (hash === '#') {
        return 'index'; // Varsayılan sayfa
    } else {
        return hash.slice(1); // "#" karakterini kaldır
    }
}

function loadPage(page, updateHistory) {
    const content = document.getElementById('content');

    if (page === 'game' && !localStorage.getItem('jwt')) {
        alert('Please log in to access the game.');
        loadPage('login', true);
        return;
    }

    // Sayfanın var olup olmadığını kontrol et
    const pageExists = ['index', 'register', 'login', 'game'].includes(page); // Burada sayfaların var olduğunu varsayıyorum, mevcut duruma göre güncelleyebilirsiniz
    if (!pageExists) {
        console.error('Page not found');
        content.innerHTML = '<h1>Page not found</h1>';
        return;
    }

    // Sayfa varsa içeriği yükle
    content.innerHTML = ''; // İçeriği temizle
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
            if (updateHistory) {
                history.pushState({ page: page }, null, `#${page}`);
            }
            setupDynamicContent(page);
        })
        .catch(error => {
            console.error("Error:", error);
            content.innerHTML = '<h1>Page not found</h1>';
        });
}

function setupDynamicContent(page) {
    if (page === 'login') {
        setupLoginForm();
    } else if (page === 'register') {
        setupRegisterForm();
    } else if (page === 'game') {
        setupGame();
    }
}

function setupLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://fsoymaz.tech/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then(response => {
            console.log('HTTP Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            if (data.token) {
                console.log('Success:', data);
                localStorage.setItem('jwt', data.token);
                const decodedJWT = parseJWT(data.token);
                console.log(decodedJWT);
                loadPage('index', true);
            } else {
                console.error('JWT not found in response');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

function setupRegisterForm() {
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://fsoymaz.tech/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Register failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Registration successful');
            loadPage('login', true);
        })
        .catch(error => {
            console.error('Registration error:', error);
        });
    });
}

function setupGame() {
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

        // Ball collision with walls
        if (ballX >= canvas.width || ballX <= 0) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballY >= canvas.height || ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if (ballX <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballX >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }
    }

    function gameLoop() {
        moveEverything();
        drawEverything();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

function logout() {
    fetch('https://fsoymaz.tech/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        localStorage.removeItem('jwt');
        loadPage('index', true);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function base64UrlDecode(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
}


function base64UrlDecode(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
}

function parseJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);
    const jsonPayload = decodeURIComponent(decodedPayload.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}







//// base64UrlDecode ve parseJWT fonksiyonları
//function base64UrlDecode(base64Url) {
//    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//    var decodedData = atob(base64);
//    return decodedData;
//}

//function parseJWT(token) {
//    var parts = token.split('.');
//    if (parts.length !== 3) {
//        throw new Error('Invalid JWT token');
//    }

//    var payload = parts[1];
//    var decodedPayload = base64UrlDecode(payload);
//    var jsonPayload = decodeURIComponent(decodedPayload.split('').map(function(c) {
//        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//    }).join(''));

//    return JSON.parse(jsonPayload);
//}

//// Sayfa yükleme ve navigasyon işlemleri
//document.addEventListener('DOMContentLoaded', function() {
//    setupNavLinks();
//    window.addEventListener('popstate', function(event) {
//        const page = getPageFromURL();
//        loadPage(page, false);
//    });

//    // Başlangıç sayfasını yükle
//    const initialPage = getPageFromURL();
//    loadPage(initialPage, false);
//});

//function setupNavLinks() {
//    document.getElementById('home-link').addEventListener('click', function(event) {
//        event.preventDefault();
//        loadPage('index', true);
//    });

//    document.getElementById('register-link').addEventListener('click', function(event) {
//        event.preventDefault();
//        loadPage('register', true);
//    });

//    document.getElementById('login-link').addEventListener('click', function(event) {
//        event.preventDefault();
//        loadPage('login', true);
//    });

//    document.getElementById('game-link').addEventListener('click', function(event) {
//        event.preventDefault();
//        if (localStorage.getItem('jwt')) {
//            loadPage('game', true);
//        } else {
//            alert('Please log in to access the game.');
//            loadPage('login', true);
//        }
//    });

//    document.getElementById('logout-link').addEventListener('click', function(event) {
//        event.preventDefault();
//        logout();
//    });
//}

//function getPageFromURL() {
//    const hash = window.location.hash;
//    if (hash === '#') {
//        return 'index'; // Varsayılan sayfa
//    } else {
//        return hash.slice(1); // "#" karakterini kaldır
//    }
//}

//function loadPage(page, updateHistory) {
//    const content = document.getElementById('content');

//    if (page === 'game' && !localStorage.getItem('jwt')) {
//        alert('Please log in to access the game.');
//        loadPage('login', true);
//        return;
//    }

//    const pageExists = ['index', 'register', 'login', 'game'].includes(page);
//    if (!pageExists) {
//        console.error('Page not found');
//        content.innerHTML = '<h1>Page not found</h1>';
//        return;
//    }

//    content.innerHTML = '';
//    fetch(`${page}.html`)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Page not found');
//            }
//            return response.text();
//        })
//        .then(html => {
//            content.innerHTML = html;
//            if (updateHistory) {
//                history.pushState({ page: page }, null, `#${page}`);
//            }
//            setupDynamicContent(page);
//        })
//        .catch(error => {
//            console.error("Error:", error);
//            content.innerHTML = '<h1>Page not found</h1>';
//        });
//}

//function setupDynamicContent(page) {
//    if (page === 'login') {
//        loadScript('js/login.js', function() {
//            setupLoginForm();
//        });
//    } else if (page === 'register') {
//        loadScript('js/register.js', function() {
//            setupRegisterForm();
//        });
//    } else if (page === 'game') {
//        loadScript('js/game.js', function() {
//            setupGame();
//        });
//    }
//}

//function loadScript(src, callback) {
//    const script = document.createElement('script');
//    script.src = src;
//    script.onload = callback;
//    document.head.appendChild(script);
//}

//function logout() {
//    fetch('http://45.157.16.18:8000/api/logout/', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//        }
//    })
//    .then(response => {
//        if (!response.ok) {
//            throw new Error('Logout failed');
//        }
//        localStorage.removeItem('jwt');
//        loadPage('index', true);
//    })
//    .catch(error => {
//        console.error('Error:', error);
//    });
//}
