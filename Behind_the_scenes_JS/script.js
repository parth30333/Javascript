'use strict';
/* NOTE-: Code inside JS Engine is executed using(or JS engine is made up of these 2 things.) 1-: call stack 2-: heap stack.
   1-: call stack is used to execute our code using execution context. 
   2-: heap stack-: heap stack is a unstructured memory pool where all the objects that are req. in our application gets stored. */

/* NOTE-: Nowadys, Js Engines uses just-in-time compilation, each line is first converted to machine code than gets executed, this whole process 
          of just-in-time compilation happens line by line, no compiled file is created just like in other compiled languages.
          previously whole code was interpreted line by line than gets converted to machine code which was quite slower. */

// NOTE-: watch parsing(abstract syntax tree), compilation and optimization in  vid.90

/* NOTE-: JS Runtime environment in the "browser" has 1-: JS  Engine 
                                        2-: Web API's(these are not the part of JS, these are functionalities provided by web browsers using
                                             window object.)
                                        3-: callback queue-: a-:  overview of callback queue-: it contains all the callback functions and once the call stack is empty callback functions from callback queue are passed  to call stack for execution (very important and make sure to learn it later)
                                        3 (b)-: event loop-: it takes callback functions from the  callback queue to call stack with the help of event loop "JS non-blocking concurrency model" is implemented (learn it later in the course). 
           JS Runtime environment in "Node js" has 1-: JS engine
                                     2-: c++ bindings and thread pool(since web API's can only be provided by browsers.)
                                     3-: callback queue */

/* NOTE-: in 'ES6' "Block scope" is introduced,  but only variables declared with "let annd const" 
          are block scoped, functions are also block scoped in "strict mode".  */

/* v.v.imp NOTE-: check scope chain from 12:00 in vid. 92 and just after that watch scope chain vs call stack,also make sure while
         watching scope chain, that variable object of a "EC" only stores function declaration(of functions which are defined inside that function's EC) not the variables inside that declared function.  */

// (v.v.imp.) NOTE-: Watch vid-: 89 and learn all the important terms in thar video.

// Scoping in practice

function calcAge(birthYear) {
  const age = 2020 - birthYear;
  /*console.log(name); this will not give an error even if "name" is not declared because it is a special variable name and has already been defined in JS, we can even
   check by "uncomment-name-left click-definitions". */

  function printAge() {
    let output = `${firstName}, you are ${age} years old.`;
    console.log(output);

    if (birthYear >= 1981 && birthYear <= 1996) {
      var millenial = true;

      // creating New variable with same name as of outer scope's variable.
      const firstName = 'raj'; // similarly, we can have function arguments of same name as they are function scoped there will be no error.

      // reassigning outer scope's variable.
      output = 'NEW OUTPUT!'; // but if we would have used const output = 'NEW OUTPUT !';  than output would be different variable.

      const str = `${firstName} is a milenial`; // it will print firstName as 'raj' not 'parth' cause JS will look for "firstName" variable inside the nearest scope.
      console.log(str);

      function add(a, b) {
        return a + b;
      }
    }
    //console.log(add(2, 3)); will give an error, cause called outside the block scope.
    console.log(millenial); // will be printed even being inside the block scope, cause "millenial is declared with var" .
    console.log(output);
  }

  printAge();
  return age;
}

const firstName = 'Parth';
calcAge(1986);

//printAge(); wiil give an reference error as it is function scoped.

// Hoisting

/* NOTE-:                                   HOISTED ?                                 INITIAL VALUE                              SCOPE ?

    function declarations                     yes                                     Actual Funcion                               BLOCK (when using 'strict mode')

    var variables                             yes                                       Undefined                                  Function 

    let and const variables                  No (technically, they are hoisted but     Uninitialized,TDZ (Temporal dead zone,      BLOCK
                                              there value is set to Uninitialized)      means let and const are placed in a  
                                                                                        temporal dead zone and cannot be used  
                                                                                        before declarations. )                      
                                        
    
    function exp. and arrow functions         depends if using let, const or var         depends if using let, const or var         depends if using let, const or var
    */

/* NOTE-: Ques-: Why TDZ is used in JS?
          Ans-:  1-: accessing variables before declaration is a bad practice and should be avoided. ex-: after introduction of TDZ in ES6, whenever we use let and const variables 
                     in a TDZ Zone(space before declaration "inside the scope of that variable") JS gives an reference error: cannot use variable before initialization,
                     "cannot use before initialization" means let and const variables are actually hoisted (as JS is showing only initialization error not declaration
                     error) but they cannot be used like we could have used "var variables" and hoisting feature cannot be removed from JavaScript .  

                  2-: To make const variables work, cause we cannot assign a const variable twice (first assign it to undefined while hoisting and than assing it to the
                      real value in the code.)    


*/

// Hoisting in practice

