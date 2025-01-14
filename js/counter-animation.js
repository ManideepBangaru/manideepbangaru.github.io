document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    // Animate all counters
    const counters = document.querySelectorAll('.experience-counter');
    counters.forEach(counter => {
        // Add initial opacity
        counter.style.opacity = '0';
        counter.style.transform = 'translateY(20px)';
        observer.observe(counter);
    });

    function animateCounter(counterElement) {
        // Fade in the counter
        counterElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        counterElement.style.opacity = '1';
        counterElement.style.transform = 'translateY(0)';

        // Animate the number
        const numberElement = counterElement.querySelector('.years');
        const targetNumber = parseInt(numberElement.textContent);
        let currentNumber = 0;
        
        // Remove the '+' for animation
        numberElement.textContent = '0';
        
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = targetNumber / steps;
        const stepTime = duration / steps;

        const updateNumber = () => {
            currentNumber = Math.min(currentNumber + increment, targetNumber);
            numberElement.textContent = Math.floor(currentNumber) + '+';
            
            if (currentNumber < targetNumber) {
                setTimeout(updateNumber, stepTime);
            }
        };

        setTimeout(updateNumber, 300); // Start counting after fade-in begins
    }
}); 