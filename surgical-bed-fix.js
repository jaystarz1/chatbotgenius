// Quick fix for surgical bed appearing in wrong section
// And measurement conversion issues

const fixSurgicalBedPlacement = (text) => {
    // Only add surgical bed to Abdomen/Pelvis section
    const sections = text.split('\n**');
    
    return sections.map(section => {
        if (section.startsWith('Abdomen/Pelvis:') && section.includes('lymphadenopathy')) {
            // Only modify the Abdomen/Pelvis section
            return section.replace(/lymphadenopathy(?![\w,])/g, 'lymphadenopathy, including the pelvic surgical bed');
        }
        return section;
    }).join('\n**');
};

const fixMeasurementConversions = (text) => {
    // Fix "seven millimeters" -> "7 mm"
    const numberWords = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
    };
    
    let fixed = text;
    
    // Convert word numbers to digits
    for (const [word, digit] of Object.entries(numberWords)) {
        fixed = fixed.replace(new RegExp(`\\b${word}\\s+millimeters?\\b`, 'gi'), `${digit} mm`);
        fixed = fixed.replace(new RegExp(`\\b${word}\\s+point\\s+(\\d+)`, 'gi'), `${digit}.$1`);
    }
    
    // Fix SUV values
    fixed = fixed.replace(/SUV\s+of\s+(\w+)\s+point\s+(\d+)/gi, (match, whole, decimal) => {
        const num = numberWords[whole.toLowerCase()] || whole;
        return `SUVmax ${num}.${decimal}`;
    });
    
    // Fix measurement with "an"
    fixed = fixed.replace(/an\s+SUV/gi, 'SUVmax');
    
    return fixed;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fixSurgicalBedPlacement, fixMeasurementConversions };
}
