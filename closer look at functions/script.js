'use strict';

const bookings = [];

// NOTE-: while setting default value to a parameter we can even use previous parameters, but cannot use parameter defined after the current parameter.

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) {
  // ES5 version of settting defalut parameters.
  //   flightNum = flightNum || 1;
  //   price = price || 199;

  const booking = {
    //  new way of defining properties in ES6
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};
// console.log(bookings); if i would have log bookings array here than empty array would get printed, cause bookings array(inside createBooking function) will be filled after we call the functions.

createBooking('AIRBU728', 3);
createBooking('AIRBU728');
createBooking('AIRBU728', 4, 800);
createBooking('AIRBU728', undefined, 800); // undefined basically means skiping a parameter. and fucntion will consider the default value (if defined inside the function).

console.log(bookings);

// Passing value vs Reference to a function as a parameter.
console.log('-------------------pass-by-value-----------------');
const flight = 'LH245';
const parth = {
  name: 'Parth chauhan',
  passport: 2756466876,
};

const checkIn = function (flightNum, Passenger) {
  flightNum = 'LH657';
  console.log(flightNum);
  Passenger.name = 'Mr.' + Passenger.name;

  if (Passenger.passport === 2756466876) {
    console.log('check in');
  } else {
    console.log('You are not allowed to check in');
  }
};

checkIn(flight, parth); // JS always uses the pass-by-value method for primitive as well as for reference types-: In pass-by-value, a function is called by directly passing the value of the variable(flight) as argument(flightNum). Javascript always pass-by-value so that changing the value of the variable never changes the "underlying primitive(flight)".
console.log(flight, parth); // But in case of objects and arrays(or reference types) "JS always passes the reference and reference address is a value in itself". so any change in the argument, which is also a reference type passed will reflect in the underlying reference type.

// (v.v.v.imp.) NOTE-: JS only uses pass-by-value not pass-by-reference there is a difference in pass-by-reference and pass the reference(which is a memory location, a value)
//  NOTE-: pass-by-value always creates a space in memory and makes a copy of value.

// (v.v.imp.) NOTE-: console.log(flight, parth, flightNum); will give an error, beacuse lcoal variables(variable inside a function) are created when a function starts and gets deleted when a function is completed.

/* A-: First class functions-:  1-: means JS treats functions simply as values.
                                2-: JS treats functions simply as values cause in JS, functions are a special type of objects(which are values) that's why we were able to store them inside a variable and define them as properties of an object.
                                3-: functions are another "type of object".  
                            
    B-: Higher-order-functions-: 1-: functions can be passed as an argument to another function(which is called callback function.).
                                 2-: a function can return a function.
    DIfference-: First-class-functions is basically a feature a language either have or not, all it  means that functions are simply values, it is a concept.
                 But Higher-order-functions are practical they are based on the concept of first class functions. */
// callback function-: These  are functions that are passed as an argument and never called by their name(they are called by other functions, which are Higher-order functions).
console.log('--------------------Higher-order-functions----------------');
const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase(); // using regex instead of .replaceAll() method, "/ /g is all global spaces".
};

const toUpperCase = function (str) {
  const [First, ...others] = str.split(' ');
  return [First.toUpperCase(), ...others].join(' '); // the problem of passing  just others in the statement [First.toUpperCase(), others].join(' ') is-: others is a array as "we have used REST to make others variable" and if we just pass others as an array in the return statement than .join() will consider others as a primitive not an array and in the result everything inside others[] will be printed "," seperated not space seperated.
  // and using ...others will open up the "others array" and every element inside others array will be treated seperatedly by .join()
};

const higherOrder = function (str, fn) {
  console.log(`Original String-: ${str}`);
  console.log(`Transformed string-: ${fn(str)}`);
  console.log(`String  is transformed by-: ${fn.name} function`); // since, functions in JS are special objects. Functions in JS has properties and methods and "fn.name" is a one of the property.
};

