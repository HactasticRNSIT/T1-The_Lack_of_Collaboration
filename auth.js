// auth.js

// --- LOGIN PAGE LOGIC ---
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');

        messageEl.textContent = 'Logging in...';
        messageEl.style.color = '#666';

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            messageEl.textContent = 'Error: ' + error.message;
            messageEl.style.color = 'red';
        } else {
            messageEl.textContent = 'Success! Redirecting...';
            messageEl.style.color = 'green';
            // Redirect to your professional index page upon success
            window.location.href = 'home.html'; 
        }
    });
}

// --- SIGN UP PAGE LOGIC ---
const signupBtn = document.getElementById('signup-btn');
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const messageEl = document.getElementById('signup-message');

        messageEl.textContent = 'Creating account...';
        messageEl.style.color = '#666';

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            messageEl.textContent = 'Error: ' + error.message;
            messageEl.style.color = 'red';
        } else {
            // SUCCESS! 
            messageEl.textContent = 'Sign up successful! Redirecting...';
            messageEl.style.color = 'green';
            
            // This is the magic line that sends them to your home page
            window.location.href = 'home.html'; 
        }
    });
}

// --- INDEX PAGE LOGIC (Checking if logged in) ---
// If you have a logout button on your index.html, we handle it here
const logOutBtn = document.getElementById('logout-btn');
if (logOutBtn) {
    logOutBtn.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            // Redirect back to login page after logging out
            window.location.href = 'index.html';
        }
    });
}