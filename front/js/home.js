// home.js

export function setupHome() {
    // Add any JavaScript needed for the home page
    console.log("Home page setup complete.");

    // Example: Adding some dynamic content to the home page
    const welcomeSection = document.querySelector('section');
    const dynamicContent = document.createElement('p');
    dynamicContent.textContent = "This content was added dynamically!";
    welcomeSection.appendChild(dynamicContent);
}