higherOrder('Javascript is the best language', toUpperCase);
higherOrder('Javascript is the best language', oneWord);

/* NOTE-: Actually, Higher-order means that it introduces higher level of abstraction, we could have write the same code in upperCase and oneWord function into 
higherOrder function, but we have used abstraction instead. Callback function helps us splitting our code into reusable and interconnected parts(which is abstraction). */

// Function returning function.
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};
// const greet = greeting => name => console.log(`${greeting} ${name}`);  using arrow function.

const greetHey = greet('Hey'); // now here greetHey has the returning function.
greetHey('Parth');

greet('Hello')('Parth'); // another way to call the function returning function.

// bind, call and apply-:
console.log('------------------bind, call and apply---------------------');
const lufthansa = {
  airline: 'Lufthansa airlines',
  iataCode: 'LA',
  bookings: [],
  // book: function()
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}, name` });
  },
};

lufthansa.book(7936, 'Parth');
lufthansa.book(456, 'Jolie');
// console.log(lufthansa);

const euroWings = {
  // we are creating properties of same name as in lufthansa object cause we are gonna use book() method of lufthansa and that method has used properties of lufthansa.
  airline: 'EuroWings airlines',
  iataCode: 'EW',
  bookings: [],
};

const book = lufthansa.book;
// book('Mark taylor', 657); // this will give an error cause in the above line we have copied book() method value in book variable and now book is a simple function and call of a simple function has a this keyword of undefined type(in strict mode, otherwise it points to the window object. )
book.call(euroWings, 354, 'Mark taylor'); // as we know that functions in JS are special type of objects and like objects, functions also has methods like-: call(), bind() and apply()

book.apply(euroWings, [645, 'John Wayne']); // .apply() is same as .call() it just takes 2nd arg. as an array.
book.call(euroWings, ...[434, 'Ethan Hunt']); // instead of using .appply() method we can use .call() with spread operator.

// .bind()
// the diff. B/w (call,apply) and bind is that .bind() actually returns the function(that's why we were able to store it into an variable), whereas the other 2 methods immediately calls the function

const bookEw = book.bind(euroWings, 757); // here we can bind any parameter(we have binded the 1st parameter in the original function book into bookEw) and it won't be req. to pass 1st parameter any more while calling bookEw.
bookEw('Joseph');

lufthansa.planes = 300;
lufthansa.buyPlane = function () {
  console.log(this);

  this.planes++;
  console.log(this.planes);
};

document
  .querySelector('.buy')
  .addEventListener('click', lufthansa.buyPlane.bind(lufthansa)); // output = will return the lufthansa object and no. of planes.
// (imp.)-: if we would have used .call() method than it would have just called the .buyPlane method and planes count gets increemented even before clicking the button and after that if we click the button nothing would happen cause .call() just call the function for once not return the function/method

// NOTE-: wehenever we call addEventListener() method "this keyword" points to the element on which the addEventListener() is attched, in this case it is the button elements and in button element there exist no planes property that's why it is showing NaN(on doing ++ operatoion).

// Partial application-: is basically setting a pre parameter to a function using .bind()
const addTax = (rate, value) => value + value * rate;

console.log(addTax(0.1, 100));
console.log(addTax(0.4, 200));

const addVAT = addTax.bind(null, 0.23); // null is used because we don't want this keyword to be defined, and doing partial application using default values would be totally diff. and complex.
console.log(addVAT(199));
console.log(addVAT(199));

const addTaxNew = rate => value =>
  value + value * rate; /* this is same as-: const addTaxNew = function (rate) {
  return function (value) {
    return value + value * rate;
  };
}; */

const addVATnew = addTaxNew(0.23); // .bind() is used when we are borrowing any function, but here we are just storing the function value.
console.log(addVATnew(100));

///////////////////////////////////////
// Coding Challenge #1

/* 
Let's build a simple poll app!
A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.
Here are your tasks:
1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.
HINT: Use many of the tools you learned about in this and the last section 😉
BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?
BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]
GOOD LUCK 😀
*/
console.log('------------------coding challenge---------------');
const poll = {
  question: 'What is your favourite language?',
  options: ['0: JavaScript', '1: Rust', '2: Python', '3: C++'],
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    const answer = Number(
      prompt(
        `${this.question}\n${this.options.join('\n')}
        \n(write option number)`
      )
    );
    // short-circuiting using '&' opeartor
    typeof answer === 'number' &&
      answer < this.answers.length &&
      this.answers[answer]++;

    this.displayResults();
    this.displayResults('string');
  },

  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      console.log(`Poll results are ${this.answers.join(', ')}`);
    }
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

poll.displayResults.call({ answers: [5, 2, 3] }); // in displayResults method we were fetching the answers array from the poll method using this.answers now we want our seperate array to be passed in the displayResults method. so, we defined "this keyword" to a object containing the answers named array(we want to pass) into the call() method's first parameter.
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string'); // string is the normal argument to the displayResult() method.
// [5, 2, 3]
// [1, 5, 3, 9, 6, 1]

/* (v.imp.) NOTE-: We can trick JS and make anything a expression by wrapping it inside "()", that is the same trick we do for IIFE's. */

(function () {
  console.log('this function will never run again.');
})();

(() => console.log('this function will never run again.'))(); // using arrow function.

/* NOTE-: IIFE's are most of the time used for data encapsulation(data privacy), because function creates their own scope, but we can 
          do the same using let & const inside a block as we know that block also creates their own scopes and let & const variables
           are not accessible outside the block. */

{
  console.log(`it is same as using IIFE's for data encapsulation.`);
  let privateVar = 79;
  var notprivate = 6567;
}
// console.log(privateVar);
console.log(notprivate);

