/* Countdown Timer Module */

function initCountdown(targetDate, elementIds = {}) {
    // Default element IDs
    const ids = {
        days: elementIds.days || 'countdown-days',
        hours: elementIds.hours || 'countdown-hours',
        minutes: elementIds.minutes || 'countdown-minutes',
        seconds: elementIds.seconds || 'countdown-seconds'
    };
    
    // Convert target date to timestamp
    const eventDate = new Date(targetDate).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            // Event has passed
            if (document.getElementById(ids.days)) {
                document.getElementById(ids.days).textContent = '00';
                document.getElementById(ids.hours).textContent = '00';
                document.getElementById(ids.minutes).textContent = '00';
                document.getElementById(ids.seconds).textContent = '00';
            }
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM
        const daysEl = document.getElementById(ids.days);
        const hoursEl = document.getElementById(ids.hours);
        const minutesEl = document.getElementById(ids.minutes);
        const secondsEl = document.getElementById(ids.seconds);
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    return setInterval(updateCountdown, 1000);
}

// Simple countdown for seconds only
function initSecondsCountdown(targetDate, elementId = 'seconds') {
    const eventDate = new Date(targetDate).getTime();
    
    function updateSeconds() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            document.getElementById(elementId).textContent = '00';
            return;
        }
        
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = seconds.toString().padStart(2, '0');
        }
    }
    
    updateSeconds();
    return setInterval(updateSeconds, 1000);
}