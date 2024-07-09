// profile.js

export function setupProfile(code) {
  const profileContent = `
        <h1>User Profile</h1>
        <p>Welcome to your profile page!</p>
        <div id="profile-info">
            <p><strong>UID:</strong> u-s4t2ud-8bf0ec75a923d1415568f9d9b4106c72e2a74b478581ccbe60355e04ee0aff1f</p>
            <p><strong>Secret:</strong> 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</p>
            <p><strong>Code:</strong> ${code}</p>
        </div>
        <button id="logout-button">Logout</button>
    `;

  const content = document.getElementById("content");
  content.innerHTML = profileContent;

  document.getElementById("logout-button").addEventListener("click", () => {
    // Logout işlemi için gerekli kodlar
    localStorage.removeItem("jwt");
    alert("You have been logged out.");
    window.location.href = "#login";
  });
}
