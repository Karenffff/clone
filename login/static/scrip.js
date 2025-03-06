
// Handling OTP Verification
document.getElementById("verify-security").addEventListener("click", async function () {
    let otp = document.getElementById("security-code").value;
    console.log(otp);

    let response = await fetch("/otp/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp })
    });

    let data = await response.json();
    
    if (data.success) {
        window.location.href = data.redirect_url;  // Redirect on success
    } else {
        alert("Invalid OTP. Please try again.");
    }

});