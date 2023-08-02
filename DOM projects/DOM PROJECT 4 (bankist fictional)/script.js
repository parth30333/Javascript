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
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-30T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2021-06-02T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Functions-:

// Format movements date-:
const formatMovementsDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed > 1 && daysPassed <= 7) return `${daysPassed} days ago`;

  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// format currency-:
const formattedCurrency = function (value, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// display movements-:
const displayMovements = function (acc, sort = false) {
  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // we have used movements.slice().sort() because we want to unsort movements array back to the original when sorted button is clicked again, that's why we have sorted the copy of movements array not the original array.

  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displaydate = formatMovementsDate(date, acc.locale);

    const formattedMov = formattedCurrency(mov, acc.currency, acc.locale);

    const html = `<div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displaydate}</div>
     <div class="movements__value">${formattedMov}</div>
   </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// create UserName-:
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};
createUsernames(accounts);

// display balance-:
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formattedCurrency(
    acc.balance,
    acc.currency,
    acc.locale
  );
};

// display summary-:
const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formattedCurrency(
    deposits,
    acc.currency,
    acc.locale
  ); // for euro sign alt+fn+0128 release fn and alt.

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formattedCurrency(
    Math.abs(out),
    acc.currency,
    acc.locale
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formattedCurrency(
    interest,
    acc.currency,
    acc.locale
  );
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
let currentUser, timer; // we have declared timer in global space cause, if it would have been declared in event listener, than as a user logs in to the account the timer woudn't be accessible to check wether it exist or not for other user log in.

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(Math.floor(time % 60)).padStart(2, 0);

    // print time in each call
    labelTimer.textContent = `${min}:${sec}`;

    // when time === 0  stop the timer and logout the user
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';

      inputLoginUsername.focus(); // to move the cursor back to the login input field.
    }

    // decrease timer by 1 sec
    time--;
  };
  // set timer to 2min.
  let time = 120;

  tick(); // we have created a callback for setInterval() function seperately because timer was starting a little late so, we have called the timer immediately before passing it into setnterval().
  // call the timer evert second
  timer = setInterval(tick, 1000);
  return timer;
};

// // fake UI Update-:
// currentUser = account1;
// updateUI(currentUser);
// containerApp.style.opacity = 100;

// Event Listeners-:

btnLogin.addEventListener('click', function (e) {
  // to stop form from submitting(after submitting it reloads the page)
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;

    // create new date-:
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const hours = `${date.getHours()}`.padStart(2, 0);
    // const min = `${date.getMinutes()}`.padStart(2, 0);

    const now = new Date();
    const options = {
      hour: 'numeric', // '2-digit'
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      week: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale);
    const date = new Intl.DateTimeFormat(currentUser.locale, options).format(
      now
    );

    labelDate.textContent = date;

    // start the logout timer-:
    if (timer) clearInterval(timer);
    startLogoutTimer();

    // update UI
    updateUI(currentUser);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = (+inputTransferAmount.value).toFixed(2);
  if (
    amount >= 0 &&
    receiverAcc &&
    currentUser.balance >= amount &&
    currentUser?.username !== receiverAcc.username
  ) {
    // Doing the transfer-:
    receiverAcc.movements.push(+amount);
    currentUser.movements.push(-+amount); // "+" is to change the string and "-" is for transferred money.

    // add transfer date-:
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // update UI-:
    updateUI(currentUser);

    // reset timer-:
    clearInterval(timer);
    timer = startLogoutTimer(); // reset the timer for every action done in the account, till now we have only 2 actions to be done ,i.e transfer and loan.

    // clear input fields
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(movs => movs > amount * 0.1)) {
    currentUser.movements.push(amount);

    // add loan Date-:
    currentUser.movementsDates.push(new Date().toISOString());

    // reset timer-:
    clearInterval(timer);
    timer = startLogoutTimer();

    // update UI
    updateUI(currentUser);

    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    +inputClosePin.value === currentUser.pin
  ) {
    const closeAccindex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    ); // or we can do accounts.findIndex(acc => currentUser.username)

    // delete accounts-:
    accounts.splice(closeAccindex, 1);

    // hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';

    inputLoginUsername.focus(); // to move the cursor back to the login input field.
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  // e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
