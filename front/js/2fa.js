import { loadPage } from './pageLoader.js';
import { parseJWT } from './auth.js';

export function verifyCode() {
    const correctCode = "123456"; // Doğru kod (normalde bu sunucu tarafından oluşturulur ve kullanıcıya gönderilir)

    document.getElementById('verifyButton').addEventListener('click', function() {
        const userCode = document.getElementById('userCode').value;
        const message = document.getElementById('message');
        let _cookie = document.cookie;
        const parse_cookie = parseJWT(_cookie);
        fetch('https://43server.com/api/2fa/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: parse_cookie.username,
                userCode: userCode,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);
            if (data.token) {
                message.textContent = "Verification successful!";
                message.style.color = "green";
                localStorage.setItem('jwt', data.token);
                loadPage("home", true);

            } else {
                message.textContent = "Invalid code. Please try again.";
                message.style.color = "red";
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            message.textContent = "Service Error";
            message.style.color = "red";
        });
    });
}