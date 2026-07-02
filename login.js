const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector("#form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let registeredUsers = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = registeredUsers.find(
        user => user.name === usernameInput.value && user.pass === passwordInput.value
    );

    if (validUser) {
        alert("Login Successful! Welcome to FinTrack Pro.");
        
        // This MUST be saved exactly like this as a simple string
        localStorage.setItem("currentUser", validUser.name);
        
        // Use replace to prevent history tracking loops
        window.location.replace("./main.html");
    } else {
        alert("Invalid username or password. Please try again.");
    }
});
