const randomNumber = Math.floor(Math.random() * 50) + 1;
let chances = 5;
let gameOver = false;

console.log("Welcome to the Number Guessing Game!");
console.log("I'm thinking of a number between 1 and 50.");
console.log(`You have ${chances} chances to guess it.`);

function playGame() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askGuess() {
        if (chances <= 0 || gameOver) {
            readline.close();
            return;
        }

        readline.question(`\nEnter your guess (${chances} chance(s) left): `, (input) => {
            const guess = parseInt(input);

            if (guess < 1 || guess > 50) {
                console.log("Please enter a valid number between 1 and 50.");
                askGuess();
                return;
            }

            chances--;

            if (guess === randomNumber) {
                console.log("🎉 Correct! You guessed the number.");
                gameOver = true;
                readline.close();
            } else if (guess > randomNumber) {
                console.log("Too high! Try again.");
            } else {
                console.log("Too low! Try again.");
            }

            if (chances === 0 && !gameOver) {
                console.log(`❌ Game Over! The correct number was ${randomNumber}.`);
                readline.close();
            } else if (!gameOver) {
                askGuess();
            }
        });
    }

    askGuess();
}
playGame();