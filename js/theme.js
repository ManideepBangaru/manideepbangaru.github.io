// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    // Set dark theme by default if no theme is stored
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);

    // Add click event listener to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Update icon based on current theme
        const updateIcon = () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            themeToggle.innerHTML = `<i class="fas fa-${currentTheme === 'light' ? 'moon' : 'sun'}"></i>`;
        };
        
        // Initial icon update
        updateIcon();
        
        // Update icon when theme changes
        themeToggle.addEventListener('click', updateIcon);
    }
}); 