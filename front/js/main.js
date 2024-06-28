document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to load content based on hash change or initial load
    function loadContent(pageId) {
        // Simulate loading content dynamically
        let content = '';

        switch(pageId) {
            case 'home-link':
                content = '<h2>Home Page Content</h2>';
                break;
            case 'register-link':
                content = '<h2>Register Page Content</h2>';
                break;
            case 'login-link':
                content = '<h2>Login Page Content</h2>';
                break;
            case 'game-link':
                content = '<h2>Game Page Content</h2>';
                break;
            case 'logout-link':
                content = '<h2>Logout Page Content</h2>';
                break;
            default:
                content = '<h2>Default Page Content</h2>';
        }

        // Update the content div
        contentDiv.innerHTML = content;
    }

    // Initial load of content based on current hash
    loadContent(window.location.hash.substring(1));

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior

            // Load content based on link ID
            loadContent(link.id);
        });
    });
});
