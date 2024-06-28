import { loadPage } from './pageLoader.js';

export function setupLoginForm() {
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
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                const decodedJWT = parseJWT(data.token);
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

export function setupRegisterForm() {
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
            loadPage('login', true);
        })
        .catch(error => {
            console.error('Registration error:', error);
        });
    });
}

export function logout() {
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
