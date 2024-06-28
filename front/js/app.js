import { setupNavLinks } from './navigation.js';
import { loadPage, getPageFromURL } from './pageLoader.js';

document.addEventListener('DOMContentLoaded', function() {
    setupNavLinks();
    window.addEventListener('popstate', function(event) {
        const page = getPageFromURL();
        loadPage(page, false);
    });

    // Başlangıç sayfasını yükle
    const initialPage = getPageFromURL();
    loadPage(initialPage, false);
});
