console.log("scrip.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    const otpInput = document.getElementById("otp-input");
    const continueBtn = document.getElementById("continue-btn");
    const countdownElement = document.getElementById("countdown");

    // Initially hide all screens except the notification screen
    document.getElementById('otp-screen').classList.add('hidden');
    document.getElementById('alternative-screen').classList.add('hidden');
    document.getElementById('notification-screen').classList.remove('hidden');

    if (otpInput && continueBtn && countdownElement) {
        otpInput.addEventListener("input", function () {
            if (otpInput.value.length === 6) {
                continueBtn.removeAttribute("disabled");
                continueBtn.classList.remove("cursor-not-allowed", "bg-blue-400");
                continueBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
            } else {
                continueBtn.setAttribute("disabled", "true");
                continueBtn.classList.add("cursor-not-allowed", "bg-blue-400");
                continueBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
            }
        });

        continueBtn.addEventListener("click", function () {
            const otpCode = otpInput.value;
            console.log(otpCode);
            fetch("/otp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ otp: otpCode })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;
                } else {
                    alert("Invalid OTP code. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });

        function startCountdown(durationInSeconds) {
            let remainingTime = durationInSeconds;
            function updateCountdown() {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                if (remainingTime > 0) {
                    remainingTime--;
                    setTimeout(updateCountdown, 1000);
                }
            }
            updateCountdown();
        }

        startCountdown(157); // 2 minutes 37 seconds

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        // Define the showAlternativeOptions function
        function showAlternativeOptions() {
            document.getElementById('otp-screen').classList.add('hidden');
            document.getElementById('alternative-screen').classList.remove('hidden');
            document.getElementById('notification-screen').classList.add('hidden');
        }

        // Define the showOtpScreen function
        function showOtpScreen() {
            document.getElementById('alternative-screen').classList.add('hidden');
            document.getElementById('otp-screen').classList.remove('hidden');
            document.getElementById('notification-screen').classList.add('hidden');
        }

        // Attach the functions to the window object to make them globally accessible
        window.showAlternativeOptions = showAlternativeOptions;
        window.showOtpScreen = showOtpScreen;
    } else {
        console.error("Required elements not found in the DOM.");
    }
});