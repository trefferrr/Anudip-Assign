// let prices = [250, 650, 300, 900, 50];

// for (let i = 0; i < prices.length; i++) {
//   prices[i] = prices[i] - (prices[i] * 0.10);
// }

// console.log(prices);

let sentence = "JavaScript is fun and powerful";

console.log("Uppercase:", sentence.toUpperCase());
console.log("Lowercase:", sentence.toLowerCase());

let words = sentence.split(" ");
console.log("Word count:", words.length);

console.log("First word:", words[0]);
console.log("Last word:", words[words.length - 1]);

let reversed = words.reverse().join(" ");
console.log("Reversed sentence:", reversed);

console.log("Contains 'JavaScript'?", sentence.includes("JavaScript"));

let replaced = sentence.replace("fun", "amazing");
console.log("After replacement:", replaced);

let sortedWords = sentence.split(" ").sort();
console.log("Sorted words:", sortedWords);

let joined = sortedWords.join(", ");
console.log("Joined sorted words:", joined);
