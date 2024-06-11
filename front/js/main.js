document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('home-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('index');
    });

    document.getElementById('register-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('register');
    });

    document.getElementById('login-link').addEventListener('click', function(event) {
        event.preventDefault();
        loadPage('login');
    });

    window.addEventListener('popstate', function(event) {
        loadPage(location.pathname.substring(1)); // URL'den sayfa yolu alınır
    });

    loadPage('index');
});

function loadPage(page) {
    const content = document.getElementById('content');

    fetch(page + ".html")
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            history.pushState(null, null, page); // URL'yi güncelle
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
