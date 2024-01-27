
let votingForm = document.getElementById("headbg");

document.addEventListener("DOMContentLoaded", () => {
    const votingForm = document.getElementById("headbg");

    votingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

    let headBoy = document.querySelector('input[name="hboy"]:checked');
    let headGirl = document.querySelector('input[name="hgirl"]:checked');
    
    const alertBox = document.querySelector(".alert_container");
    alertBox.classList.remove("hide");

    if (!headBoy || !headGirl) {
        // Show error alert
        alertBox.classList.add("alert-error");
        alertBox.querySelector(".alert-text").textContent = "Please vote for your desired candidate!";
        hideAlertAfterTimeout(alertBox);
        headBoy.checked = false;
        headGirl.checked = false;
    } else {
        // Data to save
        const voteData = {
            headBoy: headBoy.value,
            headGirl: headGirl.value,
            timestamp: new Date().toISOString(),
            formType: "headbg" // Add the form type to the data
        };
        
        // Save data to server
        const response = await fetch("http://127.0.0.1:3000/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voteData),
        });

        if (response.ok) {
            // Show success alert
            alertBox.classList.add("alert-success");
            alertBox.querySelector(".alert-text").textContent = "Your vote has been successfully submitted!";
            hideAlertAfterTimeout(alertBox);
        } else {
            console.error("Failed to submit vote.");
        }

        // Reset form
        headBoy.checked = false;
        headGirl.checked = false;
    }
});

function hideAlertAfterTimeout(alertBox) {
    setTimeout(() => {
        alertBox.classList.add("fade-out");
        setTimeout(() => {
            alertBox.classList.add("hide");
            alertBox.classList.remove("alert-error", "alert-success", "fade-out");
        }, 500); // Adjust the time as needed
    }, 1000);
}

});