import BounceCards from './BounceCards.js';

document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all animatable elements
    const animatedElements = document.querySelectorAll('.slide-up, .slide-in-right, .slide-in-left, .fade-pop');
    animatedElements.forEach(el => observer.observe(el));

    // Initialize BounceCards if root exists
    const bounceCardsRoot = document.getElementById('bounce-cards-root');
    if (bounceCardsRoot) {
        const contents = [
            `
            <div class="card-icon">📁</div>
            <h3>Immutable Evidence</h3>
            <p>Upload, store, and manage evidence securely. Every asset is tracked, verified, and logged in an immutable
            chain for foolproof security.</p>
            `,
            `
            <div class="card-icon">🤖</div>
            <h3>AI Forensics</h3>
            <p>AI Automatically analyze uploaded imagery and documents for authenticity,
            generating comprehensive forensic reports.</p>
            `,
            `
            <div class="card-icon">⚡</div>
            <h3>Role-Based Workflows</h3>
            <p>Tailored dashboards for Officers, Admins, Lawyers, and Judges. Execute your precise duties smoothly without
            cluttered generic interfaces.</p>
            `
        ];

        const transformStyles = [
            "rotate(-5deg) translate(-110px)",
            "rotate(0deg) translate(0px)",
            "rotate(5deg) translate(110px)"
        ];

        new BounceCards(bounceCardsRoot, {
            className: "custom-bounceCards",
            contents: contents, // Pass contents instead of images
            containerWidth: 900,
            containerHeight: 450,
            animationDelay: 1,
            animationStagger: 0.15,
            easeType: "elastic.out(1, 0.5)",
            transformStyles: transformStyles,
            pushAmount: 180, // Push wider cards further
            enableHover: true
        });
    }
});
