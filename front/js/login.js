function base64UrlDecode(base64Url) {
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var decodedData = atob(base64);
  return decodedData;
}

function parseJWT(token) {
  var parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }

  var payload = parts[1];
  var decodedPayload = base64UrlDecode(payload);
  var jsonPayload = decodeURIComponent(decodedPayload.split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => {
      console.log('HTTP Status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('API Response:', data);
      if (data.token) {
        console.log('Success:', data);
        localStorage.setItem('jwt', data.token);
        var decodedJWT = parseJWT(data.token);
        console.log(decodedJWT);
      } else {
        console.error('JWT not found in response');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });    
  });
});
