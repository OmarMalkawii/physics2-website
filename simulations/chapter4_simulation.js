// Chapter 4: Capacitance Simulation
// Uses global epsilon_0 from script.js

let areaSlider_cap, distSlider_cap, kappaSlider_cap;
let areaValue_cap, distValue_cap, kappaValue_cap;
let simCapDisplay_cap, simEnergyDisplay_cap;
let canvas_cap;

// For simulation, convert slider values to representative physical values
const areaScaleFactor = 0.0001; // e.g., slider 10-100 maps to 0.001 - 0.01 m^2
const distScaleFactor = 0.0001; // e.g., slider 5-50 maps to 0.0005 - 0.005 m (0.5mm - 5mm)
const fixedVoltage = 1.0; // Assume 1V for energy calculation in sim

const sketchCapacitor = (p) => {
    const canvasWidth = 500;
    const canvasHeight = 300;

    p.setup = () => {
        canvas_cap = p.createCanvas(canvasWidth, canvasHeight);
        canvas_cap.parent('capacitorSimulationCanvas');

        areaSlider_cap = p.select('#capAreaSlider');
        distSlider_cap = p.select('#capDistSlider');
        kappaSlider_cap = p.select('#capKappaSlider');

        areaValue_cap = p.select('#capAreaValue');
        distValue_cap = p.select('#capDistValue');
        kappaValue_cap = p.select('#capKappaValue');

        simCapDisplay_cap = p.select('#simCapacitanceDisplay');
        simEnergyDisplay_cap = p.select('#simEnergyDisplay');

        areaSlider_cap.input(updateCapacitorSim);
        distSlider_cap.input(updateCapacitorSim);
        kappaSlider_cap.input(updateCapacitorSim);

        updateCapacitorSim(); // Initial call
    };

    function updateCapacitorSim() {
        let areaVal = areaSlider_cap.value();
        let distVal = distSlider_cap.value();
        let kappaVal = kappaSlider_cap.value();

        areaValue_cap.html(areaVal);
        distValue_cap.html(distVal);
        kappaValue_cap.html(kappaVal);

        // Visual parameters
        let plateHeight = p.map(areaVal, 10, 100, 50, p.height - 40); // Area represented by height
        let plateWidthVisual = 100; // Fixed visual width for simplicity
        let plateSeparationVisual = p.map(distVal, 5, 50, 10, 100);
        
        // Dielectric color based on kappa
        let dielectricColor = p.color(200, 200, 200, p.map(kappaVal, 1, 10, 0, 200));


        p.background(240);
        let topPlateY = (p.height - plateHeight) / 2;
        let bottomPlateY = topPlateY + plateHeight;
        
        let plateStartX = (p.width - plateWidthVisual - plateSeparationVisual) / 2;
        
        // Draw Dielectric
        p.fill(dielectricColor);
        p.noStroke();
        p.rect(plateStartX + plateWidthVisual / 2 - plateSeparationVisual/2, topPlateY, plateSeparationVisual, plateHeight);

        // Draw Plates
        p.fill(150); // Metal color
        p.stroke(50);
        p.strokeWeight(2);
        // Left Plate (visually)
        p.rect(plateStartX - plateWidthVisual/2 + plateSeparationVisual/2, topPlateY, plateWidthVisual, plateHeight);
        // Right Plate (visually)
        p.rect(plateStartX + plateWidthVisual/2 + plateSeparationVisual/2, topPlateY, plateWidthVisual, plateHeight);
        // Correction for centering if we consider the gap the center:
        let midPointX = p.width / 2;
        let leftPlateX = midPointX - plateSeparationVisual / 2 - plateWidthVisual;
        let rightPlateX = midPointX + plateSeparationVisual / 2;

        // Draw Dielectric (centered)
        p.fill(dielectricColor);
        p.noStroke();
        p.rect(midPointX - plateSeparationVisual/2, topPlateY, plateSeparationVisual, plateHeight);

        // Draw Plates (centered around the dielectric)
        p.fill(150);
        p.stroke(50);
        p.rect(leftPlateX, topPlateY, plateWidthVisual, plateHeight); // Plate 1
        p.rect(rightPlateX, topPlateY, plateWidthVisual, plateHeight); // Plate 2


        // Calculation for display
        let A_physical = areaVal * areaScaleFactor; // Use a scaled area for calculation
        let d_physical = distVal * distScaleFactor;
        let kappa_physical = parseFloat(kappaVal);

        if (d_physical > 0) {
            let capacitance = (kappa_physical * epsilon_0 * A_physical) / d_physical;
            let energy = 0.5 * capacitance * fixedVoltage * fixedVoltage;
            simCapDisplay_cap.html(`${capacitance.toExponential(3)} F`);
            simEnergyDisplay_cap.html(`${energy.toExponential(3)} J`);
        } else {
            simCapDisplay_cap.html("N/A (d=0)");
            simEnergyDisplay_cap.html("N/A");
        }
    }
};
new p5(sketchCapacitor);