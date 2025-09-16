const prompt = require("prompt-sync")({ sigint: true });  // ✅ this line is required

// Generate random number between 1 and 50
const target = Math.floor(Math.random() * 50) + 1;
let attempts = 5;

while (attempts > 0) {
  let guess = parseInt(prompt(`Guess a number between 1 and 50 (Chances left: ${attempts}): `));

  if (isNaN(guess)) {
    console.log("Please enter a valid number.");
    continue;
  }

  if (guess === target) {
    console.log("🎉 Correct! You guessed the number.");
    break;
  } else if (guess > target) {
    console.log("Too high! Try again.");
  } else {
    console.log("Too low! Try again.");
  }

  attempts--;

  if (attempts === 0) {
    console.log(`❌ Game Over! The correct number was ${target}.`);
  }
}
