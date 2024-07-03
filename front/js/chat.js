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
    history.pushState({}, '', `chat_room.html?room_name=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userName)}`);

    // İçeriği değiştir ve dinamik içeriği ayarla
    fetch('pages/chat_room.html')
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML = data;
            setupChatRoom(); // Dinamik içeriği ayarla
        });
};
