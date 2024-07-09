import { setupChatRoom } from './chat_room.js';
import { parseJWT } from './auth.js';

export function setupChat() {    
    const jwt = localStorage.getItem('jwt');    
    if (!jwt) {
        console.error('JWT not found');
        return;
    }
    const decoded = parseJWT(jwt);
    const username = decoded.username;

    document.querySelector('#room-name-input').focus();
    
    function joinRoom() {
        var roomName = document.querySelector('#room-name-input').value;

        if (!roomName) {
            alert('Room name is required');
            return;
        }
        // URL'yi değiştir
        history.pushState({}, '', `chat_room?room_name=${encodeURIComponent(roomName)}&username=${encodeURIComponent(username)}`);


        // İçeriği değiştir ve dinamik içeriği ayarla
        fetch('../pages/chat_room.html')
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data;
                setupChatRoom(); // Dinamik içeriği ayarla
            });
    }

    document.querySelector('#room-name-submit').onclick = joinRoom;

    document.querySelector('#room-name-input').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            joinRoom();
        }
    });

    // Sayfa yüklendiğinde URL'deki bilgileri kullanarak sohbet odasını ayarla
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('room_name');

        if (roomName) {
            document.querySelector('#room-name-input').value = decodeURIComponent(roomName);
        }
    };
}
