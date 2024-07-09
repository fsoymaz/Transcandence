// navigation.js

import { loadPage } from './pageLoader.js';
import { logout } from './auth.js';

export function setupNavLinks() {
    document.getElementById('home-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('home', true);
    });

    document.getElementById('register-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('register', true);
    });

    document.getElementById('login-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('login', true);
    });

    document.getElementById('chat-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('chat', true); // This should load the general chat page
    });

    // document.getElementById('2fa-link').addEventListener('click', function(event) {
    //     event.preventDefault();
    //     loadPage('2fa', true); // This should load the general chat page
    // });

    document.getElementById('2faactive-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('2faactive', true); // This should load the general chat page
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

    document.getElementById('profile-link').addEventListener('click', function(event) {
        event.preventDefault();
        if (localStorage.getItem('jwt')) {
            // Örneğin, rastgele bir code değeri oluşturmak için
            const code = '0fa0089573227b62979731ca7738e97fdf6eaed0adda1b28229d142fe80f1cf2';
            window.location.href = `https://43server.com/profile?code=${code}`;
        } else {
            alert('Please log in to access the profile.');
            loadPage('login', true);
        }
    });
    

    document.getElementById('logout-link').addEventListener('click', function(event) {
        event.preventDefault();
        logout().then(() => {
            loadPage('home', true);
        });
    });
}
