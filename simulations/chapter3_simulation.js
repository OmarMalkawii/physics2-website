// Chapter 3: Electric Potential Simulation
// Uses global k_coulomb from script.js
let charges_ep = [];
let potentialDisplay_ep;
let draggedCharge_ep = null;
let canvas_ep_sim;

const sketchElectricPotential = (p) => {
    const canvasWidth = 500;
    const canvasHeight = 400;
    const chargeRadius_ep = 8;
    const nanoCoulomb_ep = 1e-9;
    const potentialLevels = 15; // Number of equipotential lines to attempt to draw

    p.setup = () => {
        canvas_ep_sim = p.createCanvas(canvasWidth, canvasHeight);
        canvas_ep_sim.parent('electricPotentialSimulationCanvas');
        potentialDisplay_ep = p.select('#potentialValueDisplay');

        // Initial charge
        charges_ep.push({ x: p.width / 2, y: p.height / 2, q: 2 * nanoCoulomb_ep, color: p.color(255, 0, 0), radius: chargeRadius_ep });
        
        document.getElementById('addPositiveChargeBtnPotential').onclick = () => addChargePotential(1 * nanoCoulomb_ep, p.color(255,0,0));
        document.getElementById('addNegativeChargeBtnPotential').onclick = () => addChargePotential(-1 * nanoCoulomb_ep, p.color(0,0,255));
        document.getElementById('clearChargesBtnPotential').onclick = () => { charges_ep = [];};


        p.textAlign(p.CENTER, p.CENTER);
        p.noFill();
    };
    
    function addChargePotential(q_val, col) {
        charges_ep.push({
            x: p.random(chargeRadius_ep, p.width - chargeRadius_ep),
            y: p.random(chargeRadius_ep, p.height - chargeRadius_ep),
            q: q_val,
            color: col,
            radius: chargeRadius_ep
        });
    }


    p.draw = () => {
        p.background(240);
        drawEquipotentialLines();
        drawChargesPotential();
        displayPotentialAtMouse();
    };

    function calculatePotential(x, y) {
        let totalPotential = 0;
        for (const charge of charges_ep) {
            let dx = x - charge.x;
            let dy = y - charge.y;
            let r = p.sqrt(dx * dx + dy * dy);
            if (r < charge.radius / 2) return charge.q > 0 ? Infinity : -Infinity; // Inside charge
            if (r === 0) continue; // Avoid division by zero if exactly on charge
            totalPotential += (k_coulomb * charge.q) / r;
        }
        return totalPotential;
    }

    function drawEquipotentialLines() {
        if (charges_ep.length === 0) return;

        // Find min/max potential for scaling (simplified approach)
        let minPot = Infinity, maxPot = -Infinity;
        // A single central charge example for scaling:
        if (charges_ep.length > 0) {
            let testCharge = charges_ep[0];
            minPot = (k_coulomb * testCharge.q) / (p.width/2); // Approx potential at edge
            maxPot = (k_coulomb * testCharge.q) / (chargeRadius_ep * 2); // Approx potential near charge
             if (testCharge.q < 0) [minPot, maxPot] = [maxPot, minPot];
        }
        if (!isFinite(minPot) || !isFinite(maxPot) || minPot === maxPot) {
            minPot = -50; maxPot = 50; // Default if calculation is problematic
        }


        const potStep = (maxPot - minPot) / (potentialLevels +1);

        for (let i = 1; i <= potentialLevels; i++) {
            let targetPotential = minPot + i * potStep;
            if (Math.abs(targetPotential) < 0.1) continue; // Skip near-zero potential for clarity

            // Determine color based on potential value
            let R = targetPotential > 0 ? p.map(targetPotential, 0, maxPot, 150, 255) : p.map(Math.abs(targetPotential), 0, Math.abs(minPot), 150, 0);
            let B = targetPotential < 0 ? p.map(Math.abs(targetPotential), 0, Math.abs(minPot), 150, 255) : p.map(targetPotential, 0, maxPot, 150, 0);
            let G = p.map(Math.abs(targetPotential), 0, Math.max(Math.abs(minPot), maxPot), 150, 50);
            p.stroke(R,G,B, 150);
            p.strokeWeight(1.5);

            // Simple contouring: check grid points (computationally intensive for smooth lines)
            // This is a very simplified contouring by drawing circles for a single charge
            // For multiple charges, true contouring is much more complex.
            // Here, we draw circles around each charge representing an equipotential if it were alone.
            for (const charge of charges_ep) {
                 if (charge.q === 0 || targetPotential / charge.q <=0 ) continue; // k_coulomb*q / r = V => r = k_coulomb*q / V
                 let r_equiv = (k_coulomb * charge.q) / targetPotential;
                 if (r_equiv > charge.radius && r_equiv < p.width * 1.5) { // Draw if reasonable radius
                     p.noFill();
                     p.ellipse(charge.x, charge.y, r_equiv * 2, r_equiv * 2);
                 }
            }
             // For a more general but still simplified approach, one might iterate pixels or use a marching squares variant.
             // For this demo, the above shows the principle for isolated charges.
        }
    }


    function drawChargesPotential() {
        for (const charge of charges_ep) {
            p.fill(charge.color);
            p.noStroke();
            p.ellipse(charge.x, charge.y, charge.radius * 2, charge.radius * 2);
            p.fill(charge.q > 0 ? 0: 255);
            p.text((charge.q / nanoCoulomb_ep).toFixed(0) + "nC", charge.x, charge.y);
        }
    }

    function displayPotentialAtMouse() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let potential = calculatePotential(p.mouseX, p.mouseY);
            potentialDisplay_ep.html(potential.toPrecision(3));
        } else {
            potentialDisplay_ep.html("N/A");
        }
    }
    
    p.mousePressed = () => {
        for (let i = charges_ep.length - 1; i >= 0; i--) {
            const charge = charges_ep[i];
            if (p.dist(p.mouseX, p.mouseY, charge.x, charge.y) < charge.radius) {
                draggedCharge_ep = charge;
                charges_ep.splice(i, 1); // Remove and add to end to draw on top
                charges_ep.push(draggedCharge_ep);
                break;
            }
        }
    };

    p.mouseDragged = () => {
        if (draggedCharge_ep) {
            draggedCharge_ep.x = p.constrain(p.mouseX, 0, p.width);
            draggedCharge_ep.y = p.constrain(p.mouseY, 0, p.height);
        }
    };

    p.mouseReleased = () => {
        draggedCharge_ep = null;
    };
};
new p5(sketchElectricPotential);