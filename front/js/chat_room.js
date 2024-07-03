export function setupChatRoom() {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            roomName: params.get('room_name'),
            userName: params.get('username')
        };
    }

    function scrollToBottom() {
        let objDiv = document.getElementById("chat-messages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const { roomName, userName } = getQueryParams();

        if (!roomName || !userName) {
            alert('Room name and username are required');
            window.location.href = 'join_room.html';
            return;
        }

        document.getElementById('username-display').innerText = `Your username: ${userName}`;

        const chatSocket = new WebSocket(`ws://${'localhost:8000'}/ws/${roomName}/`);

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.message) {
                document.querySelector('#chat-messages').innerHTML += `<b>${data.username}</b>: ${data.message}<br>`;
                scrollToBottom();
            } else {
                alert('The message is empty!');
            }
        };

        chatSocket.onclose = function(e) {
            console.log('The socket closed unexpectedly');
        };

        document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;

            chatSocket.send(JSON.stringify({
                'message': message,
                'username': userName,
                'room': roomName
            }));

            messageInputDom.value = '';
        };
    });
}
