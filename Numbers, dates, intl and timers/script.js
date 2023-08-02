'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-01-08T16:33:06.386Z',
    '2021-01-01T14:43:26.374Z',
    '2021-01-13T18:49:59.371Z',
    '2021-01-02T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-01-06T16:33:06.386Z',
    '2021-01-13T14:43:26.374Z',
    '2021-01-01T18:49:59.371Z',
    '2021-01-12T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS-:

// format Functions-:
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed); // it will return a float value, cause the "date parameter" generated in displayMovements functions has dates of accounts which have time too and beacuse of that all the calculations are not in integer. do Math.round() in calcdaysPassed function.

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const year = date.getFullYear();
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display Functions-:
const displayMovements = function (acc, sort = false) {
  //  it is always better to pass argument  intsead of declaring movements in the global scope and than use it in the function.\

  containerMovements.innerHTML = ''; // to remove all the default or hardcoded data or to empty the container.
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // movements.slice()-:  to create a shallow copy, cause we don't wanted to mutate the original array(movements).

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // here we are looping over two arrays using a single forEach() loop by using the index of the array.

    const date = new Date(acc.movementsDates[i]); //  here we are converting the strings saved in movementsDates array into objects(cause new Date() is a constructor and constructor always return objects) so that we can use that data(objects) later.
    const displayDate = formatMovementsDate(date, acc.locale);
    const formattedCurr = formatCurrency(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__date">${displayDate}</div>
                    <div class="movements__value">${formattedCurr}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); // if we would have used beforebegin than order of movements occuring would have inverted.
  });
};
// displayMovements(account1.movements);
/* NOTE-: html code converted into string is the html for each(withdrawal or deposit) row in movements container(check using inspect) 
containerMovements is the container in which all the movements are stores that's why we have used innerAdjacentHTML on containerMovements. */

/* (v.imp.) NOTE-: 1-: it is important to remember that over Usage of chaining methods will decrease the performance of the code so, it is better to not use chaining methods unnecessarily. 
                   2-: and it is considered a bad practice to chain methods which actually changes(or mutates) the original array.  */
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0); // created balaance property to use it later for transferring and requesting for money.
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency
  );

  const expense = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(
    expense,
    account.locale,
    account.currency
  ); // Math.abs() to remove the -ve sign.

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1; // to remove the interest amounts which are less than 1.
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

// (v.v.imp.) NOTE-: we have used forEach to loop over accounts array cause we didn't wanted to create a new array for every account object's userName, as we know forEach() didn't return anything it would just mutate the accounts array.

/*const createUserName = function (accs) {
  const n = [];
  accs.forEach(function (acc) {
    acc.owner
      .toLowerCase()
      .split(' ')
      .forEach(function (name) {
        n.push(name[0]);
      });
    acc.userName = n.join('');
  });
};
    use this code to see the output and reason why we have not used forEach() as a inside lop. forEach() doesn't return anything. */

// console.log(createUserName(accounts)); // output = undefined as we are not returning anything from the function.
createUserName(accounts);
console.log(accounts);

const updateUIfunctions = function (acc) {
  // Display Movements
  displayMovements(acc);

  // Display Summary
  calcDisplaySummary(acc);

  // Display Balance
  calcDisplayBalance(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    // in each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // when time = 0 logout the user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started ';
    }

    // decrease 1s
    time--;
  };

  // set the time to 2 minutes
  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  console.log(timer);
  return timer;
};

// Problem-: when we log in another user before the logout time period of previous user than there would be 2 timer running and because of that the timer of the newly logged in user will not work properly-: for that we can return the timer than than check in btnLogin eventListener wether the timer exist or not than call the startLogoutTimer function.
// trick()-: we have defined the callback of the setInterval function seperately, cause the timer was not starting immediately when one logs in, to start the timer immediately we first call the callback function than pass it into the setInterval() so that timer keeps on updating after each delay(which is 1000ms  = 1sec).

// Event Listeners-:

/* (v.v.imp.) NOTE-:  To prevent submitting the form or to stop reloading the page on pressing submit button, there are two ways-:
                       1-: use button tag instead of input tag and in button tag use type = "button" 
                       2-: or we can use the event object which is the argument of callback function of eventListener which has all the details of the event-: event.preventDefault() */

