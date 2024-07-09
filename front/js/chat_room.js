let chatSocket = null;

export function setupChatRoom() {
    console.log("Setting up chat room...");

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

    const { roomName, userName } = getQueryParams();
    console.log("Room Name:", roomName, "User Name:", userName);

    if (!roomName || !userName) {
        alert('Room name and username are required');
        window.location.href = 'join_room.html';
        return;
    }

    document.getElementById('username-display').innerText = `Your username: ${userName}`;

    if (chatSocket && (chatSocket.readyState === WebSocket.OPEN || chatSocket.readyState === WebSocket.CONNECTING)) {
        console.log("WebSocket is already open or connecting.");
    } else {
        chatSocket = new WebSocket(`wss://43server.com/ws/${roomName}/`);

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.message) {
                document.querySelector('#chat-messages').innerHTML += `<b>${data.username}</b>: ${data.message}<br>`;
                scrollToBottom();
            }
            
        };

        chatSocket.onclose = function(e) {
            console.log('The socket closed unexpectedly');
        };
    }

    function sendMessage() {
        console.log("Submit button clicked!");

        if (chatSocket.readyState === WebSocket.OPEN) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;

            chatSocket.send(JSON.stringify({
                'message': message,
                'username': userName,
                'room': roomName
            }));

            messageInputDom.value = '';
        } else {
            alert('WebSocket connection is not open.');
        }
    }

    document.querySelector('#chat-message-submit').onclick = sendMessage;

    document.querySelector('#chat-message-input').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupChatRoom);
