let username = document.querySelector("#username");
let password = document.querySelector("#password");
let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get existing users
    let user_info = JSON.parse(localStorage.getItem("users")) || [];

    // Check if username already exists
    const user = user_info.find(obj => obj.name === username.value);

    if (user) {
        alert("Username already exists!");
        return;
    }

    // Add new user
    user_info.push({
        name: username.value,
        pass: password.value
    });

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(user_info));

    alert("Registration Successful!");

    form.reset();

    // Redirect to login page
    window.location.href = "login.html";
});