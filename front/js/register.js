document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Formun varsayılan davranışını engelle

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Kayıt bilgilerini JSON formatına dönüştür
        const userData = {
            username: username,
            email: email,
            password: password
        };

        // POST isteği yaparak kayıt işlemini gerçekleştir
        fetch('http://45.157.16.18:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Register failed');
            }
            return response.json();
        })
        .then(data => {
            // Kayıt başarılı ise işlenecek kod
            console.log('Registration successful');
            // İsteğe bağlı olarak kullanıcıyı başka bir sayfaya yönlendirebilirsiniz
        })
        .catch(error => {
            // Hata durumunda işlenecek kod
            console.error('Registration error:', error);
            // İsteğe bağlı olarak kullanıcıya bir hata mesajı gösterebilirsiniz
        });
    });
});
