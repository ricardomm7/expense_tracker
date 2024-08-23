const authe = firebase.auth();

// Check if user is already authenticated
authe.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to the home page
        window.location.href = 'main.html';
    }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authe.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in, redirect to the home page
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('login-status').textContent = "Erro: " + errorMessage;
        });
});
