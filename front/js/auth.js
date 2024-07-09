import { loadPage } from "./pageLoader.js";

export function setupLoginForm() {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      fetch("https://43server.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            if (parseJWT(data.token).twofactoractive)
                loadPage("2fa", true);
            else
            {
                loadPage("home", true);
                localStorage.setItem('jwt', data.token);
            }
          } else {
            console.error("JWT not found in response");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

export function setupRegisterForm() {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch("https://43server.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Register failed");
          }
          return response.json();
        })
        .then((data) => {
          loadPage("login", true);
        })
        .catch((error) => {
          console.error("Registration error:", error);
        });
    });
}

export function logout() {
  fetch("https://43server.com/api/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      localStorage.removeItem("jwt");
      loadPage("index", true);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function base64UrlDecode(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
}

export function parseJWT(token) {
  console.log("parseJWT token: " + token);
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const payload = parts[1];
  const decodedPayload = base64UrlDecode(payload);
  const jsonPayload = decodeURIComponent(
    decodedPayload
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const parsedPayload = JSON.parse(jsonPayload);
  console.log("Parsed JWT Payload:", parsedPayload); // Add this line to log the parsed payload
  return parsedPayload;
}
