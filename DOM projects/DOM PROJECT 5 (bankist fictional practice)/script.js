'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2022-12-21T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-30T14:11:59.604Z',
    '2022-12-25T17:01:17.194Z',
    '2021-06-02T23:36:17.929Z',
    '2022-12-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-06-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  pin: 2222,
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

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

// FUNCTIONS

const formatDate = function (date, locale) {
  const calcDaysPassed = (date2, date1) =>
    Math.trunc(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth()}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date); // we have not passed options object because we didn't wanted the time in movements
};

const formatCurrency = function (locale, value, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const movType = mov < 0 ? 'withdrawal' : 'deposit';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${movType}">
                    ${i + 1} ${movType}
                    </div>
                    <div class="movements__date">${displayDate}</div>
                    <div class="movements__value">
                    ${formatCurrency(acc.locale, mov, acc.currency)}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
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

createUserName(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.locale,
    acc.balance,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);

  labelSumIn.textContent = formatCurrency(acc.locale, income, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);

  labelSumOut.textContent = formatCurrency(acc.locale, out, acc.currency);

  const depositInterest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    acc.locale,
    depositInterest,
    acc.currency
  );
};

const updateUI = function (acc) {
  // update movements
  displayMovements(acc);

  // update balance
  calcDisplayBalance(acc);

  // update Summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  // set the time
  let time = 100;

  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${minutes}:${seconds}`;

    // when 0 seconds, stop timer log out the user
    if (time === 0) {
      containerApp.style.opacity = 0;
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
    }

    // decrease 1s
    time--;
  };
  tick(); // we have stored the callback for setInterval and calling it here before setInterval because when we define the callback function inside setInterval it was getting called after 1 second but we want it to start immediately as the user logs in

  // call the timer every second
  const timer = setInterval(tick, 1000);

  return timer; // to check if timer is still running
};

let currentAccount, timerCheck; // we have defined timerCheck here (not in the btnLogin event Listener) to check if the timer is still running if another user is logged in after clicking the login button

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // login check

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create Date

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const loacale = navigator.language;

    const date = new Intl.DateTimeFormat(currentAccount.locale, options).format(
      now
    );
    labelDate.textContent = date;

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hours = `${date.getHours()}`.padStart(2, 0);
    // const minutes = `${date.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;

    // update UI
    updateUI(currentAccount);

    // start the timer
    if (timerCheck) clearInterval(timerCheck);
    timerCheck = startLogoutTimer();

    // clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur(); // to  remove the cursor
  }

  labelWelcome.textContent = 'Incorrect! Please try again!';
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  if (
    transferAccount &&
    transferAccount?.userName !== currentAccount.userName &&
    amount > 0 &&
    currentAccount.balance > amount
  ) {
    // Transfer amounts
    transferAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    // add transfer date
    transferAccount.movementsDates.push(new Date(Date.now()).toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    // clear input field
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    // reset the timer
    clearInterval(timerCheck);
    timerCheck = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;
  console.log(amount);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add movement
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // reset the timer
      clearInterval(timerCheck);
      timerCheck = startLogoutTimer();
    }, 2500);
  }
  // clear input field
  inputLoanAmount.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // delete user
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false; // we need a state variable to keep switching the sorted state of movements and we have to declare it outside event listener because inside event listener it will always be initialised with false

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted; // to switch the sorted state for the next time.

  // reset the timer
  clearInterval(timerCheck);
  timerCheck = startLogoutTimer();
});

////////////////////////////////
// LECTURES
//////////////////////////////

const arr = [1, 3, 5, 6, 7, 8, 9];
const deleted = arr.splice(2);
console.log(deleted);

const set = new Set([1, 2, 5, 7, 5]);
console.log(typeof set);

const movements = [324, -878, 767, 123, 653];
const euroToUSD = 1.1;

const movementsUSD = movements.map(mov => mov * euroToUSD);
console.log(movementsUSD);

const max = account1.movements.reduce(
  (acc, mov) => Math.max(acc, mov),
  movements[0]
);
console.log(max);

const arr2 = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr2.flat(2));

const arrDeep = [[1, [2, 3]], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

/*  Sorting

for sorting numbers-: return < 0, (A, B)
                      return > 0, (B,A)
*/

const movements2 = [-650, 65, 912, -291, -137, 1300, 534, 1300];
movements.sort((a, b) => {
  if (a > b)
    return 1; // in this case if we want ascending order then b should comes first (B,A)
  else if (a < b) return -1; // in this case we want (A,B) for ascending order.
});

/*we can also write 
if(a>b) return 1;
else if(a<b) return -1;   = {a-b} for ascending order and 

for descending order = {b-a}
*/

console.log(movements2.sort((a, b) => b - a));

// Create and fill an Array
const x = new Array(7);
console.log(x.fill(1, 3, 6)); // doesn't include the last parameter
console.log(x);

const newArr = Array.from({ length: 8 }, (_, i) => i + 1);
console.log(newArr);

console.log(
  document.querySelector('.movements__value').textContent.replace('€', '')
);

const max2 = account1.movements.reduce(
  (max, curr, _, arr) => Math.max(max, curr),
  arr[0]
);
console.log(max2, account1.movements);

// Convert iterable objects & array like objects into array
labelBalance.addEventListener('click', function () {
  const movementsUI2 = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +el.textContent.replace('€', '')
  );
  console.log(movementsUI2);
});