/* (v.v.imp.) NOTE-: There is a good thing about submit button "inside a form" is-: pressing enter key will trigger click event on submit button.   */

let currentAccount, timer; // if we would have declared timer variable in login Event Listener than, as the login Event Listener gets executed for the 1st user, timer variable would dissappear(as a variable inside a functions execution context is removed as the function(handler function) completes its execution) and it would be impossible to check wether timer(for any old user) exist or not.

// // fake UI login-:
// currentAccount = account1;
// updateUIfunctions(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  ); // currentAccount holds the object with a userName entered in the username input field

  if (currentAccount?.pin === +inputLoginPin.value) {
    // instead of using another condition to check wether username === currentAccount.userName we have simply checked wether the object(object = currentAccount, which has the userName) exist or not using optional chaining.
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Display the UI after login-:
    containerApp.style.opacity = 100;

    // create current date and time-:
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      year: 'numeric',
      month: '2-digit',
      // weekDay: 'long', // we can use different values for the keys in "options argument for Intl.DateTimeFormat()" method-: check in vid-: 173 or on google
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now); // till new Intl.DateTimeFormat('en-US', Options) will create a formatter for the passed language in the argument and than we use .format() to format the date. The Formatter also accepts a options argument, which is used to customize date and time formats.

    // const year = now.getFullYear();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes} `;

    // clear input fields-:
    inputLoginUsername.value = inputLoginPin.value = ''; // we can do this beacuse associativity of "=  operator" is from right to left.
    inputLoginPin.blur(); // to remove the focus

    // Timer-:
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // update UI-:
    updateUIfunctions(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, recieverAccount);

  if (
    amount > 0 &&
    recieverAccount &&
    amount <= currentAccount.balance &&
    recieverAccount?.userName !== currentAccount.userName
  ) {
    // here only optional chaining woudn't work to check wether recieverAccount exist or not, cause if recieverAccount doesn't exist than "?." will set it to undefined and "undefined !== currentAccount.userName" is true

    // Doing Transfers-:
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // transfer dates-:
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    // update UI-:
    updateUIfunctions(currentAccount);

    // Reset the timer-: so that, we get enough time when there are action being performed in the account.
    clearInterval(timer);
    startLogoutTimer();

    // the movements we pushed in to the currentAccount and recieverAccount will be removed as we reload the page.
  }

  // Clearing the input fields-:
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // in "if statement" we have used currentAccount.userName cause, we want to limit the user to only delete his/her account not anyone's else account.

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // NOTE-: findIndex() method will return the index only unlike find() method which used to return a elements itself, also findIndex() and indexOf() methods have only diff. which is-: we can only search for elements which are in the array and with findIndex we can use a complex condition to check wether a element exist in a array and if so than it will return the index of the element.

    const index = accounts.findIndex(
      acc => inputCloseUsername.value === acc.userName
    );

    // Delete account
    accounts.splice(index, 1);
    console.log(accounts);

    // Hide UI-:
    containerApp.style.opacity = 0;
  }

  // clearing input fields-:
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // mov >= amount * 0.1 means Loan(amount > 0) is atleast 10% of any deposit in account.

  // we have used a timer for loan to make it look more practical as all banks takes some time to show the loan in your bank accout.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);

      // Loan Dates-:
      currentAccount.movementsDates.push(new Date().toISOString()); // .toISOString() is used, so the strings added(pushed) are of same format as all the already saved strings in account 1 & account 2 .

      // update UI-:
      updateUIfunctions(currentAccount);
    }, 3000);

    // Reset the timer-: so that, we get enough time when there are action being performed in the account.
    clearInterval(timer);
    startLogoutTimer();
  }
  // clear input fields-:
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// (v.v.v. imp.) NOTE-: sorted is defined in global scope so that we can change it even after using it in event Listener, and it is used as !sorted in the displayMovements argument cause we wanted a sorted whenever someone click on "sort in the app", and assigning sorted = !sorted, because if array is sorted and someone clicks on the sort button than array must go to it's original sorting order.(to make it more clear dry run it.)
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//////////////////////////////
// Lectures-:

