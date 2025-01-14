// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Function to update icon based on current theme
    const updateIcon = (isDark) => {
        // Using a more detailed sun icon
        themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fas fa-moon';
    };

    // Check initial theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
    updateIcon(isDarkTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateIcon(newTheme === 'dark');
    });
}); 