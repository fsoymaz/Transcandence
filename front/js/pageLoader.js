export function getPageFromURL() {
    const hash = window.location.hash;
    return hash === '#' ? 'index' : hash.slice(1);
}

export function loadPage(page, updateHistory) {
    const content = document.getElementById('content');

    if (page === 'game' && !localStorage.getItem('jwt')) {
        alert('Please log in to access the game.');
        loadPage('login', true);
        return;
    }

    const pageExists = ['index', 'register', 'login', 'game', 'home'].includes(page);
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

function setupDynamicContent(page) {
    if (page === 'login') {
        import('./auth.js').then(module => module.setupLoginForm());
    } else if (page === 'register') {
        import('./auth.js').then(module => module.setupRegisterForm());
    } else if (page === 'game') {
        import('./game.js').then(module => module.setupGame());
    } else if (page === 'home') {
        import('./home.js').then(module => module.setupHome());
    }
}