/* In javascript all numbers are represnted as floating point numbers, means a single data type is used for all kind of numbers no matter wether it is a integer or a 
   decimal, because of that you will find problems with precision of decimals.TO know about floating point(IEEE 754)-: https://www.avioconsulting.com/blog/overcoming-javascript-numeric-precision-issues  */
console.log(23.0 === 23); // output = true.

// Numbers in JS are represented in 64 base 2 system (means 64 bits = size and everything is in binary = floating point representation).

// base 10 = 0 to 9 (decimal) 1/10 = 0.1 3/10 = 3.33333333333333333333333 the same thing happens in binary with 0.1 as it was happening in decimal with 3/10
// base 2  = 0 1 (binary) and  there are certain numbers that are difficult to use in base 2. watch example in next line
console.log(0.1 + 0.2);

// Conversion-:
console.log(Number('23'));
console.log(+'23'); // "+" does type coerce strings into integers.

// Parsing-:
console.log('---------- Parsing ---------------/');
console.log(Number.parseInt('30px')); // since, we know that Number is a "warppper object" and we can have method on it and parseInt() will remove anything other than number and will print the remaining number, but it doesn't work for strings(or any other datatype) that starts without number.
console.log(Number.parseInt('e35')); // parseFloat can also take a 2nd parameter(radix parameter), whichc specifies which number system should be used to do the conversion.

console.log(Number.parseInt('   2.5 rem'));
console.log(Number.parseFloat('   2.5 rem'));

// check if value is NaN-:
console.log('----------- Numeber.isNaN() ----------------');

console.log(Number.isNaN('24')); // it does type corce the values other than numeric values into numbers and returns true if the value is not a number(NaN)
console.log(Number.isNaN(20));
console.log(Number.isNaN('20rem'));
console.log(Number.isNaN(+'20x'));
console.log(Number.isNaN(+'20')); // cause "+" operator type coerce the string into a number.
console.log(Number.isNaN('')); // '' empty strings and strings with only spaces in JS are type coerced to 0 which is not NaN(means it is a number). for more check this-:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
console.log(Number.isNaN(23 / 0)); // isNaN() is not always a good method to check a number, cause infinity is not a number and it is still returning false.

// check if the value is a number-:
console.log('----------- Numeber.isFinite() --------------------');
console.log(Number.isFinite(244));
console.log(Number.isFinite(28 / 0));
console.log(Number.isFinite('8767')); // use always Number.isFinite() instead of just  isFinite() because without using wrapper class(Number) it can give some unexpected outputs like here if we use it without the wrapper object than it return true for a string.
console.log(Number.isFinite(+'678'));
console.log(Number.isFinite(+'78x'));

// check if the value is a integer-:
console.log('------- Numeber.isinteger() ----------------');
console.log(Number.isInteger(564));
console.log(Number.isInteger(564.0));
console.log(Number.isInteger(56 / 0));

// NOTE-: the go to method to read the value of a string is Number.parseFloat() ex-: when reading the css values

// Math and Rounding-:
console.log('--------------- Math and Rounding ------------------');
console.log(Math.sqrt(25));
console.log(25 ** 1 / 2); // 25  to the power 1/2
console.log(27 ** 1 / 3); // to find the cubic root

console.log(Math.max(13, 25, 51, 523, 632));
console.log(Math.max(13, 25, 51, '754', 632)); // it does type coercion
console.log(Math.max(13, 25, 51, '754px', 632)); // but it doesn't do parsing.
// differnce B/W type coercion and parsing is-: that type coercion is to convert a specific data type into another data type and parsing is to convert a value into a specific data type when it cannot be done by type coercion. ex-: in the above case Math.max() req. numeric values to compare for the largest number and '754x' is a string when it gets type coerced it removes the string part of '754px' which is 754px and it is not a number and parsing is to convert a "value to a data type" not like type coercion which was converting a "data type into a data type"
// parsing-: 754px is a value not a data type, even if we try to type coerce '754px' into a number it will throw a NaN because 754px does not belongs to any data type.

// (v.v.v.imp.) NOTE-: watch out type coercion in javaScript-: https://www.freecodecamp.org/news/js-type-coercion-explained-27ba3d9a2839/

