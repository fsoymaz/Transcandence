import { loadPage } from './pageLoader.js';

export function verifysCode() {
    document.getElementById('verifyButton').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const _bool = document.getElementById('_bool').checked; // Assuming it's a checkbox

        fetch('https://43server.com/api/2faactive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                twofactoractive: _bool,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
                loadPage("home", true);
            } else if (data.error) {
                console.log(data.error);
            }
        })
        .catch(error => console.log('Error:', error));
    });
}
