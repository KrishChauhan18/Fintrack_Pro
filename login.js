let username = document.querySelector("#username");
let password = document.querySelector("#password");
let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_info = JSON.parse(localStorage.getItem("users")) || [];

    // Check if username already exists
    const user = user_info.find(obj => obj.name === username.value);

    if (user) {
        alert("Username already exists!");
        return;
    }

    user_info.push({
        name: username.value,
        pass: password.value
    });

    localStorage.setItem("users", JSON.stringify(user_info));

    alert("Registration Successful!");

    form.reset();

    window.location.href = "main.html";
});
