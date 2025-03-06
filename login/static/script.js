document.addEventListener("DOMContentLoaded", function () {
    const commonPasswords = ["123456", "password", "123456789", "qwerty", "abc123", "password1"];
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const submitButton = document.getElementById("submitBtn");

    // Prefill Email (if stored in local storage)
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
        emailField.value = storedEmail;
    }

    // Prevent common passwords
    passwordField.addEventListener("input", function () {
        if (commonPasswords.includes(passwordField.value)) {
            passwordField.setCustomValidity("This password is too common.");
        } else {
            passwordField.setCustomValidity("");
        }
    });

    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailField.value;
        const password = passwordField.value;

        fetch("/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => { throw new Error(data.error || "Login failed"); });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect_url; // Redirect on success
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Login failed: " + error.message);
        });
    });

    function getCSRFToken() {
        let cookieValue = null;
        document.cookie.split(";").forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                cookieValue = cookie.substring("csrftoken=".length);
            }
        });
        return cookieValue;
    }
});

