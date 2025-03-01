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
    
    // Get display elements for calculated values
    const rakeAngleDisplay = document.getElementById('rakeAngle');
    const netBalusterHeightDisplay = document.getElementById('netBalusterHeight');
    const balusterSetback1Display = document.getElementById('balusterSetback1');
    const balusterSetback2Display = document.getElementById('balusterSetback2');
    const balusterSetback3Display = document.getElementById('balusterSetback3');
    
    // Get display elements for baluster heights
    const baluster1HeightDisplay = document.getElementById('baluster1Height');
    const baluster2HeightDisplay = document.getElementById('baluster2Height');
    const baluster3HeightDisplay = document.getElementById('baluster3Height');
    
    // Get display elements for fraction displays
    const riseFractionDisplay = document.getElementById('riseFraction');
    const runFractionDisplay = document.getElementById('runFraction');
    const railHeightFractionDisplay = document.getElementById('railHeightFraction');
    const railThicknessFractionDisplay = document.getElementById('railThicknessFraction');
    const netBalusterHeightFractionDisplay = document.getElementById('netBalusterHeightFraction');
    const balusterSetback1FractionDisplay = document.getElementById('balusterSetback1Fraction');
    const balusterSetback2FractionDisplay = document.getElementById('balusterSetback2Fraction');
    const balusterSetback3FractionDisplay = document.getElementById('balusterSetback3Fraction');
    const baluster1HeightFractionDisplay = document.getElementById('baluster1HeightFraction');
    const baluster2HeightFractionDisplay = document.getElementById('baluster2HeightFraction');
    const baluster3HeightFractionDisplay = document.getElementById('baluster3HeightFraction');
    
    // Initialize values
    let rise = parseFloat(riseInput.value);
    let run = parseFloat(runInput.value);
    let railHeight = parseFloat(railHeightInput.value);
    let balustersPerTread = parseInt(balustersPerTreadInput.value);
    let railThickness = parseFloat(railThicknessInput.value);
    
    // Calculate derived values
    function calculateValues() {
        // Calculate rake angle (in degrees)
        const rakeAngle = Math.atan(rise / run) * (180 / Math.PI);
        
        // Calculate net baluster height at nosing
        const netBalusterHeight = railHeight - railThickness;
        
        // Calculate baluster setbacks based on number of balusters per tread
        const balusterSetbacks = [];
        for (let i = 0; i < balustersPerTread; i++) {
            balusterSetbacks.push(run * (i + 1) / (balustersPerTread + 1));
        }
        
        // Calculate net baluster heights at each setback position
        const balusterHeights = balusterSetbacks.map(setback => {
            // Height increases with distance from nosing based on rake angle
            return netBalusterHeight + setback * Math.tan(rakeAngle * Math.PI / 180);
        });
        
        return {
            rakeAngle,
            netBalusterHeight,
            balusterSetbacks,
            balusterHeights
        };
    }
    
    // Convert decimal to fraction string (e.g., 6.625 to "6-10/16")
    function decimalToFraction(decimal) {
        const wholePart = Math.floor(decimal);
        const decimalPart = decimal - wholePart;
        
        // Convert to 16ths
        const numerator = Math.round(decimalPart * 16);
        const denominator = 16;
        
        // Simplify fraction if possible
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const divisor = gcd(numerator, denominator);
        
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;
        
        if (simplifiedNumerator === 0) {
            return `${wholePart}`;
        } else {
            return `${wholePart}-${simplifiedNumerator}/${simplifiedDenominator}`;
        }
    }
    
    // Convert decimal to fraction string for display (e.g., 6.625 to "(6 10/16)")
    function decimalToFractionDisplay(decimal) {
        const wholePart = Math.floor(decimal);
        const decimalPart = decimal - wholePart;
        
        // Convert to 16ths
        const numerator = Math.round(decimalPart * 16);
        const denominator = 16;
        
        // Simplify fraction if possible
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const divisor = gcd(numerator, denominator);
        
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;
        
        if (simplifiedNumerator === 0) {
            return `(${wholePart})`;
        } else {
            return `(${wholePart} ${simplifiedNumerator}/${simplifiedDenominator})`;
        }
    }
    
    // Update display with calculated values
    function updateDisplay(values) {
        // Update calculated values
        rakeAngleDisplay.textContent = values.rakeAngle.toFixed(2);
        netBalusterHeightDisplay.textContent = values.netBalusterHeight.toFixed(2);
        
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
        
        // Dynamically generate baluster height displays
        const balusterHeightsContainer = document.getElementById('balusterHeightsContainer');
        balusterHeightsContainer.innerHTML = ''; // Clear existing content
        
        // Create a display for each baluster height
        values.balusterHeights.forEach((height, index) => {
            const balusterGroup = document.createElement('div');
            balusterGroup.className = 'baluster-group';
            
            const label = document.createElement('label');
            label.textContent = `Baluster ${index + 1} (inches):`;
            
            const heightSpan = document.createElement('span');
            heightSpan.textContent = height.toFixed(3);
            
            const fractionSpan = document.createElement('span');
            fractionSpan.className = 'fraction-display';
            fractionSpan.textContent = decimalToFractionDisplay(height);
            
            balusterGroup.appendChild(label);
            balusterGroup.appendChild(heightSpan);
            balusterGroup.appendChild(fractionSpan);
            
            balusterHeightsContainer.appendChild(balusterGroup);
        });
        
        // Update fraction displays for inputs
        riseFractionDisplay.textContent = decimalToFractionDisplay(rise);
        runFractionDisplay.textContent = decimalToFractionDisplay(run);
        railHeightFractionDisplay.textContent = decimalToFractionDisplay(railHeight);
        railThicknessFractionDisplay.textContent = decimalToFractionDisplay(railThickness);
        netBalusterHeightFractionDisplay.textContent = decimalToFractionDisplay(values.netBalusterHeight);
    }
    
    // Draw the stair visualization
    function drawStairVisualization(values) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up scaling and positioning
        const scale = 8; // Reduced scale factor to fit more neatly
        const margin = 70; // Increased margin for more space around the drawing
        const offsetX = margin;
        const offsetY = canvas.height - margin;
        
        // Draw a light grid for better spatial reference
        drawGrid(offsetX, offsetY, canvas.width - margin, canvas.height - margin, scale);
        
        // Draw multiple treads for better visualization
        const numTreads = 3;
        
        // Calculate rake angle for angled elements
        const rakeAngleRad = Math.atan(rise / run);
        
        // Draw dimension lines first (behind the geometry)
        for (let i = 0; i < numTreads; i++) {
            // Calculate positions for this tread
            const treadStartX = offsetX + i * run * scale;
            const treadStartY = offsetY - i * rise * scale;
            
            // Only draw dimensions for the first tread
            if (i === 0) {
                // Draw tread dimensions with CAD-style extension lines
                drawCADDimension(
                    treadStartX, treadStartY + 30, 
                    treadStartX + run * scale, treadStartY + 30, 
                    decimalToFraction(run), 
                    'horizontal'
                );
                
                drawCADDimension(
                    treadStartX - 30, treadStartY, 
                    treadStartX - 30, treadStartY - rise * scale, 
                    decimalToFraction(rise), 
                    'vertical'
                );
                
                // Draw rail height dimension
                drawCADDimension(
                    treadStartX - 60, treadStartY,
                    treadStartX - 60, treadStartY - railHeight * scale,
                    decimalToFraction(railHeight),
                    'vertical'
                );
                
                // Draw rail thickness dimension
                drawCADDimension(
                    treadStartX - 45, treadStartY - railHeight * scale,
                    treadStartX - 45, treadStartY - railHeight * scale + railThickness * scale,
                    decimalToFraction(railThickness),
                    'vertical'
                );
                
                // Draw baluster setback dimensions in a cleaner layout
                for (let j = 0; j < values.balusterSetbacks.length; j++) {
                    const setback = values.balusterSetbacks[j];
                    const balusterX = treadStartX + setback * scale;
                    
                    // Draw setback dimension with staggered vertical positions
                    drawCADDimension(
                        treadStartX, treadStartY + 50 + j * 15,
                        balusterX, treadStartY + 50 + j * 15,
                        decimalToFraction(setback),
                        'horizontal'
                    );
                }
            }
        }
        
        // Now draw the actual stair geometry on top
        for (let i = 0; i < numTreads; i++) {
            // Calculate positions for this tread
            const treadStartX = offsetX + i * run * scale;
            const treadStartY = offsetY - i * rise * scale;
            
            // Draw tread
            ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(treadStartX, treadStartY, run * scale, -rise * scale);
            ctx.fill();
            ctx.stroke();
            
            // Draw rail
            ctx.strokeStyle = '#e67e22';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(treadStartX, treadStartY - railHeight * scale);
            ctx.lineTo(treadStartX + run * scale, treadStartY - rise * scale - railHeight * scale);
            ctx.stroke();
            
            // Draw rail thickness as an angled rectangle parallel to the rake line
            ctx.fillStyle = 'rgba(230, 126, 34, 0.3)';
            ctx.strokeStyle = '#e67e22';
            ctx.lineWidth = 2;
            
            // Save the current context state
            ctx.save();
            
            // Draw angled rail thickness rectangle
            ctx.beginPath();
            // Translate to the starting point of the rail
            ctx.translate(treadStartX, treadStartY - railHeight * scale);
            // Rotate by the rake angle
            ctx.rotate(-rakeAngleRad);
            // Draw the rectangle (now aligned with the rake angle)
            ctx.rect(0, 0, Math.sqrt(Math.pow(run * scale, 2) + Math.pow(rise * scale, 2)), railThickness * scale);
            ctx.fill();
            ctx.stroke();
            
            // Restore the context to its original state
            ctx.restore();
            
            // Add rail thickness label for the first tread only
            if (i === 0) {
                // Calculate the midpoint of the rail
                const railMidX = treadStartX + run * scale / 2;
                const railMidY = treadStartY - railHeight * scale - rise * scale / 2;
                
                // Draw a background for the text to make it more readable
                const labelText = 'Rail Thickness';
                ctx.font = '12px monospace';
                const textWidth = ctx.measureText(labelText).width;
                
                // Save context for rotation
                ctx.save();
                ctx.translate(railMidX, railMidY);
                ctx.rotate(-rakeAngleRad);
                
                // Draw text background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(-textWidth / 2 - 5, -6, textWidth + 10, 16);
                
                // Draw text
                ctx.fillStyle = '#e67e22';
                ctx.fillText(labelText, -textWidth / 2, 4);
                
                // Restore context
                ctx.restore();
            }
            
            // Draw balusters from the top of the tread
            ctx.strokeStyle = '#9b59b6';
            ctx.lineWidth = 2;
            
            // Draw all balusters for this tread
            for (let j = 0; j < values.balusterSetbacks.length; j++) {
                const setback = values.balusterSetbacks[j];
                const balusterHeight = values.balusterHeights[j];
                
                const balusterX = treadStartX + setback * scale;
                const balusterY = treadStartY; // Top of the tread
                
                // Draw baluster
                ctx.beginPath();
                ctx.moveTo(balusterX, balusterY);
                ctx.lineTo(balusterX, balusterY - balusterHeight * scale);
                ctx.stroke();
                
                // Draw baluster height dimension for the first tread only
                if (i === 0) {
                    // Stack the baluster height dimensions vertically
                    // Each baluster gets its own vertical position
                    const verticalOffset = 20 + j * 30; // Increased spacing between dimensions
                    
                    drawCADDimension(
                        balusterX + verticalOffset, balusterY,
                        balusterX + verticalOffset, balusterY - balusterHeight * scale,
                        decimalToFraction(balusterHeight),
                        'vertical'
                    );
                }
            }
        }
        
        // Draw rake angle
        const rakeAngleX = offsetX + run * scale / 2;
        const rakeAngleY = offsetY;
        const rakeAngleRadius = 40;
        
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rakeAngleX, rakeAngleY, rakeAngleRadius, Math.PI, Math.PI - Math.atan(rise / run));
        ctx.stroke();
        
        // Draw rake angle text with background for better readability
        const angleText = `${values.rakeAngle.toFixed(1)}°`;
        ctx.font = '12px monospace';
        const textWidth = ctx.measureText(angleText).width;
        
        // Draw text background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(rakeAngleX - 15, rakeAngleY - rakeAngleRadius - 15, textWidth + 10, 20);
        
        // Draw text
        ctx.fillStyle = '#2ecc71';
        ctx.fillText(angleText, rakeAngleX - 10, rakeAngleY - rakeAngleRadius - 5);
        
        // Draw a legend directly on the canvas
        drawLegendOnCanvas(canvas.width - 150, 50);
    }
    
    // Helper function to draw a light grid
    function drawGrid(startX, startY, width, height, gridSize) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 0.5;
        
        // Draw horizontal grid lines
        for (let y = startY; y >= startY - height; y -= gridSize) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + width, y);
            ctx.stroke();
        }
        
        // Draw vertical grid lines
        for (let x = startX; x <= startX + width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - height);
            ctx.stroke();
        }
    }
    
    // Helper function to draw a legend directly on the canvas
    function drawLegendOnCanvas(x, y) {
        const items = [
            { color: '#3498db', label: 'Tread' },
            { color: '#e67e22', label: 'Rail' },
            { color: '#9b59b6', label: 'Baluster' },
            { color: '#2ecc71', label: 'Dimension' }
        ];
        
        const boxSize = 12;
        const padding = 5;
        const lineHeight = 20;
        
        // Draw legend background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.fillRect(x - padding, y - padding, 100, items.length * lineHeight + padding * 2);
        ctx.strokeRect(x - padding, y - padding, 100, items.length * lineHeight + padding * 2);
        
        // Draw legend items
        items.forEach((item, index) => {
            const itemY = y + index * lineHeight;
            
            // Draw color box
            ctx.fillStyle = item.color;
            ctx.fillRect(x, itemY, boxSize, boxSize);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, itemY, boxSize, boxSize);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px monospace';
            ctx.fillText(item.label, x + boxSize + 5, itemY + boxSize - 2);
        });
    }
    
    // Helper function to draw a CAD-style dimension with extension lines
    function drawCADDimension(x1, y1, x2, y2, text, orientation = 'horizontal') {
        const extensionLength = 5;
        const arrowSize = 5;
        const textPadding = 3;
        
        // Set styles for dimension lines
        ctx.strokeStyle = '#2ecc71';
        ctx.fillStyle = '#2ecc71';
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
            ctx.lineTo(x1 + arrowSize, y1 - arrowSize);
            ctx.lineTo(x1 + arrowSize, y1 + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Arrow 2
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize, y2 - arrowSize);
            ctx.lineTo(x2 - arrowSize, y2 + arrowSize);
            ctx.closePath();
            ctx.fill();
        } else {
            // Arrow 1
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - arrowSize, y1 + arrowSize);
            ctx.lineTo(x1 + arrowSize, y1 + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Arrow 2
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize, y2 - arrowSize);
            ctx.lineTo(x2 + arrowSize, y2 - arrowSize);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw dimension text with background for better readability
        ctx.font = '12px monospace';
        const textWidth = ctx.measureText(text).width;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // Draw text background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        if (orientation === 'horizontal') {
            ctx.fillRect(midX - textWidth / 2 - textPadding, midY - 15, textWidth + textPadding * 2, 20);
        } else {
            ctx.fillRect(midX + 5, midY - 10, textWidth + textPadding * 2, 20);
        }
        
        // Draw text
        ctx.fillStyle = '#2ecc71';
        if (orientation === 'horizontal') {
            ctx.fillText(text, midX - textWidth / 2, midY);
        } else {
            ctx.fillText(text, midX + 10, midY);
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
    
    // Initialize
    updateAll();
}); 