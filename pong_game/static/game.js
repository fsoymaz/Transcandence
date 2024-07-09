import { setupGame } from './gameSetup.js';

document.getElementById('create-room-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const roomName = document.getElementById('create-room-name').value;
    joinRoom(roomName);
});

document.getElementById('join-room-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const roomName = document.getElementById('join-room-name').value;
    joinRoom(roomName);
});

function joinRoom(roomName) {
    const gameSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/game/' + roomName + '/'
    );

    gameSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const action = data['action'];
        console.log('Received action:', action);
        // Handle the action received from the server
    };

    gameSocket.onopen = function(e) {
        console.log('WebSocket connection established.');
        document.getElementById('room-actions').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
    };

    gameSocket.onerror = function(e) {
        console.error('WebSocket error:', e);
    };

    gameSocket.onclose = function(e) {
        console.error('WebSocket connection closed:', e);
    };

    document.addEventListener('keydown', (e) => {
        gameSocket.send(JSON.stringify({
            'action': e.key
        }));
    });

    setupGame();
}
