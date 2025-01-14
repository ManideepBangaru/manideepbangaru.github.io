function createGlitch() {
    const tagline = document.querySelector('.tagline');
    const originalText = tagline.textContent;
    
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    function glitch() {
        if (Math.random() < 0.2) { // 10% chance of glitch
            const pos = Math.floor(Math.random() * originalText.length);
            const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            
            const text = originalText.slice(0, pos) 
                      + glitchChar 
                      + originalText.slice(pos + 1);
            
            tagline.textContent = text;
            
            // Reset back to original text after a short delay
            setTimeout(() => {
                tagline.textContent = originalText;
            }, 50);
        }
    }

    // Run the glitch effect every 100ms
    setInterval(glitch, 100);
}

// Start the effect when the page loads
document.addEventListener('DOMContentLoaded', createGlitch); 