'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  //  it is always better to pass argument  intsead of declaring movements in the global scope and than use it in the function.\

  containerMovements.innerHTML = ''; // to remove all the default or hardcoded data or to empty the container.
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // movements.slice()-:  to create a shallow copy, cause we don't wanted to mutate the original array(movements).

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__date">3 days ago</div>
                    <div class="movements__value">${mov}€</div>
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
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0); // created balance property to use it later for transferring and requesting for money.
  labelBalance.textContent = `${account.balance} €`;
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income} €`;

  const expense = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(expense)} €`; // Math.abs() to remove the -ve sign.

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1; // to remove the interest amounts which are less than 1.
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} €`;
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
  displayMovements(acc.movements);

  // Display Summary
  calcDisplaySummary(acc);

  // Display Balance
  calcDisplayBalance(acc);
};

// Event Listeners-:

/* (v.v.imp.) NOTE-:  To prevent submitting the form or to stop reloading the page on pressing submit button, there are two ways-:
                       1-: use button tag instead of input tag and in button tag use type = "button" 
                       2-: or we can use the event object which is the argument of callback function of eventListener which has all the details of the event-: event.preventDefault() */

/* (v.v.imp.) NOTE-: There is a good thing about submit button "inside a form" is-: pressing enter key will trigger click event on submit button.   */

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  ); // currentAccount holds the object with a userName entered in the username input field

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // instead of using another condition to check wether username === currentAccount.userName we have simply checked wether the object(object = currentAccount, which has the userName) exist or not using optional chaining.
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Display the UI after login-:
    containerApp.style.opacity = 100;

    // clear input fields-:
    inputLoginUsername.value = inputLoginPin.value = ''; // we can do this beacuse associativity of "=  operator" is from right to left.
    inputLoginPin.blur(); // to remove the focus

    // update UI-:
    updateUIfunctions(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
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

    // update UI-:
    updateUIfunctions(currentAccount);

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
    Number(inputClosePin.value) === currentAccount.pin
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

    labelWelcome.textContent = 'Log in to get started';

    inputLoginUsername.focus(); // to move the cursor back to the login input field.
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);
  // mov >= amount * 0.1 means Loan(amount > 0) is atleast 10% of any deposit in account.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // update UI-:
    updateUIfunctions(currentAccount);
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// SLICE-:
console.log(`------------------SLICE-------------------`);
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2)); // it is same as .slice() for strings.
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));

// .slice() is used to create a shallow copy like ...spread operator. we can use any of the method to create a shallow copy of a array.
console.log(arr.slice());
console.log([...arr]);

// SPLICE-: the only diff. B/W .slice() and .splice() is-:  .splice() changes the original array(or it mutates the array) and 2nd parameter
//           in splice is the number of elements to be sliced from the starting index(which is the 1st parameter).
console.log('---------------------SPLICE----------------------');
console.log(arr.splice(-2)); // it returns the sliced array like .slice() method for string.
console.log(arr); // but original array is also changed.
console.log(arr.splice(1, 2));
console.log(arr);

// NOTE-:  SPLICE is generally used to remove an element from an array(as SPLICE also mutates or updates the original array)

// REVERSE-:
console.log('--------------------REVERSE------------');

arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2); //   returns the reversed array and mutates the original array.

// CONCAT-:
console.log('-----------------CONCAT---------');
const letters = arr.concat(arr2);
console.log(letters); // doesn't mutate the original array's.
console.log([...arr, ...arr2]); // alternative to .concat()

// JOIN-:
console.log('----------------JOIN------------------');
console.log(letters.join('-'));

// forEach-:
console.log('------------------- forEach------------------');
// arrays-:

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`you deposited ${i + 1}: ${mov} amount`);
  } else {
    console.log(`you withdrew ${i + 1}: ${mov} amount`);
  }
}

console.log('---- forEach -----------');
// forEach's first argument is the callback function and 2nd argument is the "this keyword" and this keyword points to the callback function and we can change "this keyword"(it is optional to use the 2nd argument), further the callback function has 3 arguments which are 1-: item of the array 2-: index of the item 3-: the array itself and the order of the arguments needs to be maintained.

// NOTE-: work of a callback function is to describe other higher order function what to do.

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`you deposited ${i + 1}: ${mov} amount`);
  } else {
    console.log(`you withdrew ${i + 1}: ${Math.abs(mov)} amount`); // Math.abs() is used to get the absolute value.
  }
});

// (v.v.imp.) NOTE-:  the only diff. B/W for of and forEach loop is that "we cannot use break statement" in forEach loop.

// Maps-:

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  // similar arguments to forEach using array
  console.log(`${key}: ${value}`);
});

// Sets-:
const uniqueCurr = new Set(['USD', 'GBP', 'USD', 'GBP', 'EUR', 'USD']);
console.log(uniqueCurr);

uniqueCurr.forEach(function (value, _, set) {
  // the arguments for forEach for set is same as for maps, but the only thing is "set don't have keys". so, in arguments key and value are same thing when using forEach on sets.
  console.log(`${value}: ${value}`);
});

// "_" is used in the 2nd argument to denote a "throwaway variable"(a variable which is not of any use).

///////////////////////////////////////
console.log('---------------coding challenges-------------');
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog so about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets
HINT: Use tools from all lectures in this section so far 😉
TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
console.log('------------ coding challenge #1 ------------------');
const checkDogs = function (dogsJulia, dogsKate) {
  const copyDogsJulia = [...dogsJulia]; // we can also use .slice() method to create a copy
  copyDogsJulia.splice(0, 1);
  copyDogsJulia.splice(-2);
  const totalData = copyDogsJulia.concat(dogsKate);

  totalData.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old.`);
    } else {
      console.log(`Dog number ${i + 1} is still a Puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// Coding challenge #2
/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
console.log(
  '--------------------------- coding challenge #1 ---------------------------'
);

const calcAverageHumanAge = function (ages) {
  const averageAdultHumanAge = ages
    .map((dogAge, i) => (dogAge > 2 ? 16 + dogAge * 4 : dogAge * 2))
    .filter((humanAge, i) => humanAge > 18)
    .reduce((acc, adultAge, i, arr) => acc + adultAge / arr.length, 0);

  return averageAdultHumanAge; // "arr argument of .reduce()" is generally used when we chain methods like we did in averageAdultHumanAge because there was no other way to find the length of the array returned by .filter() method .
  // we have directly divided adultAge by arr.length rather than dividing the sum(acc + adultAge) by arr.length cause, average = (2+3)/2 = 2.5 = (2/2 + 3/2) = 1+1.5 = 2.5
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
// Map, Filter, Reduce and find -: Data transformation methods, all these methods loop over the array.

// Map-: map returns a "new array" conatining the results of applying an  operation on all original array elements.
console.log('---------------MAP------------------');
const euroToUsd = 1.1;
// const movementsUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// since map method returns a new array it won't affect the original array(movements) and we can store it as well.
const movementsUsd = movements.map(mov => mov * euroToUsd);
console.log(movements);
console.log(movementsUsd);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescription);

/* NOTE-: The biggest diff. B/W these data transformation array methods and forEach is-: forEach iterates over each array item and than perform the function on each item and log it to the console(in an array) this process happens in all iterations. Instead .map() iterates over each array item and than perform function on that item and store it into the new array and after loop completes all the iterations than logs the new array to the console.  */

// filter-: filter returns a "new array" containing array elments that passed a specified test condition.
console.log('-------------------FILTER----------------------');

const deposits = movements.filter(function (mov) {
  return mov > 0; // it will return all the items of the array movements who satisfy this condition.
});

console.log(movements);
console.log(deposits);

const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov); // forOf loop is used to show the diff. B/W the data transformation methods and normal forOf loop
console.log(depositFor);

const withdrew = movements.filter(mov => mov < 0);
console.log(withdrew);

/* (imp.) NOTE-: Other big reason to use these data transformation methods and forEach method over forOf loop is that, we can chain these methods as we have chained these methods in createUserName function, there we have used these methods with string methods but we can also use methods alone for chaining.  */

// Reduce-: reduce boils("reduces") all array elements down to one single value.(ex-: adding all elements together)
console.log('----------------REDUCE-----------------');

// const balance = movements.reduce((acc, curr, i, arr) => {
//   console.log(`Iteration ${i}: Accumulator ${acc}`);
//   return acc + curr;
// }, 0);

/*  In Reduce the only diff. is the arguments-: "1st argument in callback(reducer) function" is the accumulator, accumulator's value is remembered across each iteration throught the array, and ultimately becomes the returned value of reducer(callback) function
            and "2nd argument for reduce() method" is the initial value of accumulator(= 0 in the above code). */

const balance = movements.reduce((acc, curr, i, arr) => acc + curr, 0); // "0 is the 2nd argument for reduce method."
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov; // Reducing using forOf loop.
console.log(balance2);

// To calculate the max.
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]); // it is similar to insertion sort, where we compare two consecutive number and accumulator is assigned to the greater number(after comparison) and comparison starts by assigning the accumulator to first number in that data structure.
console.log(max);

// Chaining data transformation methods or pipeline
const depoitToUsd = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr); //  it is hard to find any error while chaining methods. so it is better to log the array argument in these data transformation methods to the console to see if there is any mistake .
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(depoitToUsd);

// find-:  loops over array and has same arguments as other data trabsformation methods.
console.log('------------- find method --------------------- ');
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

// The fundamental diff. B/W filter() and find() is-:  1-: find returns the first element of the array that satisfies the condition 2-: find() is used to retrieve a element, whereas filter() returns a new array.

// use case- : one of the best use case is when we want to find a specific object on the basis of a property in a array filled with more than one object, .filter() can also find a object in the array, but it will return that object in an array.
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

console.log('-----------------SOME and EVERY methods ----------------------');
// Some method-: .some() method is similar to .includes(), reurns a boolean but in .some() we can pass a condition to check wether a element exist in a array.
console.log(movements.includes(-130));

const anydeposits = movements.some(mov => mov > 0);
console.log(anydeposits);

// Every method-: same as .some() it just returns true only if all the elements of the array staisfies the condition.

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// seperate callback-:  we can use seperate callbacks in these data transformation methods to follow "DRY principle"
const deposit = mov => mov > 0;
console.log(movements.every(deposit));
console.log(movements.some(deposit));
console.log(movements.filter(deposit));

//  Flat method-:
console.log('--------------FLAT and FLATmap Methods--------------');

const arR = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arR.flat());
console.log(arR); // it does not mutates the original array.

const arRdeep = [[1, [2, 3]], [[4, 5], 6], 7, 8];
console.log(arRdeep.flat(2)); // whenever the level of nesting is more than 1 than we have to  specify the level of nesting in .flat() method.

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// FlatMap-: it is the combination of map and flat method, first after applying a condition a new array is created using .map() functionality than that nested array is converted into a simple array using .flat() method functionality.
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

// (v.v.imp.) NOTE-: .flatMap() method doesn't work for array that have level nesting more than 1.

// Sorting in javascript-:
console.log('------------------SORTING----------------');
const owners = ['parth', 'julia', 'mark', 'john', 'bruce'];
console.log(owners.sort());
console.log(owners); // it actually mutates the original array.

console.log(`Not Sorted ${movements.sort()}`); // To know why it is not working and everything about sort-:https://medium.com/madhash/demystifying-the-mysteries-of-sort-in-javascript-515ea5b48c7d#:~:text=This%20is%20our%20callback%20function,%3E%20a%20and%20b%20%3C%20a%20.

// Ascending order-:

// const sortedMovements = movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(sortedMovements);

const sortedMovements = movements.sort((a, b) => a - b);
console.log(sortedMovements);

// Descending order-:

// const sortedMovements2 = movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(sortedMovements);

const sortedMovements2 = movements.sort((a, b) => b - a);
console.log(sortedMovements2);

// .sort() when used with arguments actually swap the two consecutive numbers when condition becomes true.

// Fill method-:
console.log('------------- FILL and FROM Methods -----------------------');
const aRR = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty Array + fill method-:
const x = new Array(7); // actually new Array() is used to create a new array and first argument is the length of the array.
console.log(x);

x.fill(1); // .fill() method has 3 arguments-: 1st-: value to be filled in the array, 2nd-: starting index, 3rd-: ending index.
console.log(x);

x.fill(2, 3, 5);
console.log(x);
console.log(aRR.fill(23, 2, 6)); // .fill() doesn't include the ending index.

// Array.from method-: to create and fill the array at the same time.
const y = Array.from({ length: 7 }, () => 1); //  it takes 1st argument as an object and  2nd argument as a callback function(same as it was used to be in .map() and it loop over the array as well).
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // "_" because we don't want the first argument(current element).
console.log(z);

//  FIrst Array.from() was actually used to convert the array like objects into arrays so that we can use array methods. ex-: querySelectorAll() returns a nodeList we can convert it into a array and use a map method on it at same time.

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
// we can do this way also
const movementsUI = [...document.querySelectorAll('.movements__value')]; // after that we can use .map() method on it.

// NOTE-: .fill() is used on an array , whereas .from() is used on array constructor {Array()} and we specify length in an object when using .from() only when we are creating an array using .from(), we pass the 1st argument in .from() the object that we want to convert into an array.

// (v.v.v.imp.) NOTE-: we have studied 23 array methods till now, to know which method to use when and why-: check photo in mobile or lecture 162.

///////////////////////////////////////
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
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
GOOD LUCK 😀
*/

console.log(
  '------------------ coding challenge #4 --------------------------'
);

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(item => {
  item.recFood = Number((item.weight ** 0.75 * 28).toFixed(3)); // toFixed()-: to fix the decimal place to 3.
});
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah')); // as the condititon becomes true .find() will return the req. object.
// console.log(dogSarah);
dogSarah.curFood > dogSarah.recFood
  ? console.log("Sarah's dog is eating too much")
  : console.log("Sarah's dog is eating to little.");

// 3.
const ownersEatTooMuch = dogs
  .filter(mov => mov.curFood > mov.recFood)
  .map(mov => mov.owners)
  .flat();

const ownersEatTooLittle = dogs
  .filter(mov => mov.curFood < mov.recFood)
  .map(mov => mov.owners)
  .flat();
console.log(ownersEatTooLittle, ownersEatTooMuch);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little.`);

//5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
console.log(
  dogs.some(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
);

// 7.
const okayAmount = dogs
  .filter(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
  .map(dog => `${dog.owners}'s dog.`);
console.log(okayAmount);

// 8.
const dogsShallowCopy = dogs.slice().map(dog => dog.recFood); // we could have done this without using map but in that case the objects inside the array would get arranged in the asscending order.
// console.log(dogsShallowCopy);
dogsShallowCopy.sort((a, b) => a - b);
console.log(dogsShallowCopy);
///////////////////////////
