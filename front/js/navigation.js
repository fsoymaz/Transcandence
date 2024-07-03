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

    document.getElementById('chat_room-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('chat_room', true);
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
        logout().then(() => {
            loadPage('home', true);
        });
    });
}
