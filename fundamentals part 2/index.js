"use strict"; /* it is considered to use this string in tbe begining of the script and we can also use strict mode for a function or a block
                  1. it helps us showing visible errors 
                  2. it kind of stops us to have a bug in the code by consoling the error to the console.*/

// NOTE-: check difference B/W regular functions and arrow functions-:  https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/

// Arrow functions

/* Differences B/W arrow and regular functions
1. arrow function doesn't have any 'this' variable, means it doesn't have any execution context. So, 'this' variable for an arrow function points to the this of outer function(lexically) or to the global object(if there is no outer function). 
2. Since, it doesn't have a 'this' variable it can't be used as a function constructor.
3. arrow function doesn't have a special array-like object(arguments) containing the list of arguments with which the function has been invoked. Again (same as with this value), the arguments object is resolved lexically: the arrow function accesses arguments from the outer function.
4. no return statement is req. for single line arrow function.
5. In methods like setTimeout() and addEventListener a callback function is invoked simply like normal function call. so, "this keyword" always points to the window object(global object) thus we have to bind the "this keyword" to the actual object, but that is not true in the case of arrow functions(defined in a class) used as a callback because methods defined using an arrow binds "this keyword" lexically to the class instance(object). (most important difference)  */

const calcAge = (birthYear) => 2020 - birthYear; // if Arrow function has a single line of code than the vlaue/expression afetr '=>'
//  is the returning statement
// if Arrow function has more than one line of code.
const calcRetirementAge = (birthYear) => {
  const age = 2020 - birthYear;
  const yearsLeft = 65 - age;
  return yearsLeft; // when more than one line of code than we have to add the return statement.
};

// Arrow function when more than one parameter.
const calcYearsLeftRetirement = (birthYear, firstName) => {
  const age = 2020 - birthYear;
  const yearsLeft = 65 - age;
  return `${firstName} has ${yearsLeft} years left for retirement`;
};
console.log(calcYearsLeftRetirement(2000, "parth"));

// Arrays-:
const array = ["parth", "priya", "nikki"];
array.includes("parth"); // array.includes() is a ES6  method which checks wether the element is a part of the array.
// NOTE-: array.includes() method does a strict comparison(doesn't do type coersion) to check wether the element is in the array.

// Objects-:

// (v.imp.) NOTE-: Difference B/W Expressions and Arguments in JS-: https://2ality.com/2012/09/expressions-vs-statements.html