// Functions
console.log(addDecl(2, 3));
// console.log(addExpr(2, 3));
console.log(addArrow);
// console.log(addArrow(2, 3));
function addDecl(a, b) {
  return a + b;
}
const addExpr = function (a, b) {
  return a + b;
};
var addArrow = (a, b) => a + b;
/* NOTE-: using var and let,const for function exp. and arrow  functions can give diff. errors. ex-: if we use a function exp.(with var) before declaration in code than 
          JS will give function is  not defined error cause when var variables are hoisted they are set to undefined  and calling a undefined value will give a error
          "function is not defined". similarly if we would have used let or const for function exp. than error = cannot access function before initialization. */

/* NOTE-: declaring function exp. or arrow functions and variables using var keyword can also "let you fall in a pit".
        
                                              // "PITFALL OF VAR KEYWORD"

                EXAMPLE-:  in this example, the task is to call deleteAllItems function when numProducts variable is zero      */

if (numProducts)
  deleteAllItems(); /* since, we know "0"  is a "falsy value" that's why i have not set the condition to if(numProducts === 0) and in 
                                       if statement we are using numProducts before it's declaration so "numProducts" will get assigned to 
                                "undefinded" and if statement will be executed even the numProduct is not zero.  */

var numProducts = 10;

function deleteAllItems() {
  console.log('Delete all Products!');
}

/* This Keyword 
  1-:  method => this => <object that is calling the method>
  
  2-:  simple function call => this => undefined(only when using strict mode), otherwise it points to the global object(window in case of browser).

  3-:  arrow functions => this =>  <this of surrounding("parent in the scope chain") function(lexical this), if there is no surrodunding means if the arrow function is used inside an object than 
                                    arrow function will point to the global object(or undefined in strict mode), beacuse we know that object doesn't creates its own 
                        scope and only parent left for arrow function outside the metohd is global object, so don't get fooled by the curly braces{} of object literal and consider it a code block, it is not , it is just an object literal used to define an object.>

  4-:  Event listener => this => <DOM element that handler(Listener or function passed as a parameter) is attached to >

  5-:  Call , Bind and Apply => this =>  "this" can be set mannually.
  */

// NOTE-: "PIFALL of "This Keyword" can be shown using "Arrow function" and "VAR  Keyword"

// var firstName = 'Parth';

// const jonas = {
// firstName: 'Jonas',
// year: 1991,
// calcAge: function () {
//console.log(this);
// console.log(2037 - this.year);
// },
//
// greet: () => {
// console.log(this); // Output = window object.
// console.log(`Hey ${this.firstName}`); // Output = Hey Parth, and that is the pitfall of using a arrow function as a method inside an object
// },
// };
//
// jonas.greet(); //  this might show error in the console cause we have declared firstName variable before in the code.

// NOTE-: "Don't use Arrow function as a "Parent method" inside an object" and "Don't declare variables with Var keyword" .

/* NOTE-: we say don't use arrow function as a parent or first method inside an object but we can use arrow function as child function inside a normal method in an object.
            
                      EXAMPLE-:  "Another PITFALL of this Keyword"*/

const jonas = {
  firstName: 'Jonas',
  year: 1991,
  calcAge: function () {
    // console.log(this);
    console.log(2037 - this.year);

    const isMillenial = function () {
      console.log(this.year >= 1981 && this.year <= 1996);
    };
    isMillenial(); // at this point JS will give an error-: "cannot read property of undefined", since isMillenial() is a simple function call and this is
    // undefined(since we are using strict mode) and undefined.year will obviously gives an error.

    /* Solution 1-: we can assign "this keyword" to the object jonas before even enetring the function isMillenial
       const self = this;
       const isMillenial = function () {
      console.log(self.year >= 1981 && self.year <= 1996);
    };
    isMillenial();     */

    /* Solution 2-: we can use arrow function when we are using child function like isMillenial, cause arrow function use the "this Keyword of the outer function",
                    which is this for the function calcAge function which is jonas .
      const isMillenial = () => {
        console.log(this.year >= 1981 && this.year <= 1996);
      };
      isMillenial(); */
  },
};

// NOTE-: "var keyword" creates a property of a variable inside the global object.

/* NOTE-:  this keyword doesn't point to the object where the method was defined "this" keyword points to the object that is calling that method. */

jonas.calcAge();

/* NOTE-: 1-: Arrow functions doesn't have a argument Array-like object that contains the values of the arguments passed to that function.
              (Array-like means the arguments passed into the function has length property and indexed from 0 to argument.(length -1) )
          2-: and from first point it means we can actually call the function with more than arguments passed into the function while declaration.    */

const regularFunction = function (a, b) {
  console.log(arguments);
  return a + b;
};
regularFunction(3, 4, 5, 6);

const arrowFunction = (a, b) => {
  console.log(arguments);
  return a + b;
};
arrowFunction(3, 5, 7, 8);

const greet = () => console.log(this);
greet();
