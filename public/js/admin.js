document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // This is where you'd typically make an API call to verify credentials
    // For now, let's do a simple check (replace with actual authentication)
    if (username === "admin" && password === "password") {
        // Successful login
        window.location.href = 'dashboard.html';
    } else {
        // Failed login
        alert('Invalid username or password');
    }
}); 