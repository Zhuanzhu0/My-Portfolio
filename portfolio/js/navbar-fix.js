// Navbar visibility fix - add to existing main.js
// This code ensures navbar is hidden in hero section and shown elsewhere

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    function updateNavbarVisibility() {
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;

        // Hide navbar in hero section, show in other sections
        if (window.scrollY < heroHeight - 100) {
            navbar.classList.add('hidden');
            navbar.classList.remove('scrolled');
        } else {
            navbar.classList.remove('hidden');
            navbar.classList.add('scrolled');
        }
    }

    // Run on scroll
    window.addEventListener('scroll', updateNavbarVisibility);

    // Initialize on page load
    updateNavbarVisibility();
});
