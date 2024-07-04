// pageLoader.js

export function getPageFromURL() {
    const hash = window.location.hash;
    const defaultPage = 'home'; // Varsayılan olarak yönlendirilecek sayfa

    if (hash === '' || hash === '#') {
        window.location.href = `#${defaultPage}`; // Sayfa yüklendiğinde varsayılan sayfaya yönlendirme
        return defaultPage;
    } else {
        return hash.slice(1);
    }
}

function setupDynamicContent(page) {
    if (page === 'login') {
        import('./auth.js').then(module => module.setupLoginForm());
    } else if (page === 'register') {
        import('./auth.js').then(module => module.setupRegisterForm());
    } else if (page === 'game') {
        import('./game.js').then(module => module.setupGame());
    } else if (page === 'home') {
        import('./home.js').then(module => module.setupHome());
    } else if (page === 'chat') {
        import('./chat.js').then(module => module.setupChat());
    } else if (page === 'chat_room') {
        import('./chat_room.js').then(module => module.setupChatRoom());
    }
}

// pageLoader.js dosyasındaki loadPage fonksiyonunu kullanarak chat_room.html içeriğini yükleyelim
export function loadPage(page, updateHistory) {
    const content = document.getElementById('content');

    if (page === 'game' && !localStorage.getItem('jwt')) {
        alert('Please log in to access the game.');
        loadPage('login', true);
        return;
    }

    const pageExists = ['index', 'register', 'login', 'game', 'home', 'chat', 'chat_room'].includes(page);
    if (!pageExists) {
        console.error('Page not found');
        content.innerHTML = '<h1>Page not found</h1>';
        return;
    }

    content.innerHTML = '';
    fetch(`pages/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
            if (updateHistory) {
                history.pushState({ page: page }, null, `#${page}`);
            }
            setupDynamicContent(page);
        })
        .catch(error => {
            console.error("Error:", error);
            content.innerHTML = '<h1>Page not found</h1>';
        });
}

// Sayfa yüklendiğinde URL'deki hash değerine göre sayfayı yükle
window.onload = function() {
    const page = getPageFromURL();
    loadPage(page, false);
};

// URL'deki hash değeri değiştiğinde sayfayı yeniden yükle
window.onhashchange = function() {
    const page = getPageFromURL();
    loadPage(page, false);
};