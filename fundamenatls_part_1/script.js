"use strict"; // this should be the first line in the script to apply the strict mode.
/* You can use strict mode in all your programs. It helps you to write cleaner code, like preventing you from using undeclared variables ex=> like hoisting in JS enables
    us to use undeclared variables, and you will also see some major disadavantages of using var keyword which support hoisting if strict mode is not used. */
// "use strict" is just a string, so IE 9 will not throw an error even if it does not understand it.

const firstName = "parth";
const year = 2020;
const birthYear = 2000;

/* string template literal -: write everything inside of ` ` , to use a expression in B/W a string use ${expression} and we can even write 
                              multiple line of strings without even using '\n\'(which was a bug in JS).  */

const parth = `I'm ${firstName}, a ${year - birthYear} old developer!`;
console.log(parth);

// NOTE-: To add emojis in VS code editor 'windows + .' in windows for mac-: 'CMD + Ctrl + space'

const birthyear = 2000;
let century;

if (birthYear <= 2000) {
  century = 20;
} else {
  century = 21;
}
console.log(century); // NOTE-: this would have given an error here if century variable was defined inside if{} block using 'let', cause 'let'
//  is block scoped and varibale defined with 'let' won't be accessed outside the if {} block.

// Type conversion
const inputYear = "2000";
console.log(Number(inputYear) + 27); // output = 2027
console.log(Number("parth")); // output = NaN
console.log(typeof NaN); // output = Number, cause NaN is still a number but it is a invalid Number

// Type coercion
console.log("I'm parth, a " + 20 + " years old developer");
/* NOTE-: whenever we use '+' operator with string JS will automatically convert the other data type into a String, but it is not same for other
          algebraic operators */
console.log("23" - "10" - 7); // output = 6
console.log("23" * "5"); // output = 115
console.log("25" / "2"); // output = 12.5
console.log("27" > 98); // output = false

// NOTE-: Watch the difference B/W Type Coercion and Type Conversion in "Numbers, dates, intl and timers" folder.

let n = "1" + 1;
n = n - 1;
console.log(n); // output = 10

/* NOTE-: JS Type coerce anything to Boolean only if-:  1. if the value is truthy or falsy. ex-: if we use 'NaN' in a if(){} statement as a condition 
          to check, JS will automatically convert NaN into false  
          2. when we use logical or ternary operators.*/

// NOTE-: Switch Statement does strict comparison like '===' not like '=='