console.log(Math.min(13, 25, 51, '754', 632));

console.log(Math.floor(Math.random() * 6 + 1)); // to produce a random dice roll

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0....1 -> 0......(max-min) -> (0.......(max-min)) +  min -> min.....max-min+min -> min.........max => means it will give all the numbers between max and min

console.log(randomInt(0, 255));

// Rounding Integers-: all these Rounding methods does type coercion
console.log('----------------- Rounding -----------------');

console.log(Math.round(23.4));
console.log(Math.round(23.8));

console.log(Math.ceil(23.2));
console.log(Math.ceil(23.7));

console.log(Math.floor(23.8));

console.log(Math.trunc(23.9));

console.log(Math.floor(-22.4));
console.log(Math.trunc(-22.7));

/* Difference B/W Math.rount, trunc, floor, ceil => var v = 3.14; [Math.trunc(v), Math.round(v), Math.floor(v), Math.ceil(v)]
 prints results
for different input values you get these results

v        t   r   f   c
3.87 : [ 3,  4,  3,  4]
3.14 : [ 3,  3,  3,  4]
-3.14 : [-3, -3, -4, -3]
-3.87 : [-3, -4, -4, -3]
*/

//  Remainder operator-: it is useful when we want to use anything for Nth times. ex-: when we want repeat something after every 2 times than we can use if(x % 2 === 0) or every 3 times than if(x % 3 === 0)

// Rounding Decimals-:

console.log((23).toFixed(2));
console.log((23.7567).toFixed(3));
console.log(+(23.7567).toFixed(3)); // .toFixed() returns a string, but + will convert it to a number.

// BigInt-:
console.log('-------------- BigInt --------------------');
// NOTE-: as we know JS uses 64 floating point numbers in which 53 bits(0 - 52 bits) are allocated solely to the integer value out of 64 bits, so sometimes 52 bits are not enough to store
//        a number ex-: a id or table entry id coming from a API, in those cases we req. "BigInt" primitive type. The safe limit is -(2**53 - 1) to 2**53 -1.

console.log(2 ** 53 - 1); // -1 because we are looking for the safest max. no. that can be represented
console.log(Number.MAX_SAFE_INTEGER); // same as above
console.log(2 ** 53 + 2); // not correct result.
console.log(2 ** 53 + 3);

console.log(675666666665645767238946782n);
console.log(BigInt(675666666665645767238946782)); // first JS represent the number internally before it can be transformed into a BigInt, that's why this number is different from the above number.

// NOTE-: So, use BigInt() only with small numbers or to convert a normal integer into a bigInt to perform normal operations, see multiplication example below. Ques-: in the end if we have to enter a small no. than why use BigInt(), see in the next line-:
const num = 23;
const huge = 23576575563425445632347988n;
console.log(BigInt(num) + huge); // it is not possible to use normal numbers(num) with BigInt's, in those cases we use BigInt() to transform a normal to a BigInt.

// Operations on BigInt-:
console.log(100000n + 100000n);
console.log(
  75466535237678789304912897328989765372466509840678978387678632681764234n *
    1456456345234122645n
);

// Exceptions-:
console.log(20n > 20); // false
console.log(20n === 20); // false  (cause "===" doesn't do type coercion)
console.log(typeof 78n); // bigInt
console.log(20n == '20'); // true

console.log(huge + ' is really a big number!'); // BigInt also gets converted to a string.

// console.log(Math.sqrt(16n)); // Math functions doesn't work here.

//  Divisons-:
console.log(11n / 3n); // it removes the fractional part.
console.log(12n / 3n);

// Create a Date-:
console.log('-------------- Creating Dates ---------------');
const today = new Date();
console.log(today);

// NOTE-: new date() is a function constructor and and it creates or returns a date object which will contain the date according to the parameter passed.

console.log(new Date('August 16 2020 16:05:54'));
console.log(new Date('August 16 2020')); // it also accepts a string as a parameter
console.log(new Date(account1.movementsDates[0]));

console.log(account1.movementsDates[0]); // here "Z" in the end stands for "UTC"(coordinated universal time), when we use "z" in the end of a time format than times(or dates) are expressed in local times, that's why we see india time format in the above line.