// IIFE's are not any feature, it is just a pattern.

/* Closures */
const secureBooking = function () {
  let passangerCount = 0;
  return function () {
    passangerCount++;
    console.log(`${passangerCount} passangers`);
  };
};

const booker = secureBooking();

booker();
booker();
booker();

/* (v.v.imp.) NOTE-: A Closure is closed over variable environment of the execution context in which a function was created, even after 
                     that execution context is gone.*/

console.dir(booker); // to check the scope of closure of booker.

// Example 1
let f;

const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};

g(); // on this line EC of "g function" has been terminated from call stack, still in the next line "f function" was able to
// access variable "a".
f();
console.dir(f); // till here f closure has only "variable a"(which was inside "g function")

// NOTE-: Watch vid-:137 if didn't understand.

// Re-assigning f function
h();
f();
console.dir(f); // till here f closure has only "variable b"(which was inside "h function")

// Example 2 (using timer)
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;
  setTimeout(function () {
    console.log(`we are now boarding all ${n} Passengers.`);
    console.log(
      `There are 3 groups each consisting of ${perGroup} passengers.`
    );
  }, wait * 1000);

  console.log(`Will start boarding in ${wait} seconds.`);
};

const perGroup = 1000; // NOTE-: perGroup is declared here again to show that "closures has priority over scope chain" and setTimeout() function would have used this perGroup variable since, the EC of outer function would get removed from call stack till setTimeOut() starts it's execution since, closures have priorities over scope chain perGroup variable inside outer function was used.

boardPassengers(180, 3);

// setTimeout()-: is used to set a timer. 1st parameter is the function which will get executed after the delay. 2nd parameter is the delay which is in milisecnds. ex- if wait = 3 than wait * 1000 in 2nd parameter is 3 seconds.

/* since, we are using the timer, which will cause a delay and the boardpassangers function will get executed before setTimeout()
   even starts it's execution and setTimeout() function can still access arguments and variables inside boardPassengers function because
   of closures. */

// challenge 2-:
(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';

  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });
})();

/* Since above function is an IIFE, header variable should have gone(or should not be accessible by any function) as soon as the
   code executed but still "header variable" was accessible by the function in eventListener because of closures. */
