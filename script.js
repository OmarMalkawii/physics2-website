// Constants
const k_coulomb = 8.99e9; // Coulomb's constant (N·m²/C²)
const epsilon_0 = 8.85e-12; // Permittivity of free space (C²/N·m² or F/m)

// --- CALCULATOR FUNCTIONS ---

// Chapter 1: Electric Field Calculator
function calculateElectricField() {
    const chargeInput = document.getElementById('charge_q');
    const distanceInput = document.getElementById('distance_r');
    const resultDiv = document.getElementById('result_ef');

    const q = parseFloat(chargeInput.value);
    const r = parseFloat(distanceInput.value);

    if (isNaN(q) || isNaN(r)) {
        resultDiv.textContent = 'Result: Please enter valid numbers for charge and distance.';
        return;
    }
    if (r <= 0) { // Distance must be positive
        resultDiv.textContent = 'Result: Distance must be positive.';
        return;
    }

    const electricField = (k_coulomb * q) / (r * r);
    resultDiv.textContent = `Result: E = ${electricField.toExponential(3)} N/C`;
}

// Chapter 2: Electric Flux Calculator (Gauss's Law)
function calculateElectricFlux() {
    const chargeInput = document.getElementById('charge_q_gl');
    const resultDiv = document.getElementById('result_gl');

    const q = parseFloat(chargeInput.value);

    if (isNaN(q)) {
        resultDiv.textContent = 'Result: Please enter a valid number for charge.';
        return;
    }

    const electricFlux = q / epsilon_0;
    resultDiv.textContent = `Result: Φ = ${electricFlux.toExponential(3)} N·m²/C`;
}

// Chapter 3: Electric Potential Calculator
function calculateElectricPotential() {
    const chargeInput = document.getElementById('charge_q_ep');
    const distanceInput = document.getElementById('distance_r_ep');
    const resultDiv = document.getElementById('result_ep');

    const q = parseFloat(chargeInput.value);
    const r = parseFloat(distanceInput.value);

    if (isNaN(q) || isNaN(r)) {
        resultDiv.textContent = 'Result: Please enter valid numbers for charge and distance.';
        return;
    }
    if (r <= 0) { // Distance must be positive
        resultDiv.textContent = 'Result: Distance must be positive.';
        return;
    }

    const electricPotential = (k_coulomb * q) / r;
    resultDiv.textContent = `Result: V = ${electricPotential.toExponential(3)} Volts (V)`;
}

// Chapter 4: Capacitance Calculator
function calculateCapacitance() {
    const areaInput = document.getElementById('area_a');
    const distanceInput = document.getElementById('distance_d_cap');
    const kappaInput = document.getElementById('dielectric_kappa');
    const resultDiv = document.getElementById('result_cap');

    const A = parseFloat(areaInput.value);
    const d = parseFloat(distanceInput.value);
    const kappa = parseFloat(kappaInput.value);

    if (isNaN(A) || isNaN(d) || isNaN(kappa)) {
        resultDiv.textContent = 'Result: Please enter valid numbers for area, distance, and dielectric constant.';
        return;
    }
    if (d <= 0) {
        resultDiv.textContent = 'Result: Distance (d) must be positive.';
        return;
    }
    if (A <= 0) {
        resultDiv.textContent = 'Result: Area must be positive.';
        return;
    }
    if (kappa < 1) {
        resultDiv.textContent = 'Result: Dielectric constant (kappa) must be >= 1.';
        return;
    }

    const permittivity = kappa * epsilon_0;
    const capacitance = (permittivity * A) / d;
    resultDiv.textContent = `Result: C = ${capacitance.toExponential(3)} Farads (F)`;
}


// --- TRULY INTERACTIVE QUIZ FUNCTIONALITY ---
const answeredQuestions = {};

function handleQuizClick(event, questionId) {
    if (answeredQuestions[questionId]) {
        return; // Already answered this question
    }

    const selectedOptionEl = event.currentTarget; // The <li> that was clicked
    const questionDiv = document.getElementById(questionId);
    const options = questionDiv.querySelectorAll('ul li');
    const feedbackDiv = questionDiv.querySelector('.quiz-feedback');

    // Disable further clicks on all options for this question
    options.forEach(opt => {
        opt.style.pointerEvents = 'none'; // Make options unclickable after an answer
        opt.classList.remove('selected'); // Clear any previous "selected" class if any (though logic prevents re-answering)
    });

    selectedOptionEl.classList.add('selected'); // Mark the one they clicked

    const isCorrect = selectedOptionEl.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        selectedOptionEl.classList.add('correct');
        feedbackDiv.textContent = 'Correct!';
        feedbackDiv.className = 'quiz-feedback correct-feedback'; // Use class for styling
    } else {
        selectedOptionEl.classList.add('incorrect');
        feedbackDiv.textContent = 'Incorrect. The correct answer is highlighted in green.';
        feedbackDiv.className = 'quiz-feedback incorrect-feedback'; // Use class for styling
        // Highlight the actual correct answer
        options.forEach(opt => {
            if (opt.getAttribute('data-correct') === 'true') {
                opt.classList.add('correct'); // Show the actual correct one
            }
        });
    }
    
    answeredQuestions[questionId] = true; // Mark question as answered
}