console.log(new Date(2037, 10, 23, 13, 45, 34)); // year, month, day, hours, min,. sec.
console.log(new Date(2037, 10, 34)); // since, we know november has only 30 days, so 34 here means next 3 days of the next month = 3 december.
// NOTE-: months in new Date() method is "0 based" that's why for 10th month it logs november.

// UNIx timestamp-:Unix timestamp is merely the number of seconds between a particular date and the Unix Epoch(unix epoch is the date jan 1 1970). so, seconds are calculated form the unix eopch to the date passed in.

console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3 days, each day 24 hours, 1hour = 60 min., 1 min= 60 sec,  1 sec = 10000 miliseconds, this time will be calculated from unix epoch(means 3 days after Jan 1 1970).
console.log(new Date(0)); // To get the unix epoch

// NOTE-: The Unix timeStamp is in seconds, but in JS Unix timestamp is in miliseconds.

// Working with dates-:
const future = new Date(2024, 10, 25, 22, 54);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay()); // it returns the day of the week.
console.log(future.getDate()); // to get the excat day of the month.
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds()); // we have not passed seconds.
console.log(future.toISOString()); // this string is represented by ISO standards
console.log(future.getTime()); // will return a timestamp till the time mentioned in future variable.

console.log(new Date(1732555440000)); // we can produce dates using time stamps as well.

console.log(Date.now()); // to get the timestamp from unix epoch

// (v.imp.) NOTE-: The Diff. B/W new Date() and Date.now() is-: new Date() returns/creates a object that represents the current date/time, whereas Date.now() creates/returns the time stamp from unix epoch(jan 1 1970).

future.setFullYear(2034); // we can even set year, month, etc and the original date changes.
console.log(future);

// (v.v.v.imp.) NOTE-: it's very important to refactor your code(using different modules and removing unnecessary code) so that we can introduce new features in our code in future.

// operations on Dates-:
// console.log(future - 654678); // once we perform functions on Dates they get converted to timestamps(which are in milliseconds in JS)

// const day1 = calcDaysPassed(new Date(2020, 3, 22), new Date(2020, 3, 25));
// console.log(`Days Passed: ${day1}`);

// (v.v.v.imp.) NOTE-: For more detailed date formats and for better display of dates we can use moment.js(library).

// Internationalizing Numbers-:

const option = {
  // style: 'unit',
  // unit: 'mile-per-hour',
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

// NOTE-: currency in "option object" is not determined by the locale passed in NumberFormat() ('locale' string is the 1st parameter) method cause a single country can have diff. currencies, actually what changes is the way of representing the currency..
const number = 646548.87;
console.log('US: ', Intl.NumberFormat('en-US', option).format(number));
console.log('Germany: ', Intl.NumberFormat('de-DE', option).format(number));
console.log('Syria: ', Intl.NumberFormat('ar-SY', option).format(number));
console.log(
  navigator.language,
  Intl.NumberFormat(navigator.language, option).format(number)
);

// setTimeOut function-:
const ingredients = ['Olives', 'Spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕🍕`),
  2500,
  ...ingredients
);
console.log('....Waiting');

if (ingredients.includes('Spinach')) clearTimeout(pizzaTimer); // to clear the Timer.

// since, we have set a time or delay to call the setTimeOut() function in the meanWhile "parser" will keep parsing the code after setTimeOut() to the JS engine and it will that code. ex-: "...Waiting" will be logged to the console before pizzaTimer, this is called asynchronus programming we will learn about it later in the course.

/* (v.v.imp.) NOTE-: in setTimeOut() Timer 1st argument-: callback function.
                                           2nd-: delay(time) after which the setTimeOut() will be called.
                                           3rd-: arguments of callback function-: we have to define the argument of the callback function, cause it is not like callback functions that were used in data transformation memthods (as they were called on arrays, those callback functions can access those arguments from the array), but here it is not possible to access the arguments, since steTimeOut() is not called on any variable or an array.     */

// NOTE-: To make a clock-: https://www.geeksforgeeks.org/how-to-design-digital-clock-using-javascript/
