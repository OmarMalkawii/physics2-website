// Chapter 1: Electric Fields Simulation
// Uses global k_coulomb from script.js

let charges_ef = [];
let draggedCharge = null;
let canvas_ef;

const sketchElectricField = (p) => {
    const canvasWidth = 500;
    const canvasHeight = 400;
    const gridSpacing = 25; // For drawing field vectors
    const chargeRadius = 10;
    const nanoCoulomb = 1e-9;

    p.setup = () => {
        canvas_ef = p.createCanvas(canvasWidth, canvasHeight);
        canvas_ef.parent('electricFieldSimulationCanvas');

        document.getElementById('addPositiveChargeBtn').onclick = () => addCharge(1 * nanoCoulomb, p.color(255, 0, 0)); // Red for positive
        document.getElementById('addNegativeChargeBtn').onclick = () => addCharge(-1 * nanoCoulomb, p.color(0, 0, 255)); // Blue for negative
        document.getElementById('clearChargesBtn').onclick = () => charges_ef = [];

        p.textAlign(p.CENTER, p.CENTER);
    };

    function addCharge(q_val, col) {
        charges_ef.push({
            x: p.random(chargeRadius, p.width - chargeRadius),
            y: p.random(chargeRadius, p.height - chargeRadius),
            q: q_val, // Store charge in Coulombs
            color: col,
            radius: chargeRadius
        });
    }

    p.draw = () => {
        p.background(240);
        drawGrid();
        drawFieldVectors();
        drawCharges();
    };

    function drawGrid() {
        p.stroke(200);
        p.strokeWeight(0.5);
        for (let x = 0; x < p.width; x += gridSpacing) {
            p.line(x, 0, x, p.height);
        }
        for (let y = 0; y < p.height; y += gridSpacing) {
            p.line(0, y, p.width, y);
        }
    }

    function drawFieldVectors() {
        for (let x = gridSpacing / 2; x < p.width; x += gridSpacing) {
            for (let y = gridSpacing / 2; y < p.height; y += gridSpacing) {
                let totalEx = 0;
                let totalEy = 0;
                let tooClose = false;

                for (const charge of charges_ef) {
                    let dx = x - charge.x;
                    let dy = y - charge.y;
                    let rSq = dx * dx + dy * dy;
                    let r = p.sqrt(rSq);

                    if (r < charge.radius / 2) { // Don't draw field inside charge or too close
                        tooClose = true;
                        break;
                    }
                    if (r === 0) continue;

                    let E_mag = (k_coulomb * charge.q) / rSq;
                    totalEx += E_mag * (dx / r);
                    totalEy += E_mag * (dy / r);
                }

                if (tooClose) continue;

                let E_vec_mag = p.sqrt(totalEx * totalEx + totalEy * totalEy);
                if (E_vec_mag === 0) continue;

                // Normalize and scale for display
                let displayEx = totalEx / E_vec_mag;
                let displayEy = totalEy / E_vec_mag;
                
                // Logarithmic scaling for arrow length might be better, but for simplicity:
                let arrowLength = p.constrain(E_vec_mag * 5e7, 5, gridSpacing * 0.8); // Adjust multiplier for visual scale

                p.push();
                p.translate(x, y);
                p.rotate(p.atan2(displayEy, displayEx));
                p.stroke(0, 150, 0); // Green for field lines
                p.strokeWeight(1.5);
                p.line(0, 0, arrowLength, 0);
                p.line(arrowLength, 0, arrowLength - 4, -2); // Arrowhead
                p.line(arrowLength, 0, arrowLength - 4, 2);  // Arrowhead
                p.pop();
            }
        }
    }

    function drawCharges() {
        for (const charge of charges_ef) {
            p.fill(charge.color);
            p.noStroke();
            p.ellipse(charge.x, charge.y, charge.radius * 2, charge.radius * 2);
            p.fill(255);
            p.text(charge.q / nanoCoulomb + "nC", charge.x, charge.y);
        }
    }

    p.mousePressed = () => {
        for (let i = charges_ef.length - 1; i >= 0; i--) {
            const charge = charges_ef[i];
            if (p.dist(p.mouseX, p.mouseY, charge.x, charge.y) < charge.radius) {
                draggedCharge = charge;
                // Bring to front (optional, for better dragging feel if overlapping)
                charges_ef.splice(i, 1);
                charges_ef.push(draggedCharge);
                break;
            }
        }
    };

    p.mouseDragged = () => {
        if (draggedCharge) {
            draggedCharge.x = p.constrain(p.mouseX, 0, p.width);
            draggedCharge.y = p.constrain(p.mouseY, 0, p.height);
        }
    };

    p.mouseReleased = () => {
        draggedCharge = null;
    };
};
new p5(sketchElectricField);