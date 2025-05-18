// Chapter 2: Gauss's Law Simulation
// Uses global k_coulomb and epsilon_0 from script.js

let chargeSlider_gl;
let chargeValueDisplay_gl;
let centralCharge_q_gl = 1e-9; // 1 nC initially
let canvas_gl;

const sketchGaussLaw = (p) => {
    const canvasWidth = 500;
    const canvasHeight = 400;
    const gaussianSurfaceRadius = 100;
    const numFieldLinesFactor = 20; // Lines per nanoCoulomb (approx for visual)

    p.setup = () => {
        canvas_gl = p.createCanvas(canvasWidth, canvasHeight);
        canvas_gl.parent('gaussLawSimulationCanvas');
        chargeSlider_gl = p.select('#gaussChargeSlider');
        chargeValueDisplay_gl = p.select('#gaussChargeValue');
        chargeSlider_gl.input(updateCharge_gl);
        updateCharge_gl(); // Initialize
        p.angleMode(p.DEGREES);
    };

    function updateCharge_gl() {
        centralCharge_q_gl = parseFloat(chargeSlider_gl.value()) * 1e-9; // Convert nC from slider to C
        chargeValueDisplay_gl.html(chargeSlider_gl.value());
    }

    p.draw = () => {
        p.background(240);
        let centerX = p.width / 2;
        let centerY = p.height / 2;

        // Draw Gaussian Surface (Sphere)
        p.stroke(100, 100, 255, 150); // Light blue for Gaussian surface
        p.noFill();
        p.strokeWeight(2);
        p.ellipse(centerX, centerY, gaussianSurfaceRadius * 2, gaussianSurfaceRadius * 2);

        // Draw Central Charge
        if (centralCharge_q_gl > 0) {
            p.fill(255, 0, 0); // Red for positive
        } else if (centralCharge_q_gl < 0) {
            p.fill(0, 0, 255); // Blue for negative
        } else {
            p.fill(150); // Grey for neutral
        }
        p.noStroke();
        p.ellipse(centerX, centerY, 15, 15);

        // Draw Field Lines (representing flux)
        // Number of lines proportional to charge magnitude
        let numLines = Math.abs(Math.round(centralCharge_q_gl / 1e-9 * numFieldLinesFactor)); 
        numLines = p.constrain(numLines, 0, 360); // Cap lines for visual clarity

        if (numLines > 0) {
            p.stroke(0, 150, 0); // Green for field lines
            p.strokeWeight(1);
            for (let i = 0; i < numLines; i++) {
                let angle = (360 / numLines) * i;
                let startX = centerX;
                let startY = centerY;
                // Extend lines beyond Gaussian surface to show they pass through
                let endX = centerX + p.cos(angle) * (gaussianSurfaceRadius + 60);
                let endY = centerY + p.sin(angle) * (gaussianSurfaceRadius + 60);
                
                p.line(startX, startY, endX, endY);

                // Arrowhead
                p.push();
                p.translate(endX, endY);
                p.rotate(angle);
                if (centralCharge_q_gl < 0) p.rotate(180); // Point inward for negative charge
                p.line(0, 0, -6, -3);
                p.line(0, 0, -6, 3);
                p.pop();
            }
        }
        
        // Display Flux value (calculated)
        let flux = centralCharge_q_gl / epsilon_0;
        p.fill(0);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Enclosed Charge: ${(centralCharge_q_gl/1e-9).toFixed(1)} nC`, 10, 10);
        p.text(`Calculated Flux (Φ = q/ε₀): ${flux.toExponential(2)} N·m²/C`, 10, 30);
    };
};
new p5(sketchGaussLaw);