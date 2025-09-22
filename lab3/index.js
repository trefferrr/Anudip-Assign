const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter numbers separated by spaces: ", (input) => {
  const numbers = input.trim().split(/\s+/).map(Number);

  if (numbers.length === 0) {
    console.log("No numbers entered.");
    rl.close();
    return;
  }

  function findEvenNumbers(arr) {
    return arr.filter(n => n % 2 === 0);
  }

  const evenNumbers = findEvenNumbers(numbers);

  const squaredNumbers = evenNumbers.map(n => n * n);

  const filteredNumbers = squaredNumbers.filter(n => n > 50);

  const sumOfFiltered = filteredNumbers.reduce((acc, n) => acc + n, 0);

  console.log("Original numbers:      ", numbers);
  console.log("Even numbers:          ", evenNumbers);
  console.log("Squared numbers:       ", squaredNumbers);
  console.log("Filtered (> 50):       ", filteredNumbers);
  console.log("Sum of filtered array: ", sumOfFiltered);

  rl.close();
});