// using .reduce() to return a object-:
const { deposits, withdrawals } = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce(
    (sums, curr) => {
      //   curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);

      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    {
      deposits: 0,
      withdrawals: 0,
    }
  );

console.log(deposits, withdrawals);

// this is a nice title => This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'am', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a long title but not too long'));
console.log(convertTitleCase('and here is another title with an example'));

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
TEST DATA:
GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2
const food = function () {
  dogs
    .filter(dog => dog.owners.includes('Sarah'))
    .forEach(curr => {
      let str = '';
      const condition =
        curr.curFood > curr.recFood * 0.9 && curr.curFood < curr.recFood * 1.1;
      if (condition) str = 'normal';
      str = curr.curFood > curr.recFood * 1.1 ? 'too much' : 'too little';

      console.log(`Dog's eating ${str}`);
    });
};
food();

// 3
const eatToomuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(cur => cur.owners);
const eatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(cur => cur.owners);
console.log(eatTooLittle, eatToomuch);

// 4
dogs
  .filter(dog => dog.curFood < dog.recFood)
  .forEach(dog => {
    const str =
      dog.owners.length > 1
        ? `${dog.owners.join(' and ')}'s dogs eats too little!`
        : `${dog.owners.join('')}'s dog eats too little!`;
    console.log(str);
  });

eatToomuch
  .filter(dog => dog.curFood > dog.recFood)
  .forEach(dog => {
    const str =
      dog.owners.length > 1
        ? `${dog.owners.join(' and ')}'s dogs eats too much!`
        : `${dog.owners.join('')}'s dog eats too much!`;

    console.log(str);
  });

// 5
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6
const eatingOkay = curr =>
  curr.curFood > curr.recFood * 0.9 && curr.curFood < curr.recFood * 1.1;
console.log(dogs.some(eatingOkay));

// 7
console.log(dogs.filter(eatingOkay));

// 8
const sortedPortion = dogs
  .slice()
  .map(dog => dog.recFood)
  .sort((a, b) => a - b);
console.log(sortedPortion);

// since JS store all the variables as double floating point number we can avoid problems like 0.1+0.3 by using Number(0.1+0.3) or add +(0.1+0.3) we can also use it with strings +'23' because "+" does type coercion
// Conversion
console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10)); // 10 => decimal base
// The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).
console.log(Number.parseInt('e23')); // in this it won't work because the string has to start with a number
console.log(Number.parseFloat('   2.5rem'));

// check for NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN(+'20px'));
console.log(Number.isNaN('24 / 0')); // infinity

// check for finite numbers
console.log(Number.isFinite('23'));
console.log(Number.isFinite(+'23px'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(20));
console.log(Number.isInteger(20 / 0));
console.log(Number.isInteger('2'));

// Math and rounding
console.log(Math.sqrt(25));

console.log(Math.max([2, 786, '31', 76])); // max and min. does type coercion
// Math.trunc()=> remove decimal part
// floor => round down
// .ceil() => round up
// .round() => round to closest

// they all does type coercion

console.log(Math.floor('-29'));

// NOTE=> Math.floor() is the best out of all because it works the best with -ve numbers

// NOTE=> Type conversion is similar to type coercion because they both convert values from one data type to another with one key difference — type coercion is implicit whereas type conversion can be either implicit or explicit.
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0....1 => 0.....(max-min) => add min => min.....(max-min)+min => min......max

// Rounding Numbers
console.log((2.7).toFixed(0)); // it returns a string
console.log(typeof (2.7).toFixed(3)); // this also does boxing, means behind the scenes it converts the primitive to a reference type and then we can use method on it.
console.log(typeof +(2.765642).toFixed(2)); // this also rounds the the number to the closest value

// operations on date
// const caclDaysPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

// digital clock using setInterval
// const tick = () => {
//   const current = new Date();

//   let ss = current.getSeconds();
//   let mm = current.getMinutes();
//   let hh = current.getHours();
//   let meridiem = 'AM';
//   let currentDay = current.getDay();

//   //Converting the 24 hours formate into 12 hour formate
//   if (hh === 00) {
//     hh = 12;
//     meridiem = 'AM';
//   } else if (hh === 12) {
//     meridiem = 'PM';
//   } else if (hh > 12) {
//     hh = hh - 12;
//     meridiem = 'PM';
//   }

//   hours.textContent = `${hh < 10 ? `0${hh}` : hh}`;
//   minutes.textContent = `${mm < 10 ? `0${mm}` : mm}`;
//   seconds.textContent = `${ss < 10 ? `0${ss}` : ss}`;
//   checkMeridiem.textContent = meridiem;
//   date.textContent = current.toLocaleDateString();
//   day.textContent = getDayName(currentDay);
// };

// setInterval(tick, 1000);
