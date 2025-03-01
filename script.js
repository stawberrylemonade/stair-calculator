/**
 * Technical Stair Calculator
 * A precision tool for architects, builders, and DIYers
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('stairCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions based on container size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    // Initial resize and event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawStairVisualization(calculateValues());
    });
    
    // Get input elements
    const riseInput = document.getElementById('rise');
    const runInput = document.getElementById('run');
    const railHeightInput = document.getElementById('railHeight');
    const balustersPerTreadInput = document.getElementById('balustersPerTread');
    const railThicknessInput = document.getElementById('railThickness');
    
    // Get slider elements
    const riseSlider = document.getElementById('riseSlider');
    const runSlider = document.getElementById('runSlider');
    const railHeightSlider = document.getElementById('railHeightSlider');
    const balustersPerTreadSlider = document.getElementById('balustersPerTreadSlider');
    const railThicknessSlider = document.getElementById('railThicknessSlider');
    
    // Get value display elements
    const riseValueDisplay = document.getElementById('riseValue');
    const runValueDisplay = document.getElementById('runValue');
    const railHeightValueDisplay = document.getElementById('railHeightValue');
    const balustersPerTreadValueDisplay = document.getElementById('balustersPerTreadValue');
    const railThicknessValueDisplay = document.getElementById('railThicknessValue');
    
    // Get fraction display elements
    const riseFractionDisplay = document.getElementById('riseFraction');
    const runFractionDisplay = document.getElementById('runFraction');
    const railHeightFractionDisplay = document.getElementById('railHeightFraction');
    const railThicknessFractionDisplay = document.getElementById('railThicknessFraction');
    
    // Get calculated value display elements
    const rakeAngleDisplay = document.getElementById('rakeAngle');
    const netBalusterHeightDisplay = document.getElementById('netBalusterHeight');
    const netBalusterHeightFractionDisplay = document.getElementById('netBalusterHeightFraction');
    
    // Get containers for dynamically generated content
    const balusterSetbacksContainer = document.getElementById('balusterSetbacksContainer');
    const balusterHeightsContainer = document.getElementById('balusterHeightsContainer');
    
    // Get control buttons
    const printBtn = document.getElementById('printBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Default values
    const defaultValues = {
        rise: 6.625,
        run: 11,
        railHeight: 36.25,
        balustersPerTread: 3,
        railThickness: 1.5
    };
    
    // Current values
    let rise = parseFloat(riseInput.value);
    let run = parseFloat(runInput.value);
    let railHeight = parseFloat(railHeightInput.value);
    let balustersPerTread = parseInt(balustersPerTreadInput.value);
    let railThickness = parseFloat(railThicknessInput.value);
    
    /**
     * Calculate all stair values based on inputs
     * @returns {Object} Calculated values
     */
    function calculateValues() {
        // Calculate rake angle (angle of the stairs)
        const rakeAngle = Math.atan(rise / run) * (180 / Math.PI);
        
        // Calculate net baluster height (rail height minus rail thickness)
        const netBalusterHeight = railHeight - railThickness;
        
        // Calculate baluster setbacks (evenly distributed along the tread)
        const balusterSetbacks = [];
        const balusterSpacing = run / (balustersPerTread + 1);
        
        for (let i = 1; i <= balustersPerTread; i++) {
            balusterSetbacks.push(balusterSpacing * i);
        }
        
        // Calculate baluster heights (increase with distance from nosing due to rake angle)
        const balusterHeights = [];
        for (let i = 0; i < balusterSetbacks.length; i++) {
            const setback = balusterSetbacks[i];
            const additionalHeight = setback * Math.tan(rakeAngle * (Math.PI / 180));
            const balusterHeight = netBalusterHeight + additionalHeight;
            balusterHeights.push(balusterHeight);
        }
        
        return {
            rakeAngle,
            netBalusterHeight,
            balusterSetbacks,
            balusterHeights
        };
    }
    
    /**
     * Convert decimal to fraction string
     * @param {number} decimal - Decimal value to convert
     * @returns {string} Fraction string
     */
    function decimalToFraction(decimal) {
        // Round to nearest 1/16 inch
        const precision = 16;
        const wholePart = Math.floor(decimal);
        const decimalPart = decimal - wholePart;
        
        // Convert to nearest 1/16
        const numerator = Math.round(decimalPart * precision);
        const denominator = precision;
        
        // Simplify the fraction
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const divisor = gcd(numerator, denominator);
        
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;
        
        return simplifiedNumerator === 0 ? 
            `${wholePart}` : 
            `${wholePart} ${simplifiedNumerator}/${simplifiedDenominator}`;
    }
    
    /**
     * Get fraction display without parentheses
     * @param {number} decimal - Decimal value to convert
     * @returns {string} Fraction string without parentheses
     */
    function getFractionDisplay(decimal) {
        return decimalToFraction(decimal);
    }
    
    /**
     * Update all display elements with calculated values
     * @param {Object} values - Calculated values
     */
    function updateDisplay(values) {
        // Update value displays - now showing fractions as primary
        riseValueDisplay.textContent = getFractionDisplay(rise);
        runValueDisplay.textContent = getFractionDisplay(run);
        railHeightValueDisplay.textContent = getFractionDisplay(railHeight);
        balustersPerTreadValueDisplay.textContent = balustersPerTread;
        railThicknessValueDisplay.textContent = getFractionDisplay(railThickness);
        
        // Update fraction displays (now showing decimal in parentheses)
        riseFractionDisplay.textContent = `(${rise.toFixed(3)})`;
        runFractionDisplay.textContent = `(${run.toFixed(3)})`;
        railHeightFractionDisplay.textContent = `(${railHeight.toFixed(3)})`;
        railThicknessFractionDisplay.textContent = `(${railThickness.toFixed(3)})`;
        
        // Update calculated values
        rakeAngleDisplay.textContent = values.rakeAngle.toFixed(1);
        netBalusterHeightDisplay.textContent = getFractionDisplay(values.netBalusterHeight);
        netBalusterHeightFractionDisplay.textContent = `(${values.netBalusterHeight.toFixed(3)})`;
        
        // Update baluster setbacks
        balusterSetbacksContainer.innerHTML = '';
        values.balusterSetbacks.forEach((setback, index) => {
            const setbackElement = document.createElement('div');
            setbackElement.className = 'calc-group';
            setbackElement.innerHTML = `
                <label>Baluster ${index + 1} Setback</label>
                <div class="value-display">
                    <span>${getFractionDisplay(setback)}</span>
                    <span class="unit">in</span>
                    <span class="fraction-display">(${setback.toFixed(3)})</span>
                </div>
            `;
            balusterSetbacksContainer.appendChild(setbackElement);
        });
        
        // Update baluster heights
        balusterHeightsContainer.innerHTML = '';
        values.balusterHeights.forEach((height, index) => {
            const heightElement = document.createElement('div');
            heightElement.className = 'calc-group';
            heightElement.innerHTML = `
                <label>Baluster ${index + 1} Height</label>
                <div class="value-display">
                    <span>${getFractionDisplay(height)}</span>
                    <span class="unit">in</span>
                    <span class="fraction-display">(${height.toFixed(3)})</span>
                </div>
            `;
            balusterHeightsContainer.appendChild(heightElement);
        });
    }
    
    /**
     * Draw the stair visualization on the canvas
     * @param {Object} values - Calculated values
     */
    function drawStairVisualization(values) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up scaling and positioning
        const margin = 50;
        const topMargin = 170; // Increased top margin for more space above balusters
        const width = canvas.width - (margin * 2);
        
        // Adjust height calculation to maintain the same scale despite increased top margin
        // We're not reducing the available height to compensate for the larger top margin
        const height = canvas.height - margin - 50; // Reserve space for table at bottom
        
        // Calculate scale factor to fit the stairs in the canvas
        const stairWidth = run * 3; // Show 3 treads
        const stairHeight = rise * 3; // Show 3 risers
        const scaleX = width / (stairWidth * 1.7);
        const scaleY = height / (stairHeight + railHeight * 1.7);
        const scale = Math.min(scaleX, scaleY);
        
        // Center the drawing horizontally, position it with top margin
        const centerX = margin + (width - stairWidth * scale) / 2;
        const centerY = topMargin + (height - stairHeight * scale) / 2;
        
        // Draw simplified visualization - only essential elements
        drawSimplifiedStairs(centerX, centerY, scale, values);
        
        // Draw dimensions
        drawDimensions(centerX, centerY, scale, values);
        
        // Draw balustrade height table at the bottom
        drawBalustradeTable(margin, centerY + 150, width, values);
    }
    
    /**
     * Draw simplified stairs on the canvas
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} scale - Scale factor
     * @param {Object} values - Calculated values
     */
    function drawSimplifiedStairs(x, y, scale, values) {
        // Draw 3 steps
        const scaledRise = rise * scale;
        const scaledRun = run * scale;
        
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        
        // Draw treads and risers (simplified)
        for (let i = 0; i < 3; i++) {
            // Draw tread
            ctx.beginPath();
            ctx.moveTo(x + (i * scaledRun), y - (i * scaledRise));
            ctx.lineTo(x + ((i + 1) * scaledRun), y - (i * scaledRise));
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw riser (if not the last one)
            if (i < 3) {
                ctx.beginPath();
                ctx.moveTo(x + ((i + 1) * scaledRun), y - (i * scaledRise));
                ctx.lineTo(x + ((i + 1) * scaledRun), y - ((i + 1) * scaledRise));
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
        
        // Draw balusters
        ctx.lineWidth = 1.5;
        
        // Draw balusters for each tread
        for (let tread = 0; tread < 3; tread++) {
            const treadStartX = x + (tread * scaledRun);
            const treadStartY = y - (tread * scaledRise);
            
            for (let i = 0; i < values.balusterSetbacks.length; i++) {
                const setback = values.balusterSetbacks[i] * scale;
                const balusterX = treadStartX + setback;
                const balusterHeight = values.balusterHeights[i] * scale;
                
                // Calculate the Y position based on the tread and setback
                const balusterY = treadStartY - balusterHeight;
                
                ctx.beginPath();
                ctx.moveTo(balusterX, treadStartY);
                ctx.lineTo(balusterX, balusterY);
                ctx.stroke();
            }
        }
        
        // Handrail removed completely
    }
    
    /**
     * Draw dimensions on the canvas
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} scale - Scale factor
     * @param {Object} values - Calculated values
     */
    function drawDimensions(x, y, scale, values) {
        const scaledRise = rise * scale;
        const scaledRun = run * scale;
        const scaledRailHeight = railHeight * scale;
        
        ctx.strokeStyle = '#007acc';
        ctx.fillStyle = '#007acc';
        ctx.lineWidth = 1;
        ctx.font = '12px IBM Plex Sans';
        ctx.textAlign = 'center';
        
        // Draw rise dimension - positioned underneath the second tread
        drawDimension(
            x + (2.25 * scaledRun), y - (0 * scaledRise),
            x + (2.25 * scaledRun), y - (1 * scaledRise),
            `${getFractionDisplay(rise)}"`,
            'vertical'
        );
        
        // Draw run dimension
        drawDimension(
            x, y,
            x + scaledRun, y,
            `${getFractionDisplay(run)}"`,
            'horizontal'
        );
        
        // Draw rail height dimension
        drawDimension(
            x, y,
            x, y - scaledRailHeight,
            `${getFractionDisplay(railHeight)}"`,
            'vertical'
        );
        
        // Draw angle text at the TOP of the rail height dimension without the arc
        const angleRadius = 30;
        
        // Remove the arc drawing code but keep the text
        ctx.fillText(`${values.rakeAngle.toFixed(1)}°`, 
            x + (angleRadius * 0.7), 
            y - scaledRailHeight - (angleRadius * 0.3));
    }
    
    /**
     * Draw a dimension line with text
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {string} text - Dimension text
     * @param {string} orientation - 'horizontal' or 'vertical'
     */
    function drawDimension(x1, y1, x2, y2, text, orientation) {
        const arrowSize = 6;
        const offset = 15;
        
        // Calculate offset position
        let ox1, oy1, ox2, oy2, textX, textY;
        
        if (orientation === 'horizontal') {
            ox1 = x1;
            oy1 = y1 + offset;
            ox2 = x2;
            oy2 = y2 + offset;
            textX = (ox1 + ox2) / 2;
            textY = oy1 + 15;
        } else {
            ox1 = x1 - offset;
            oy1 = y1;
            ox2 = x2 - offset;
            oy2 = y2;
            textX = ox1 - 15;
            textY = (oy1 + oy2) / 2;
            ctx.textAlign = 'right';
        }
        
        // Draw extension lines
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(ox1, oy1);
        ctx.moveTo(x2, y2);
        ctx.lineTo(ox2, oy2);
        ctx.stroke();
    
        // Draw dimension line
        ctx.beginPath();
        ctx.moveTo(ox1, oy1);
        ctx.lineTo(ox2, oy2);
        ctx.stroke();
        
        // Draw arrows
        if (orientation === 'horizontal') {
            // Left arrow
            ctx.beginPath();
            ctx.moveTo(ox1, oy1);
            ctx.lineTo(ox1 + arrowSize, oy1 - arrowSize / 2);
            ctx.lineTo(ox1 + arrowSize, oy1 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
            
            // Right arrow
            ctx.beginPath();
            ctx.moveTo(ox2, oy2);
            ctx.lineTo(ox2 - arrowSize, oy2 - arrowSize / 2);
            ctx.lineTo(ox2 - arrowSize, oy2 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
        } else {
            // Top arrow
            ctx.beginPath();
            ctx.moveTo(ox1, oy1);
            ctx.lineTo(ox1 - arrowSize / 2, oy1 + arrowSize);
            ctx.lineTo(ox1 + arrowSize / 2, oy1 + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Bottom arrow
            ctx.beginPath();
            ctx.moveTo(ox2, oy2);
            ctx.lineTo(ox2 - arrowSize / 2, oy2 - arrowSize);
            ctx.lineTo(ox2 + arrowSize / 2, oy2 - arrowSize);
            ctx.closePath();
        ctx.fill();
        }
        
        // Draw text
        ctx.fillText(text, textX, textY);
        ctx.textAlign = 'center'; // Reset text alignment
    }
    
    /**
     * Draw balustrade height table at the bottom of the canvas
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Table width
     * @param {Object} values - Calculated values
     */
    function drawBalustradeTable(x, y, width, values) {
        const balusterCount = values.balusterHeights.length;
        const cellWidth = width / balusterCount;
        const rowHeight = 30;
        
        // Draw table header
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 14px IBM Plex Sans';
        ctx.textAlign = 'center';
        ctx.fillText('Balustrade Height Table', x + width / 2, y - 20);
        
        // Draw table
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        
        // Draw table outline
        ctx.beginPath();
        ctx.rect(x, y, width, rowHeight * 2);
        ctx.stroke();
        
        // Draw horizontal divider
        ctx.beginPath();
        ctx.moveTo(x, y + rowHeight);
        ctx.lineTo(x + width, y + rowHeight);
        ctx.stroke();
        
        // Draw vertical dividers and fill in data
        ctx.font = '12px IBM Plex Sans';
        
        for (let i = 0; i < balusterCount; i++) {
            // Draw vertical divider (except for the first cell)
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(x + i * cellWidth, y);
                ctx.lineTo(x + i * cellWidth, y + rowHeight * 2);
                ctx.stroke();
            }
            
            // Fill in baluster number
            ctx.fillText(`Baluster ${i + 1}`, x + (i * cellWidth) + (cellWidth / 2), y + rowHeight - 10);
            
            // Fill in baluster height
            const heightText = getFractionDisplay(values.balusterHeights[i]);
            ctx.fillText(`${heightText}"`, x + (i * cellWidth) + (cellWidth / 2), y + rowHeight * 2 - 10);
        }
    }
    
    /**
     * Update all calculations and display
     */
    function updateAll() {
        const values = calculateValues();
        updateDisplay(values);
        drawStairVisualization(values);
    }
    
    /**
     * Sync input value with slider
     * @param {HTMLElement} input - Input element
     * @param {HTMLElement} slider - Slider element
     */
    function syncInputWithSlider(input, slider) {
        slider.value = input.value;
    }
    
    /**
     * Sync slider value with input
     * @param {HTMLElement} slider - Slider element
     * @param {HTMLElement} input - Input element
     */
    function syncSliderWithInput(slider, input) {
        input.value = slider.value;
    }
    
    // Event listeners for inputs
    riseInput.addEventListener('input', () => {
        rise = parseFloat(riseInput.value);
        syncInputWithSlider(riseInput, riseSlider);
        updateAll();
    });
    
    runInput.addEventListener('input', () => {
        run = parseFloat(runInput.value);
        syncInputWithSlider(runInput, runSlider);
        updateAll();
    });
    
    railHeightInput.addEventListener('input', () => {
        railHeight = parseFloat(railHeightInput.value);
        syncInputWithSlider(railHeightInput, railHeightSlider);
        updateAll();
    });
    
    balustersPerTreadInput.addEventListener('input', () => {
        balustersPerTread = parseInt(balustersPerTreadInput.value);
        syncInputWithSlider(balustersPerTreadInput, balustersPerTreadSlider);
        updateAll();
    });
    
    railThicknessInput.addEventListener('input', () => {
        railThickness = parseFloat(railThicknessInput.value);
        syncInputWithSlider(railThicknessInput, railThicknessSlider);
        updateAll();
    });
    
    // Event listeners for sliders
    riseSlider.addEventListener('input', () => {
        rise = parseFloat(riseSlider.value);
        syncSliderWithInput(riseSlider, riseInput);
        updateAll();
    });
    
    runSlider.addEventListener('input', () => {
        run = parseFloat(runSlider.value);
        syncSliderWithInput(runSlider, runInput);
        updateAll();
    });
    
    railHeightSlider.addEventListener('input', () => {
        railHeight = parseFloat(railHeightSlider.value);
        syncSliderWithInput(railHeightSlider, railHeightInput);
        updateAll();
    });
    
    balustersPerTreadSlider.addEventListener('input', () => {
        balustersPerTread = parseInt(balustersPerTreadSlider.value);
        syncSliderWithInput(balustersPerTreadSlider, balustersPerTreadInput);
        updateAll();
    });
    
    railThicknessSlider.addEventListener('input', () => {
        railThickness = parseFloat(railThicknessSlider.value);
        syncSliderWithInput(railThicknessSlider, railThicknessInput);
        updateAll();
    });
    
    // Print button event listener
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    // Reset button event listener
    resetBtn.addEventListener('click', () => {
        // Reset all values to defaults
        rise = defaultValues.rise;
        run = defaultValues.run;
        railHeight = defaultValues.railHeight;
        balustersPerTread = defaultValues.balustersPerTread;
        railThickness = defaultValues.railThickness;
        
        // Update inputs and sliders
        riseInput.value = rise;
        runInput.value = run;
        railHeightInput.value = railHeight;
        balustersPerTreadInput.value = balustersPerTread;
        railThicknessInput.value = railThickness;
        
        riseSlider.value = rise;
        runSlider.value = run;
        railHeightSlider.value = railHeight;
        balustersPerTreadSlider.value = balustersPerTread;
        railThicknessSlider.value = railThickness;
        
        updateAll();
    });
    
    // Initial update
    updateAll();
}); 