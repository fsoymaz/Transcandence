import { setupChatRoom } from './chat_room.js';

export function setupChat() {
    document.querySelector('#room-name-input').focus();
    document.querySelector('#room-name-submit').onclick = function(e) {
        var roomName = document.querySelector('#room-name-input').value;
        var userName = document.querySelector('#username-input').value;
        console.log("room + user" + roomName, userName);

        if (!roomName || !userName) {
            alert('Room name and username are required');
            return;
        }

        // URL'yi değiştir
        history.pushState({}, '', `chat_room?room_name=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userName)}`);

        // İçeriği değiştir ve dinamik içeriği ayarla
        fetch('../pages/chat_room.html')
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data;
                setupChatRoom(); // Dinamik içeriği ayarla
            });
    };

    // Sayfa yüklendiğinde URL'deki bilgileri kullanarak sohbet odasını ve kullanıcı adını ayarla
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('room_name');
        const userName = urlParams.get('username');

        if (roomName && userName) {
            document.querySelector('#room-name-input').value = decodeURIComponent(roomName);
            document.querySelector('#username-input').value = decodeURIComponent(userName);
        }
    };
}