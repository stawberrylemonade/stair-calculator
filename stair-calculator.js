document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('stairCanvas');
    const ctx = canvas.getContext('2d');
    
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
    
    // Get control buttons
    const printBtn = document.getElementById('printBtn');
    
    // Get display elements for calculated values
    const rakeAngleDisplay = document.getElementById('rakeAngle');
    const netBalusterHeightDisplay = document.getElementById('netBalusterHeight');
    const netBalusterHeightFractionDisplay = document.getElementById('netBalusterHeightFraction');
    const balusterSetback1Display = document.getElementById('balusterSetback1');
    const balusterSetback1FractionDisplay = document.getElementById('balusterSetback1Fraction');
    const balusterSetback2Display = document.getElementById('balusterSetback2');
    const balusterSetback2FractionDisplay = document.getElementById('balusterSetback2Fraction');
    const balusterSetback3Display = document.getElementById('balusterSetback3');
    const balusterSetback3FractionDisplay = document.getElementById('balusterSetback3Fraction');
    
    // Get baluster heights container
    const balusterHeightsContainer = document.getElementById('balusterHeightsContainer');
    
    // Initial values
    let rise = parseFloat(riseInput.value);
    let run = parseFloat(runInput.value);
    let railHeight = parseFloat(railHeightInput.value);
    let balustersPerTread = parseInt(balustersPerTreadInput.value);
    let railThickness = parseFloat(railThicknessInput.value);
    
    // Calculate values based on inputs
    function calculateValues() {
        // Calculate rake angle
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
    
    // Convert decimal to fraction
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
    
    // Convert decimal to fraction display format
    function decimalToFractionDisplay(decimal) {
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
            `(${wholePart})` : 
            `(${wholePart} ${simplifiedNumerator}/${simplifiedDenominator})`;
    }
    
    // Update the display with calculated values
    function updateDisplay(values) {
        // Update rake angle
        rakeAngleDisplay.textContent = values.rakeAngle.toFixed(2);
        
        // Update net baluster height
        netBalusterHeightDisplay.textContent = values.netBalusterHeight.toFixed(3);
        netBalusterHeightFractionDisplay.textContent = decimalToFractionDisplay(values.netBalusterHeight);
        
        // Update baluster setbacks
        if (values.balusterSetbacks.length >= 1) {
            balusterSetback1Display.textContent = values.balusterSetbacks[0].toFixed(3);
            balusterSetback1FractionDisplay.textContent = decimalToFractionDisplay(values.balusterSetbacks[0]);
        }
        
        if (values.balusterSetbacks.length >= 2) {
            balusterSetback2Display.textContent = values.balusterSetbacks[1].toFixed(3);
            balusterSetback2FractionDisplay.textContent = decimalToFractionDisplay(values.balusterSetbacks[1]);
        }
        
        if (values.balusterSetbacks.length >= 3) {
            balusterSetback3Display.textContent = values.balusterSetbacks[2].toFixed(3);
            balusterSetback3FractionDisplay.textContent = decimalToFractionDisplay(values.balusterSetbacks[2]);
        }
        
        // Update baluster heights - dynamically create elements
        balusterHeightsContainer.innerHTML = '';
        
        for (let i = 0; i < values.balusterHeights.length; i++) {
            const height = values.balusterHeights[i];
            
            const balusterGroup = document.createElement('div');
            balusterGroup.className = 'baluster-group';
            
            const label = document.createElement('label');
            label.textContent = `Baluster ${i + 1} Height (inches):`;
            
            const heightSpan = document.createElement('span');
            heightSpan.textContent = height.toFixed(3);
            
            const fractionSpan = document.createElement('span');
            fractionSpan.className = 'fraction-display';
            fractionSpan.textContent = decimalToFractionDisplay(height);
            
            balusterGroup.appendChild(label);
            balusterGroup.appendChild(heightSpan);
            balusterGroup.appendChild(fractionSpan);
            
            balusterHeightsContainer.appendChild(balusterGroup);
        }
    }
    
    // Draw the stair visualization
    function drawStairVisualization(values) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up scaling and positioning
        const scale = 6; // Increased scale for better visibility
        const margin = 150; // Larger margin for more space
        const offsetX = margin;
        const offsetY = canvas.height - margin;
        
        // Clean white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate rake angle for angled elements
        const rakeAngleRad = Math.atan(values.rise / values.run);
        
        // Draw just one tread for simplicity
        const treadStartX = offsetX;
        const treadStartY = offsetY;
        
        // Draw dimension lines first (behind the geometry)
        
        // Draw tread dimensions with clean extension lines
        drawCADDimension(
            treadStartX, treadStartY + 80, // More vertical spacing
            treadStartX + values.run * scale, treadStartY + 80, 
            decimalToFraction(values.run), 
            'horizontal'
        );
        
        // Draw rise dimension
        drawCADDimension(
            treadStartX - 80, treadStartY, // More horizontal spacing
            treadStartX - 80, treadStartY - values.rise * scale, 
            decimalToFraction(values.rise), 
            'vertical'
        );
        
        // Draw rail height dimension
        drawCADDimension(
            treadStartX + values.run * scale + 80, treadStartY, 
            treadStartX + values.run * scale + 80, treadStartY - values.railHeight * scale, 
            decimalToFraction(values.railHeight), 
            'vertical'
        );
        
        // Draw the tread with clean lines
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(treadStartX, treadStartY);
        ctx.lineTo(treadStartX + values.run * scale, treadStartY);
        ctx.lineTo(treadStartX + values.run * scale, treadStartY - values.rise * scale);
        ctx.lineTo(treadStartX, treadStartY);
        ctx.stroke();
        
        // Draw the rail with clean lines
        const railStartX = treadStartX;
        const railStartY = treadStartY - values.railHeight * scale;
        const railEndX = treadStartX + values.run * scale;
        const railEndY = treadStartY - values.rise * scale - (values.railHeight - values.rise) * scale;
        
        // Draw the rail
        ctx.beginPath();
        ctx.moveTo(railStartX, railStartY);
        ctx.lineTo(railEndX, railEndY);
        ctx.lineTo(railEndX, railEndY + values.railThickness * scale);
        ctx.lineTo(railStartX, railStartY + values.railThickness * scale);
        ctx.closePath();
        ctx.stroke();
        
        // Draw balusters
        for (let i = 0; i < values.balustersPerTread; i++) {
            const setback = values.balusterSetbacks[i];
            const balusterX = treadStartX + setback * scale;
            const balusterY = treadStartY;
            
            // Calculate height at this position
            const heightAtSetback = values.netBalusterHeight + (setback * Math.tan(rakeAngleRad));
            
            // Calculate top point
            const topX = balusterX;
            const topY = balusterY - heightAtSetback * scale;
            
            // Draw baluster
            ctx.beginPath();
            ctx.moveTo(balusterX, balusterY);
            ctx.lineTo(topX, topY);
            ctx.stroke();
            
            // Draw baluster height directly on the visualization
            // Position text at different heights to avoid overlap
            const textPosition = i % 3;
            const textOffsetY = textPosition === 0 ? 0.3 : (textPosition === 1 ? 0.5 : 0.7);
            const textY = balusterY - heightAtSetback * scale * textOffsetY;
            
            // Draw text with background for better readability
            const heightText = decimalToFraction(heightAtSetback);
            
            ctx.font = '16px sans-serif'; // Sans-serif for clean look
            const textWidth = ctx.measureText(heightText).width;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(balusterX + 10, textY - 12, textWidth + 20, 24);
            
            ctx.fillStyle = 'black';
            ctx.fillText(heightText, balusterX + 20, textY + 6);
        }
        
        // Draw rake angle indicator
        const rakeAngleX = treadStartX + values.run * scale / 2;
        const rakeAngleY = treadStartY - values.rise * scale / 2;
        const rakeAngleRadius = 50;
        
        // Draw angle arc
        ctx.beginPath();
        ctx.arc(rakeAngleX, rakeAngleY, rakeAngleRadius, 0, -rakeAngleRad, true);
        ctx.stroke();
        
        // Draw angle text
        const angleText = `${values.rakeAngle.toFixed(1)}°`;
        ctx.fillStyle = 'black';
        ctx.font = '16px sans-serif';
        ctx.fillText(angleText, rakeAngleX - 15, rakeAngleY - rakeAngleRadius - 15);
        
        // Add a clean title
        drawCleanTitle(canvas.width / 2, 50);
        
        // Add a simple measurement table for printing
        drawSimpleMeasurementTable(50, canvas.height - 200, values);
        
        // Add simple print instructions
        drawSimplePrintInstructions(canvas.width - 300, canvas.height - 50);
    }
    
    // Helper function to draw a clean title
    function drawCleanTitle(x, y) {
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        
        const title = 'STAIR CONFIGURATION';
        ctx.fillText(title, x, y);
        
        // Reset text alignment
        ctx.textAlign = 'left';
    }
    
    // Helper function to draw a simple measurement table
    function drawSimpleMeasurementTable(x, y, values) {
        const padding = 20;
        const lineHeight = 30;
        const colWidth1 = 220;
        const colWidth2 = 120;
        const colWidth3 = 120;
        
        // Create measurements array with only essential measurements
        const measurements = [
            { label: 'Rise', value: values.rise, fraction: decimalToFraction(values.rise) },
            { label: 'Run', value: values.run, fraction: decimalToFraction(values.run) },
            { label: 'Rail Height', value: values.railHeight, fraction: decimalToFraction(values.railHeight) },
            { label: 'Rail Thickness', value: values.railThickness, fraction: decimalToFraction(values.railThickness) },
            { label: 'Rake Angle', value: values.rakeAngle.toFixed(2), fraction: `${values.rakeAngle.toFixed(1)}°` },
            { label: 'Net Baluster Height @ Nosing', value: values.netBalusterHeight.toFixed(3), fraction: decimalToFraction(values.netBalusterHeight) }
        ];
        
        // Add baluster heights (only if there are 5 or fewer to keep it clean)
        const maxBalustersToShow = Math.min(values.balusterHeights.length, 5);
        for (let i = 0; i < maxBalustersToShow; i++) {
            measurements.push({
                label: `Baluster ${i + 1} Height`,
                value: values.balusterHeights[i].toFixed(3),
                fraction: decimalToFraction(values.balusterHeights[i])
            });
        }
        
        const tableWidth = colWidth1 + colWidth2 + colWidth3 + padding * 2;
        const tableHeight = measurements.length * lineHeight + lineHeight + padding * 2;
        
        // Draw table background
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.fillRect(x - padding, y - padding, tableWidth, tableHeight);
        ctx.strokeRect(x - padding, y - padding, tableWidth, tableHeight);
        
        // Draw table title
        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText('MEASUREMENTS', x, y - 5);
        
        // Draw table headers
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Dimension', x, y + 25);
        ctx.fillText('Decimal (in)', x + colWidth1, y + 25);
        ctx.fillText('Fraction (in)', x + colWidth1 + colWidth2, y + 25);
        
        // Draw header separator line
        ctx.beginPath();
        ctx.moveTo(x - padding, y + 35);
        ctx.lineTo(x - padding + tableWidth, y + 35);
        ctx.stroke();
        
        // Draw measurements
        ctx.font = '16px sans-serif';
        measurements.forEach((measurement, index) => {
            const itemY = y + 60 + index * lineHeight;
            
            // Draw label
            ctx.fillText(measurement.label, x, itemY);
            
            // Draw decimal value
            ctx.fillText(measurement.value, x + colWidth1, itemY);
            
            // Draw fraction value
            ctx.fillText(measurement.fraction, x + colWidth1 + colWidth2, itemY);
        });
    }
    
    // Helper function to draw simple print instructions
    function drawSimplePrintInstructions(x, y) {
        const text = "Press Ctrl+P or Cmd+P to print";
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
    }
    
    // Helper function to draw a CAD-style dimension with extension lines
    function drawCADDimension(x1, y1, x2, y2, text, orientation = 'horizontal') {
        const extensionLength = 12;
        const arrowSize = 10;
        const textPadding = 10;
        
        // Set styles for dimension lines
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        
        // Draw extension lines
        ctx.beginPath();
        if (orientation === 'horizontal') {
            // Extension line 1
            ctx.moveTo(x1, y1 - extensionLength);
            ctx.lineTo(x1, y1 + extensionLength);
            
            // Extension line 2
            ctx.moveTo(x2, y2 - extensionLength);
            ctx.lineTo(x2, y2 + extensionLength);
        } else {
            // Extension line 1
            ctx.moveTo(x1 - extensionLength, y1);
            ctx.lineTo(x1 + extensionLength, y1);
            
            // Extension line 2
            ctx.moveTo(x2 - extensionLength, y2);
            ctx.lineTo(x2 + extensionLength, y2);
        }
        ctx.stroke();
        
        // Draw dimension line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Draw arrows
        if (orientation === 'horizontal') {
            // Arrow 1
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + arrowSize, y1 - arrowSize / 2);
            ctx.lineTo(x1 + arrowSize, y1 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
            
            // Arrow 2
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize, y2 - arrowSize / 2);
            ctx.lineTo(x2 - arrowSize, y2 + arrowSize / 2);
            ctx.closePath();
            ctx.fill();
        } else {
            // Arrow 1
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - arrowSize / 2, y1 + arrowSize);
            ctx.lineTo(x1 + arrowSize / 2, y1 + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Arrow 2
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize / 2, y2 - arrowSize);
            ctx.lineTo(x2 + arrowSize / 2, y2 - arrowSize);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw dimension text with clean background
        ctx.font = '16px sans-serif';
        const textWidth = ctx.measureText(text).width;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // Draw text background
        ctx.fillStyle = 'white';
        if (orientation === 'horizontal') {
            ctx.fillRect(midX - textWidth / 2 - textPadding, midY - 12, textWidth + textPadding * 2, 24);
        } else {
            ctx.fillRect(midX + 8, midY - 12, textWidth + textPadding * 2, 24);
        }
        
        // Draw text
        ctx.fillStyle = '#000000';
        if (orientation === 'horizontal') {
            ctx.fillText(text, midX - textWidth / 2, midY + 6);
        } else {
            ctx.fillText(text, midX + 12, midY + 6);
        }
    }
    
    // Update everything
    function updateAll() {
        const values = calculateValues();
        updateDisplay(values);
        drawStairVisualization(values);
    }
    
    // Sync number inputs with sliders
    function syncInputWithSlider(input, slider) {
        slider.value = input.value;
    }
    
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
    
    // Initialize
    updateAll();
}); 