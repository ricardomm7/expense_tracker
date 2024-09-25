const authe = firebase.auth();

authe.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'main.html';
    }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authe.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('login-status').textContent = "Error: " + errorMessage;
        });
});

document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    authe.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById('register-status').textContent = "Done!";
            window.location.href = 'main.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('register-status').textContent = "Error: " + errorMessage;
        });
});

document.getElementById('toggle-form').addEventListener('click', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formTitle = document.getElementById('form-title');
    const toggleButton = document.getElementById('toggle-form');

    if (registerForm.style.display === 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Register';
        toggleButton.textContent = 'I already have an account';
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        formTitle.textContent = 'Login';
        toggleButton.textContent = 'Register';
    }
});
