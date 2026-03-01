document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Particles Generation
    // -------------------------------------------------------------
    const particlesContainer = document.getElementById('particles-container');
    const NUMBER_OF_PARTICLES = 25;

    for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Randomize size, pos, delay, duration
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }

    // -------------------------------------------------------------
    // Remember Me Execution On Load
    // -------------------------------------------------------------
    const savedEmail = localStorage.getItem('lexx_saved_email');
    const savedPass = localStorage.getItem('lexx_saved_pass');
    if (savedEmail && savedPass) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPass;
        document.getElementById('remember-me').checked = true;
    }

    // -------------------------------------------------------------
    // Role Switching Config
    // -------------------------------------------------------------
    const roleThemes = {
        officer: { primary: '#3b82f6', accent: '#ec4899', title: 'Authenticate Officer' },
        lawyer: { primary: '#14b8a6', accent: '#f59e0b', title: 'Counsel Authentication' },
        judge: { primary: '#dc2626', accent: '#fbbf24', title: 'Enter Chamber' },
        admin: { primary: '#8b5cf6', accent: '#22d3ee', title: 'LEXX Root Access' }
    };

    const roleBtns = document.querySelectorAll('.role-btn');
    const animContainers = document.querySelectorAll('.anim-svg');
    const titleEl = document.getElementById('form-title');
    const textSection = document.querySelector('.text-section');

    let currentRole = 'officer';

    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            currentRole = role;

            // Reset active states
            roleBtns.forEach(b => b.classList.remove('active'));
            animContainers.forEach(a => a.classList.remove('active'));

            // Toggle new role
            btn.classList.add('active');
            document.querySelector(`.anim-${role}`).classList.add('active');

            // Apply Theme
            const theme = roleThemes[role];
            document.documentElement.style.setProperty('--primary-color', theme.primary);
            document.documentElement.style.setProperty('--accent-color', theme.accent);

            // Handle Text Fade Transition
            textSection.style.opacity = '0';
            setTimeout(() => {
                if (isRegisterMode) {
                    titleEl.innerText = 'System Registration';
                } else {
                    titleEl.innerText = theme.title;
                    document.getElementById('submit-btn').innerText = `Sync ${role.charAt(0).toUpperCase() + role.slice(1)} Profile`;
                }
                textSection.style.opacity = '1';
            }, 300);
        });
    });

    // -------------------------------------------------------------
    // Toggle Registration
    // -------------------------------------------------------------
    const toggleBtn = document.getElementById('toggle-btn');
    const registerFields = document.getElementById('register-fields');
    const submitBtn = document.getElementById('submit-btn');
    const togglePrompt = document.getElementById('toggle-prompt');

    let isRegisterMode = false;

    // Check URL Params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'register') {
        toggleAuthMode();
    }

    toggleBtn.addEventListener('click', toggleAuthMode);

    function toggleAuthMode() {
        isRegisterMode = !isRegisterMode;

        // Reset previously entered text to prevent UI ghosting
        const form = document.getElementById('auth-form');
        if (form) form.reset();

        if (isRegisterMode) {
            registerFields.classList.add('open');
            submitBtn.innerText = 'Register ID Authorization';
            togglePrompt.innerText = 'Already hold clearance?';
            toggleBtn.innerText = 'Secure Login';
            titleEl.innerText = 'System Registration';
        } else {
            registerFields.classList.remove('open');
            submitBtn.innerText = `Sync ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Profile`;
            togglePrompt.innerText = 'New personnel?';
            toggleBtn.innerText = 'Request Clearance';
            titleEl.innerText = roleThemes[currentRole].title;
        }
    }

    // -------------------------------------------------------------
    // Form Submission / Mock Auth + Real API
    // -------------------------------------------------------------
    const authForm = document.getElementById('auth-form');

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Start UI pulsing
        const originalText = submitBtn.innerText;
        submitBtn.classList.add('pulsing');
        submitBtn.innerText = 'Authenticating...';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const name = document.getElementById('name').value.trim();
        const badgeId = document.getElementById('badgeId').value.trim();

        if (isRegisterMode && !name) {
            triggerFailure(originalText, "Validation Failed: Name Req.");
            return;
        }

        // Delay 1.5s to mimic "LEXX Processing"
        setTimeout(async () => {
            try {
                if (isRegisterMode) {
                    // Actual Registration
                    const res = await fetch("https://lexx-1.onrender.com/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password, role: currentRole, badgeId })
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        triggerFailure(originalText, "Registration Failed");
                        setTimeout(() => alert(data.message || "Email already in use or missing fields."), 500);
                        return;
                    }

                    // Success UI
                    submitBtn.classList.remove('pulsing');
                    submitBtn.innerText = "Clearance Granted";
                    setTimeout(() => {
                        alert("Registration successful. Please login to enter the LEXX.");
                        toggleAuthMode();
                        authForm.reset();
                    }, 1000);

                } else {
                    // Actual Login
                    const res = await fetch("https://lexx-1.onrender.com/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, role: currentRole })
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        // Keep the animated failure but also show why
                        triggerFailure(originalText, "Authentication Failed");
                        setTimeout(() => alert(data.message || "Invalid credentials."), 500);
                        return;
                    }

                    // Success - Real Redirects
                    submitBtn.classList.remove('pulsing');
                    submitBtn.innerText = "Access Granted";
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // Remember Me Logic Execution
                    const rememberMe = document.getElementById('remember-me').checked;
                    if (rememberMe) {
                        localStorage.setItem("lexx_saved_email", email);
                        localStorage.setItem("lexx_saved_pass", password);
                    } else {
                        localStorage.removeItem("lexx_saved_email");
                        localStorage.removeItem("lexx_saved_pass");
                    }

                    setTimeout(() => {
                        if (data.user.role === 'officer') window.location.href = 'officer.html';
                        else if (data.user.role === 'lawyer') window.location.href = 'lawyer.html';
                        else if (data.user.role === 'judge') window.location.href = 'judge.html';
                        else if (data.user.role === 'admin') window.location.href = 'admin.html';
                        else alert(`Redirecting to ${data.user.role} dashboard...`);
                    }, 800);
                }
            } catch (err) {
                console.error(err);
                triggerFailure(originalText, "System Error");
                setTimeout(() => alert("Network error: Is the backend running?"), 500);
            }
        }, 1500); // Wait 1.5s simulated processing
    });

    function triggerFailure(originalText, msg) {
        submitBtn.classList.remove('pulsing');
        submitBtn.classList.add('shake-anim');
        submitBtn.innerText = msg;
        setTimeout(() => {
            submitBtn.classList.remove('shake-anim');
            submitBtn.innerText = originalText;
        }, 2000);
    }
});
