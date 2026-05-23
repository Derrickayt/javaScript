// Retrieve the HTML element where the calculator values will be displayed.
const display = document.getElementById('display');

// Select all button elements on the page to attach event listeners to them.
const buttons = document.querySelectorAll('button');

// Store the current number being entered by the user, starting with '0'.
let currentValue = '0';

// Store the previous number entered before an operator was selected, initially empty.
let previousValue = null;

// Store the active mathematical operator (e.g., '+', '-', 'x', '/'), initially empty.
let operator = null;

// Flag to track if the display should clear on the next number key press.
let shouldResetDisplay = false;

// Attach a click event listener to each button on the calculator.
buttons.forEach(button => {
    // Listen for the click event on the button.
    button.addEventListener('click', () => {
        // Get the text content of the clicked button and trim any extra spaces.
        const buttonText = button.textContent.trim();

        // Check if the button is a digit or decimal point.
        if ((buttonText !== '' && !isNaN(buttonText)) || buttonText === '.') {
            // Handle number and decimal point input.
            handleNumber(buttonText);
        } else if (buttonText === 'AC') {
            // Clear the entire calculator state and reset the display.
            clearCalculator();
        } else if (buttonText === '+/-') {
            // Toggle the sign of the current value between positive and negative.
            toggleSign();
        } else if (buttonText === '%') {
            // Convert the current value to a percentage by dividing by 100.
            applyPercentage();
        } else if (buttonText === '=') {
            // Perform the mathematical calculation and update the display.
            performCalculation();
        } else {
            // Handle operator button clicks (+, -, x, /).
            handleOperator(buttonText);
        }
    });
});

// Function to handle digit and decimal input.
function handleNumber(digit) {
    // If the display should reset after an operation, start a new number.
    if (shouldResetDisplay) {
        // If the clicked key is a decimal, start with '0.' instead of just '.'.
        currentValue = digit === '.' ? '0.' : digit;
        // Reset the display flag so subsequent digits append to the number.
        shouldResetDisplay = false;
    } else {
        // If the number is currently '0' and a non-decimal digit is clicked.
        if (currentValue === '0' && digit !== '.') {
            // Replace the '0' with the new digit.
            currentValue = digit;
        } else if (digit === '.') {
            // If the user clicked a decimal point and the current number doesn't have one.
            if (!currentValue.includes('.')) {
                // Append the decimal point to the current number.
                currentValue += '.';
            }
        } else {
            // Append the clicked digit to the current number string.
            currentValue += digit;
        }
    }
    // Update the display to show the current value.
    updateDisplay();
}

// Function to clear all stored values and reset the calculator state.
function clearCalculator() {
    // Reset current value back to '0'.
    currentValue = '0';
    // Reset previous value back to null.
    previousValue = null;
    // Reset selected operator back to null.
    operator = null;
    // Turn off the display reset flag.
    shouldResetDisplay = false;
    // Update the display to reflect the reset state.
    updateDisplay();
}

// Function to toggle the sign of the current value.
function toggleSign() {
    // If the current value is '0', there is no sign to toggle.
    if (currentValue === '0') return;
    // If the current value already starts with a minus sign.
    if (currentValue.startsWith('-')) {
        // Remove the minus sign from the beginning of the string.
        currentValue = currentValue.substring(1);
    } else {
        // Prepend a minus sign to the current value string.
        currentValue = '-' + currentValue;
    }
    // Update the display to show the new signed value.
    updateDisplay();
}

// Function to divide the current value by 100 to get percentage.
function applyPercentage() {
    // Parse the current string value as a floating-point number.
    const val = parseFloat(currentValue);
    // If the parsed value is not a valid number, stop execution.
    if (isNaN(val)) return;
    // Divide the number by 100 and convert the result back to a string.
    currentValue = (val / 100).toString();
    // Update the display to show the percentage result.
    updateDisplay();
}

// Function to handle arithmetic operator button clicks.
function handleOperator(nextOperator) {
    // If an operator is already active and the user hasn't typed a new number yet.
    if (operator && shouldResetDisplay) {
        // Update the active operator to the new one that was clicked.
        operator = nextOperator;
        // Exit the function.
        return;
    }
    // If there is already a previous value and an operator waiting for calculation.
    if (previousValue !== null && operator) {
        // Calculate the intermediate result first.
        const result = calculate(previousValue, currentValue, operator);
        // If calculation resulted in division by zero error, reset calculator.
        if (result === 'Error') {
            // Set display to show the division by zero error.
            currentValue = 'Error';
            // Set display reset flag to true.
            shouldResetDisplay = true;
            // Clear previous value.
            previousValue = null;
            // Clear active operator.
            operator = null;
            // Update the display with 'Error'.
            updateDisplay();
            // Exit function.
            return;
        }
        // Set the current value to the calculated intermediate result.
        currentValue = result;
        // Update the display.
        updateDisplay();
    }
    // Store the current value as the previous value for the upcoming operation.
    previousValue = currentValue;
    // Store the clicked operator as the active operator.
    operator = nextOperator;
    // Set the flag to clear the display when the next digit is clicked.
    shouldResetDisplay = true;
}

// Function to perform the final calculation.
function performCalculation() {
    // If there is no active operator or no previous value, we cannot calculate.
    if (operator === null || previousValue === null) return;
    // Execute the math operation using helper calculate function.
    const result = calculate(previousValue, currentValue, operator);
    // Set current value to the final result string.
    currentValue = result;
    // Reset previous value back to null.
    previousValue = null;
    // Reset operator back to null.
    operator = null;
    // Set flag so the next button press resets the display.
    shouldResetDisplay = true;
    // Update the display to show the final result.
    updateDisplay();
}

// Helper function to perform arithmetic operations.
function calculate(val1, val2, op) {
    // Parse the first value string into a floating-point number.
    const num1 = parseFloat(val1);
    // Parse the second value string into a floating-point number.
    const num2 = parseFloat(val2);
    // If either value is not a valid number, return empty.
    if (isNaN(num1) || isNaN(num2)) return '';
    // Variable to hold the calculated outcome.
    let outcome = 0;
    // Switch on the active mathematical operator symbol.
    switch (op) {
        // Handle addition.
        case '+':
            // Add the two numbers.
            outcome = num1 + num2;
            // Break from switch statement.
            break;
        // Handle subtraction.
        case '-':
            // Subtract the second number from the first number.
            outcome = num1 - num2;
            // Break from switch statement.
            break;
        // Handle multiplication.
        case 'x':
            // Multiply the two numbers.
            outcome = num1 * num2;
            // Break from switch statement.
            break;
        // Handle division.
        case '/':
            // Check for division by zero.
            if (num2 === 0) {
                // Return 'Error' message.
                return 'Error';
            }
            // Divide the first number by the second number.
            outcome = num1 / num2;
            // Break from switch statement.
            break;
        // Default case if no operators match.
        default:
            // Return empty string.
            return '';
    }
    // Limit precision to 10 decimal places to prevent float rounding errors.
    const limitedOutcome = outcome.toFixed(10);
    // Parse float to remove trailing decimal zeros, then convert to string.
    return parseFloat(limitedOutcome).toString();
}

// Function to update the display element's text content.
function updateDisplay() {
    // Set the text content of the display div to the current value.
    display.textContent = currentValue;
}
