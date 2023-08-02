'use strict';

const weekDay = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const openingHours = {
  [weekDay[3]]: {
    // New ES6 object literal feature. that we can know compute(calculate) properties name instead of writing the exact property name.
    open: 12,
    close: 22,
  },
  fri: {
    open: 11,
    close: 23,
  },
  sat: {
    open: 0, // open 24 houurs
    close: 24,
  },
};

const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  // openingHours: openingHours, before ES6 we have to use this syntax to use object from outside(in global scope).
  // ES6 New feature for object literal
  openingHours,

  order(starterIndex, mainIndex) {
    // it is also the new ES6 object literal feature that we can remove "function keyword" and ":"
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery: function ({
    // instead of passing the whole object here we are using object destructuring and we have defined the property that are req. in this function in parameters(destructured object) and other properties of the object passed in as an argument(while calling the method) will not be used.
    starterIndex = 1,
    mainIndex = 1,
    address,
    time = '22:00',
  }) {
    console.log(
      `order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]}, will be delivered to ${address}, at ${time} ` //statement req. instead of "${categories[mainIndex]}" to use categories property of object passed-: ${this.categories[mainIndex]}  because "categories" is not defined in destructured object and so the array variable of categories property is not created.
    );
    // console.log(address); it is the property of the object passed as an argument and in parameters we are using object destructuring of that argument object and in that destructuring we have defined "address", which will create a variable "address" that's why we were able to use console.log(address) {not console.log(this.address)}
  },
  orderPasta: function (ing1, ing2, ing3) {
    console.log(
      `order received for Pasta, with ingredients ${ing1}, ${ing2} and ${ing3}.`
    );
  },
  orderPizza: function ({ mainIngredient, ...otherIngredients }) {
    console.log(mainIngredient);
    console.log(otherIngredients);
  },
};

restaurant.orderDelivery({
  time: '22:30',
  address: 'via del sole, 21',
  mainIndex: 2,
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterIndex: 2,
});

restaurant.orderDelivery({
  address: 'via del sole, 21',
  starterIndex: 1,
});

// "OR oprator" can use any DATATYPE, return any DATATYPE.
// SHORT-CIRCUITING
console.log('------OR-------');
console.log(2 || 'parth');
console.log('' || 0);
console.log(undefined || 356); //    "OR operator" will select the first truthy value used in series with "OR operator and short-circuits the others values, but if all the values are falsy than it will select the last vlaue."
console.log(true || 0);
console.log(undefined || 0 || '' || 'Hello' || true || null || 246);

restaurant.numGuests = 0;
// NOTE-: only problem of using "OR operator" and ternary operator in place of if-else statement is "OR operator will neglect "0" as it is a falsy value".
const guests1 = restaurant.numGuests ? restaurant.numGuests : 10; // using ternary operator check if numGuests property exist if so than assign it to guests1 if not than set the default value "10"
console.log(guests1);

console.log('--------AND-------');
// just opposite of OR operator-: it selects the first falsy value and if all the values are truthy than it will print the last truthy value.
console.log(3 && undefined);
console.log(null && '');
console.log(54 && 'parth');

// using && instead of if statement
if (restaurant.orderPizza) {
  restaurant.orderPasta('onion', 'garlic', 'mushroom');
}

restaurant.orderPizza && restaurant.orderPasta('onion', 'garlic', 'mushroom');

// Solution for problem with OR operator-:
// Nullish Coalescing operator (??)-:  it works same as OR operator but it works on Nullish values(null and undefined) instead of truthy and falsy values, "0 and '' " are not nullish values.
restaurant.numGuests = 0;
const guests = restaurant.numGuests ?? 10; // 10 is the default value.
console.log(guests);

// Spread Operator

console.log('----------------SPREAD--------------');
// it spreads each individual character of an iterable(iterables are anything that can be looped over) inside the receiver or each individual member of iterable is plucked from it's location in the iterable and kept inside the receiver.
const arR = [7, 8, 9];
const badNewArr = [1, 2, arR[0], arR[1], arR[2]];
console.log(badNewArr);

const newArr = [1, 2, ...arR];
console.log(newArr);

console.log(...newArr); // output = 1 2 7 8 9 here the receiver is a function. so individual items becomes function arguments.
/* NOTE-: Difference B/W destructuring and spread operator is-: spread operator takes all the elements from the array individually(one by one) and doesn't store them
          into variables. And spread operator can be used when we want to pass multiple elements into a function or when we want elements ", seperatly" */

const newMenu = [...restaurant.mainMenu, 'Gnocci'];
console.log(newMenu);

// copy array
const mainMenuCopy = [...restaurant.mainMenu];
console.log(mainMenuCopy);
// join 2 Arrays
const totalMenu = [...restaurant.mainMenu, ...restaurant.starterMenu];
console.log(totalMenu);

// Iterables
const str = 'Parth';
const letters = [...str];
console.log(letters);
console.log(...str);

// Real-World Example-:
const ingredients = [
  // prompt(`Let's make Pasta!, Ingredient 1 ?`),
  // prompt(`Ingredient 2 ?`),
  // prompt(`Ingredient 3 ?`),
]; // we can use prompt() inside an array.

// restaurant.orderPasta(ingredients[0], ingredients[1], ingredients[2]); calling function without using spread operator.

restaurant.orderPasta(...ingredients);

// Spread operator for Objects(though object is not a iterable)-:
const newRestaurant = { foundedIn: 1999, ...restaurant, foundedBy: 'el chapo' };
console.log(newRestaurant);

const restaurantCopy = { ...restaurant };
restaurantCopy.name = 'bon appetit';
console.log(restaurant.name); // output = Classico Italiano
console.log(restaurantCopy.name); // output = bon appetit  {in a shallow copy, normal properties are being copied in to destination object, in case of complex properties(nested object) the reference of those complex properties are being copied into the destination object.}

// (v.imp.) NOTE-: Diff. B/W shallow copy and deep copy-: https://medium.com/technofunnel/deep-and-shallow-copy-in-javascript-110f395330c5#:~:text=Understanding%20Deep%20and%20Shallow%20Copy&text=As%20the%20image%20above%20shows,not%20have%20any%20data%20shared.

/*  (v.v.imp) NOTE-: pitfall of using spread operator to copy nested objects is that, the reference of nested object gets copied into the destination object, since it creates a shallow copy. 
                     ex-: let xyz = [1,2,[3,[4,5]]];
                     let dy = [...xyz];
                     console.log(xyz, dy);
                      dy[2][1] = 8;
                      console.log(xyz, dy); at index [2][1] value changes to 8 in both. */

// use cases of "Spread opertor"-:  1-: to build a new array(copy)   2-: to pass multiple arguments to a function.

// REST Pattern and parameters
// 1-) Destructuring using REST
console.log('--------------REST---------------');

// SPREAD, beacuse "..." on right side of "="
const aRR = [1, 2, ...[4, 5, 6, 7, 6]];

// REST, beacuse "..." on left side of "="   -:  unlike SPREAD(unpacks elements as a individual into arrays and as function arguments) REST packs all the remaining elements into a new array or object(depends, where we are using rest) and since "REST" packs all the "remaining elements" into an array it must be used in the last,  otherwise JS wouldn't know how many elements are remainig and for the same reason there can only be one ...REST operator used wherever.
const [m, n, ...others] = [1, 3, 4, 57, 74, 5]; // it involves a little bit of destructuring also.
console.log(m, n, others);

const [pizza, , Risotto, ...otherFood] = [
  // , , is given after pizza since risotto is the 3rd element in the array made using spread operator.
  ...restaurant.mainMenu,
  ...restaurant.starterMenu,
];
console.log(pizza, Risotto, otherFood);

// REST for objects
const { sat: saturday, ...weekDays } = restaurant.openingHours; // here Rest is creating objects.
console.log(saturday, weekDays);

// 2-) Functions parameters using REST

const add = function (...numbers) {
  // here ...numbers is called REST parameters
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) sum += numbers[i];
  console.log(sum, numbers);
};

add(1, 3, 78, 3, 2);
add(7, 61, 26);

const s = [3, 47, 27, 7];
add(...s); // using here SPREAD to call add function.

// Edge case(some cases other than main use cases {which were REST parameters and Destructuring}) for REST-:
restaurant.orderPizza({
  mainIngredient: 'paneer 6 pieces',
  onion: 'onion 7 pieces',
  mushroom: 'mushroom 4 pieces',
  olives: 'olives 9 pieces',
}); // using Destructuring of objects as well as "REST" to collect remaining properties of passed objects and pack those properties into a new object.

/*  NOTE-: 1-: spread operator can only be used on receivers-: function arguments and arrays
           2-: multiple vlaues seperated by commas are only accepted in function arguments and arrys, that's why "spread operator only works for arrays and function arguments". /*
           

//NOTE-: "REST" is used to write variables seperated by comma.
          "SPREAD" is used to write values(of a variable) by comma, that's why spread is used to pass multiple arguments into a function.


           
/* NOTE-: Destructuring of objects -: starts with {} and to grab a property of an object, the name of the variable has to be the same as of the property in Destructing object, 
          like in destructuring arrays we don't have to maintain the order here(as objects are unordered)*/
console.log('------------Destructuring objects------------------');
const { name, categories } = restaurant;
console.log(name, categories); //  variables created-: name and categories. remember these are objects but we store them into variables.

/* NOTE-: we know that to access the property of a object using name of the variable on left side of destructuring has to be the same as name of property in object, but 
          if we want to change the name of the variable or we can say that we are assigning the value of the property to a variable(hours, tags, restaurantName) 
          and we can do this like that */
const {
  name: restaurantName,
  openingHours: hours,
  categories: tags,
} = restaurant; //  here the variables restarantName, hours, tags are variables that holds the the values of their respective properties in the restaurant object.
console.log(restaurantName, hours, tags, restaurant); // same as console.log(name, openingHours, categories)

/* (v.imp.) NOTE-: computing porperty name, instead of writing exactly same name of the property as it was in the original object we can compute property name ,(v.imp) but make sure while using computed property 
                   name "define the value of the property using ":" after computed property name". */

const obj2 = { name: 'parth', age: 20 };
const key = Object.keys(obj2)[0]; // this is same as const key = 'name';
const { [key]: name2 } = obj2; // here we are computing property name using key variable and than assigning the property's value to variable name2.
console.log(name2, obj2);

// default values-:  useful when we are fetching or receiving some unknown data or when we don't know wether the property we are trying to access even exist or not in the object.
const { menu = [], starterMenu: starters = [] } = restaurant; // even we have intitialized starters with [] it will not be empty since, startersMenu isn't a empty array.
console.log(menu, starters); //property in restaurant object.

// switching variables.
let a = 10;
let b = 97;
const obj = { a: 6, b: 78, c: 23 };
({ a, b } = obj); // NOTE-: if we would have switch variables like {a, b } = obj; than JS would have given an error.
console.log(a, b);

// destructing nested objects.
const {
  fri: { open: o, close: c },
} = openingHours; // since, "fri is also a object", to just grab the value of "open and close" we do nested destructuring.
console.log(o, c);

// NOTE-: practical use of destructuring of objects-:   https://medium.com/better-programming/3-practical-uses-of-object-destructuring-in-javascript-a2c34ce3367b

//(v.v.imp.) NOTE-: destructuring vs no destructuring-: https://dmitripavlutin.com/javascript-object-destructuring/#1-the-need-for-object-destructuring

// (v.v.imp.) NOTE-: function parameter Destructuring is the most important part of object destructuring, if found any doubt-: https://www.youtube.com/watch?v=NIq3qLaHCIs

/*NOTE-: Destructuring of arrays-: just breaking a array(data structure) into simple elements. Application-: store those elements into different variables 
         at same time.We can do the same process without destructuring but the process would be long and unnecessary.  */

// const arr = [2, 3, 4];
// const a = arr[0];  this is the normal process for breaking and storing a array into variables as simple elements.
// const b = arr[1];
// const c = arr[2];
// console.log(a, b, c);

// Destructuring of arrays.
console.log(
  '------------------------arrays destructuring---------------------'
);

const arr = [2, 4, 5];
const [x, y, z] = arr;
console.log(x, y, z);

let [main, secondary] = restaurant.categories;
console.log(main, secondary); // Italian Pizzeria

[main, , secondary] = restaurant.categories; // to skip something in B/W an array.
console.log(main, secondary);

// switching variables normally
// const temp = main;
//  main = secondary;
//  secondary = temp;

//  switching variables using Destructuring.
[main, secondary] = [secondary, main];
console.log(main, secondary);

// Recieve 2 return values from a function in multiple variables using destructuring.
const [starter, mainCourse] = restaurant.order(1, 0);
console.log(starter, mainCourse);

// Destructuring of a nested array
const nested = [2, 5, [7, 8]];
const [i, , [j, k]] = nested;
console.log(i, j, k);

// default values
const [p = 1, q = 1, r = 1] = [8, 9];
console.log(p, q, r);
// NOTE-: setting default values while Destructuring is useful when we don't know the length of an array or when we are receiving some values from an API.

// For-of Loop
const menu2 = [...restaurant.starterMenu, ...restaurant.mainMenu];
for (const item of menu2) console.log(item); // it iterates over the menu array and each element of that array gets saved in item.

// but to get the index of the array element is a bit challanging.
// array.entries()-: it creates an array which contains the index no. of the element(element in menu2 array) at starting index,  than at next index no. it has element itself.
for (const [i, el] of menu2.entries()) {
  console.log(`${i + 1}: ${el}`);
}

// NOTE-: in case you are receiving a chunk of data and want to verify or check wether something is present or not than we can use optional chaining(.?)

// Optional chaining-:
if (restaurant.openingHours && restaurant.openingHours.mon) {
  console.log(restaurant.openingHours.mon.open); // mon and open properties doesn't exist.
}
// for better synatx
console.log(restaurant.openingHours?.mon?.open); // on the element which we have used "?." doesn't exist than instead of giving an error it will give undefinded as a result.
console.log(restaurant.openingHours.mon?.open); //  working of ".?" is similar to "??" ,i.e. it works on nullish values which means if there is a empty string or "0" than it will still give that as a result.

/* (v.v.imp.) NOTE-: we can grab property from an object using "bracket and dot" notation but in case we want to grab a property of an object by a variable name than 
                     it is necessary to use bracket notation. */

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
for (const day of days) {
  const open = restaurant.openingHours[day]?.open ?? 'closed';
  console.log(`On day ${day}, we open at ${open}`);
}

// "?." works on methods as well
console.log(restaurant.order?.(1, 2) ?? `method doesn't exist`);
console.log(restaurant.orderRisotto?.(0, 7) ?? `Method doesn't exist`);

// for arrays
const users = [
  { name: 'parth', email: 'parthchauhan3033@gmail.com', married: 'no' },
];
console.log(users[0].name ?? `user array empty`);
// otherwise-: if(users[0]?.name){
//   console.log(users[0].name);
// } else {
//   console.log(`array doesn't exist`);
// }

// NOTE-: "For-of loop" is used to loop over iterables, but it can be used to loop over object properties(keys) and values in a indirect way(will call a method that returns an array of properties and values of objects.)
// "For-of to loop over Properties."
const properties = Object.keys(openingHours);
console.log(properties); // output = [thu, fri, sat] returns an array. so, by using this method we can use for-of loop to loop over objects.

let openStr = `We are open on ${properties.length} days :`;

for (const Day of Object.keys(openingHours)) {
  openStr += ` ${Day}, `;
  console.log(openStr);
}

// Loop over object values.
const values = Object.values(openingHours);
console.log(values);

// Loop over ENTIRE Object.
const entries = Object.entries(openingHours);
console.log(entries); // object.entries() returns an array having key(property) on 0 index and value on 1 index. since, we know openingHours is a nested object. so, object.entries() will return an array containing 3 more arrays(for thu,fri,sat), which further has "key on 0 index" and "object for open & close hours on index 1"

for (const [key, { open, close }] of entries) {
  // since entries is an array,  that's why we have used destructuring using array.
  console.log(`On ${key}, We open at ${open} and close at ${close}.`);
  console.log(key, open, close);
}

console.log('----------------------Challenges-------------------------');
/* 
We're building a football betting app (soccer for my American friends 😅)!
Suppose we get data from a web service about a certain game (below). In this challenge we're gonna work with the data. So here are your tasks:
1. Create one player array for each team (variables 'players1' and 'players2')
2. The first player in any player array is the goalkeeper and the others are field players. For Bayern Munich (team 1) create one variable ('gk') with the goalkeeper's name, and one array ('fieldPlayers') with all the remaining 10 field players
3. Create an array 'allPlayers' containing all players of both teams (22 players)
4. During the game, Bayern Munich (team 1) used 3 substitute players. So create a new array ('players1Final') containing all the original team1 players plus 'Thiago', 'Coutinho' and 'Perisic'
5. Based on the game.odds object, create one variable for each odd (called 'team1', 'draw' and 'team2')
6. Write a function ('printGoals') that receives an arbitrary number of player names (NOT an array) and prints each of them to the console, along with the number of goals that were scored in total (number of player names passed in)
 7. The team with the lower odd is more likely to win. Print to the console which team is more likely to win, WITHOUT using an if/else statement or the ternary operator.
TEST DATA FOR 6: Use players 'Davies', 'Muller', 'Lewandowski' and 'Kimmich'. Then, call the function again with players from game.scored
GOOD LUCK 😀
*/

const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

// 1.
const [player1, player2] = game.players;
console.log(player1, player2);
//2.
const [gk, ...fieldPlayers] = player1;
console.log(gk, fieldPlayers);
// 3.
const allPlayers = [...player1, ...player2];
console.log(allPlayers);
// 4.
const playerFinal = [...player1, 'Thiago', 'Coutinho', 'Perisic'];
console.log(playerFinal);
// 5.
const {
  odds: { team1 = 1, x: draw = 1, team2 = 1 }, // nested object destructuring
} = game;
console.log(team1, team2, draw);
// 6.
const pirntGoals = function (...players) {
  // functin actually receives players name(...players) individually but later on convert them into an aarray
  console.log(`${players.length} goals were scored`, players);
};

pirntGoals('Davies', 'Muller', 'Lewandowski');
pirntGoals(game.scored); // we have passed game.scored array and REST parameter(...players) would pack the array into another array(called player) and than the array consisting of players would be treated as a single element of the player array and players.length will always remain '1'.
// 7.
team1 < team2 && console.log('Team 1 more likely to win');
team1 > team2 && console.log('Team 2 more likely to win');

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's continue with our football betting app!
1. Loop over the game.scored array and print each player name to the console, along with the goal number (Example: "Goal 1: Lewandowski")
2. Use a loop to calculate the average odd and log it to the console (We already studied how to calculate averages, you can go check if you don't remember)
3. Print the 3 odds to the console, but in a nice formatted way, exaclty like this:
      Odd of victory Bayern Munich: 1.33
      Odd of draw: 3.25
      Odd of victory Borrussia Dortmund: 6.5
Get the team names directly from the game object, don't hardcode them (except for "draw"). HINT: Note how the odds and the game objects have the same property names 😉
BONUS: Create an object called 'scorers' which contains the names of the players who scored as properties, and the number of goals as the value. In this game, it will look like this:
      {
        Gnarby: 1,
        Hummels: 1,
        Lewandowski: 2
      }
GOOD LUCK 😀
*/
// 1.
for (const [index, vlaue] of game.scored.entries()) {
  console.log(`Goal ${index + 1}: ${vlaue}`);
}

// 2.
let average = 0;
const odds = Object.values(game.odds);

for (const odd of odds) average += odd; // (v.v.imp.) NOTE-: since, we have not used any curly braces after for of loop, "for of loop" will consider only average += odd; as the statement to loop over.

average /= odds.length;
console.log(average);

// 3.
for (const [oddKey, oddValue] of Object.entries(game.odds)) {
  const str = oddKey === 'x' ? 'draw' : `victory for ${game[oddKey]}`;
  console.log(`odd of ${str}: ${oddValue}`);
}

// 4.
const scorers = {};
for (const player of game.scored) {
  scorers[player] ? scorers[player]++ : (scorers[player] = 1); // scorers[player] checks wether a property with name inside player variable exist or not in scorers object, if not exist than scorers[player] = 1 will create a property with player variable name and assign it to 1, if exist than scorers[player]++ will add the value of that existed property(if scorers{parth:1} existed than scorers[parth]++ will add the value of existed property which is 1+1 = 2 and result is scorers{ parth:2 })
}

///////////////////////////////////////
// Coding Challenge #3

/* 
Let's continue with our football betting app! This time, we have a map with a log of the events that happened during the game. The values are the events themselves, and the keys are the minutes in which each event happened (a football game has 90 minutes plus some extra time).
1. Create an array 'events' of the different game events that happened (no duplicates)
2. After the game has finished, is was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.
3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
      [FIRST HALF] 17: ⚽️ GOAL
GOOD LUCK 😀
*/

const gameEvents = new Map([
  [17, '⚽️ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽️ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽️ GOAL'],
  [80, '⚽️ GOAL'],
  [92, '🔶 Yellow card'],
]);

// 1.
const events = [...new Set(gameEvents.values())];
console.log(events);
// 2.
gameEvents.delete(64);
// 3.
const time2 = [...gameEvents.keys()].pop();
console.log(
  `An event happened, on average, every ${time2 / gameEvents.size} minutes`
);
// 4.
for (const [key2, value2] of gameEvents) {
  const min = key2 <= 45 ? 'FIRST' : 'SECOND';
  console.log(`[${min} HALF] ${key2}: ${value2}`);
}

// SETS-:
console.log('----------------SETS------------------');
const orderEelements = new Set([
  'pasta',
  'pizza',
  'risotto',
  'pasta',
  'pizza',
  'risotto',
  'pasta',
]);

// we can enter any iterable in new Set() like-:  array, string, etc.
console.log(orderEelements); // output = {'pasta', 'pizza', 'risotto'} -: no duplicate elements, but elements are unordered.
console.log(new Set('parth')); // output = {"p", "a", "r", "t", "h"} because set places unique elments of a item inside curly braces.
console.log(orderEelements.size);
console.log(orderEelements.has('Garlic Bread'));
orderEelements.add('Garlic Bread'); // it will add Garlic Bread only one time at last(but position doesn't matter actually, cause sets are unordered in nature.) since it doesn't has duplicate values.
console.log(orderEelements.add('Garlic Bread'));
console.log(orderEelements.delete('risotto')); // delete the element from the set and return true if element was successfully removed.
//console.log(orderEelements.clear()); // to delete all elements.
/* NOTE-: there are no indexes in "Set". so, we cannot retrieve a value from a set, it makes sense also because if something is unique and it is unordered too than
           there is no use of retrieving that value instead of that we can check wether that value exists in a "Set" or not. */

// USE CASES of Sets-:
// 1-: To remove duplicate vlaues from an array.
const staff = ['waiter', 'chef', 'waiter', 'manager', 'chef', 'waiter'];
const uniqueStaff = [...new Set(staff)]; // deleting duplicate elements and converting the Set into an array at same time using spread operator.(since, spread operator works on iterables(Set)).
console.log(uniqueStaff);
console.log(new Set('Parth Chauhan').size); // to know unique alphabets in a string.

// MAPS-:   Everything inside a Map is stored as a  Key, value pair and unlike in objects where keys are generally strings here, key can be of any datatype.
console.log('--------------------MAPS------------------');
const map = new Map();
map.set('name', 'Classico Italiano'); // .set() is used to store a key, value pair in a Map and it "returns the same Map Object(does not create a copy)". since, it returns the same Map object we can use .set() in a chain.
map.set(1, 'Firenze, Italy');
console.log(map.set(2, 'Lisbon, Portugal'));

map
  .set('categories', ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'])
  .set('open', 11)
  .set('close', 23)
  .set(true, 'we are open :)')
  .set(false, 'we are not open :(');

const time = 22;
console.log(map.get(time > map.get('open') && time < map.get('close'))); // Benefit of using a Boolean Key(true, false)-: as the condition becomes true .get() will select the value of the key = true

console.log(map.has('categories'));
console.log(
  map.delete(2)
); /* NOTE-: Index of a Map starts from 0 to (map.size - 1)*/
//console.log(map.clear());

const aRr = [1, 2];
map.set(aRr, 'Test');
map.set(document.querySelector('h1'), 'Heading'); // to use an object as a key.
console.log(map);
console.log(map.size);

//console.log(map.get([1, 2])); // (v.imp.) output = undefined, because array is also a object therefore, they have a reference based memory so, map.set([1,2],'Test') and cl(map.get([1,2])); both are pointing to a different memory location.
console.log(map.get(aRr));

// New way to fill a Map-:
const question = new Map([
  ['Question', 'what is the best programing language in the world ?'],
  [1, 'java'],
  [2, 'C'],
  [3, 'JavaScript'],
  ['correct', 3],
  [true, 'Correct'],
  [false, 'Try again !'],
]);
console.log(question);
// this syntax is same as returned value of Object.entries(), which is array's inside an array.

// Object to Map conversion-:
const object = new Map(Object.entries(openingHours));
console.log(object);

// quiz app
console.log(question.get('Question'));
for (const [key, value] of question) {
  if (typeof key === 'number') console.log(`Answer ${key}: ${value}`);
}

const answer = 3;
// const answer = Number(prompt('Your answer'));
console.log(answer);
console.log(question.get(question.get('correct') === answer));

// Map to array
console.log([...question]);
// console.log([...question.entries()]); this will be same as-: console.log([...question]); beacuse in map everything is already in key value pair.
console.log([...question.keys()]);
console.log([...question.values()]);

/* (v.v.imp.) NOTE-: in JS there are mainly 4 built-in Data structures-: 1-: Arrays 2-: Objects 3-: Sets 4-: Maps. Now, we often deal with collection of data coming from 
                     web API's which is generally in the JSON format which has a similar structure to an Object, it was an example that Object are necessary too 
                     So, watch the vid. 118 from section - 09 */

// Working with Strings-:
console.log('-----------Strings Part-1--------------');
const airlines = 'Qatar Airways';
const plane = 'Mig20';
console.log(airlines[0]); // Strings has 0 based indexes
console.log('Parth'[4]);

console.log(plane.length);
console.log(airlines.indexOf('r')); // in case of duplicate alphabets in a string indexOf() will return the index of first occuring alphabet in the string.
console.log(airlines.lastIndexOf('a')); // lastIndexOf() is used when a single alphabet occurs more than one time in a string.
console.log(airlines.indexOf('Airways')); // indexOf() method is case sensitive. ex-: if we would have entered 'airways' instead of 'Airways' than it would have returned -1.

console.log(airlines.slice(6)); // it will slice the string from the index "6" and returns a new sub-string(sliced string) not the original string so, it doesn't affect the original string and since., it returns a new string we can log it to the console.
console.log(airlines.slice(6, 9)); // it includes the element at first index in the result value and takes (second index - 1).

console.log(airlines.slice(0, airlines.indexOf(' '))); // to grab the first word in the string.
console.log(airlines.slice(airlines.lastIndexOf(' ') + 1)); // to grab the last word.

console.log(airlines.slice(-2));
console.log(airlines.slice(1, -1));

//(v.v.imp.) NOTE-:  in .slice() method indexing is always done from left to right, doesn't matter wether the given index is +ve or -ve.

// (v.v.imp.) NOTE-: after Wrapping strings(wrapping is to convert primitive to a object) to call methods, the string returned by the method is again converted into a string(primitive).

const checkMiddleSeat = function (seat) {
  // B and E are middle Seats and Seat syntax is 11E, 23c, 43A
  const v = seat.slice(-1);
  if (v === 'B' || v === 'E') {
    console.log('you have got the middle seat😢');
  } else {
    console.log('You got lucky😍');
  }
};
checkMiddleSeat('11B');
checkMiddleSeat('43D');
checkMiddleSeat('65A');

console.log('----------------------STRINGS Part-2-----------------------');

// Fix capitilization in name
const passenger = 'pARtH';
const passengerLower = passenger.toLowerCase();
const passengerUpper = passenger.toUpperCase();
const passengerCorrect = passenger[0].toUpperCase() + passengerLower.slice(1);
console.log(passengerCorrect);

// TO correct e-mail
// NOTE-: Whenever we are comparing a string make sure to first convert that string to lowerCase or upperCase according to the req.
const email = 'parthchauhan3033@gmail.com';
const loginEmail = ' PartHCHauhan3033@Gmail.com';

// const correctEamil = loginEmail.toLowerCase();
// correctEamil.trim();

const correctEamil = loginEmail.toLowerCase().trim(); // .trim() -: to remove all whiteSpaces, also remember that .trim() will not remove the whiteSpaces within the string. ex-: 'par th', here .trim() will not be able to remove the whitespace B/W 'pa' and 'rth'.
console.log(correctEamil);
console.log(email === correctEamil);

// NOTE-: DIfference B/W toLowerCase() and to LocaleLowerCase()-: https://stackoverflow.com/questions/34283414/difference-between-tolocalelowercase-and-tolowercase
// NOTE-: .trimStart() & .trimEnd() are used to remove whitespaces from start and End respectively.

// Replacing
const priceGB = '254,87€'; // for pound(￡) sign -: numLock + alt + 0128(on numeric kwyboard right side) than release alt.
const priceUS = priceGB.replace('€', '$').replace(',', '.');
console.log(priceUS);

const announcement =
  'All passengers come to boarding door 23, Boarding door 23!';

// console.log(announcement.replace('door', 'gate')); // .replace() method replaces the first occurrence of the pasedd string, to replace all strings(all door sub-string) we can use .replaceAll()
console.log(announcement.replaceAll('door', 'gate')); // if .replaceAll() is not working than we can use regEx in Javascript -: console.log(announcement.replace(/door/g, 'gate')); "g after /door/" is here for global means replace all door strings.

// Booleans
const plane2 = 'Airbus A320neo';
console.log(plane2.includes('Air'));
console.log(plane2.includes('A320'));
console.log(plane2.startsWith('A320'));

if (plane2.startsWith('Airbus') && plane2.endsWith('neo')) {
  console.log('this plane is a part of new Airbus family.');
}

const checkBaggage = function (items) {
  const baggage = items.toLowerCase(); // in case if someone passed a uppercase alphabet in the string.
  if (baggage.includes('knife') || baggage.includes('gun')) {
    console.log('you are not allowed on this flight');
  } else {
    console.log('you are welcome aboard');
  }
};

checkBaggage('I have a gun with me for safety measures.');
checkBaggage('I have book to read and a pocket Knife.');
checkBaggage('Socks and Camera.');

// split and join method-:
const name3 = 'Parth Chauhan';
console.log(name3.split(' ')); // will return an array splited around the string passed in the .split() method.

const firstName = name3.split(' ')[0];
const lastName = name3.split(' ')[1];

const newName = ['Mr.', firstName, lastName].join(' '); // The join() method creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator(seperation string is the string used to give seperation B/W the splited array elements) string. If the array has only one item, then that item will be returned without using the separator.
console.log(newName);

const capitalizeName = function (name5) {
  const name4 = name5.split(' ');
  const fullName = [];
  for (const n of name4) {
    // n has the sub-string inside names array
    // fullName.push(n[0].toUpperCase() + n.slice('1'));
    fullName.push(n.replace(n[0], n[0].toUpperCase()));
  }
  console.log(fullName.join(' '));
};

capitalizeName('anna bell peaks');
capitalizeName('parth chauhan');

// Padding-:
const message = 'Go to the board no. 3';
console.log(message.padStart(25, '+')); // .padStart() is used to add padding to a string, where first parameter is the total length(including the padding string) and second parameter is the string to be padded.
console.log(message.padStart(25, '+').padEnd(30, '$'));

const showCardNumber = function (n) {
  const str = n + ''; // or we can do it like-: str = String(n). typeOf(str) = string, beacuse whenever we use a sting with "+" operator it converts the other datatype to the string as well.
  console.log(str.slice(-4).padStart(str.length, '*'));
};
showCardNumber(87977765);
showCardNumber(675454345367567);
// showCardNumber(875674558908934318978); after uncommenting it JS will show "..." in the starting of the number passed, which means that the number passesd is too large to be represented as an Integer.
showCardNumber(7867857556);

// Repeat-:
const message2 = 'Bad weather... All Departures Delayed..... ';
console.log(message2.repeat(4)); // .repeat(x); x is the no. of times you want a string to be repeated.

const planesInLine = function (n) {
  console.log(`There are ${n} planes in line ${'✈'.repeat(n)}`);
};

planesInLine(5);
planesInLine(7);
planesInLine(4);

// NOTE-: since, there are lots of string methods and it will be foolish to learn all the sting methods, but we have learned the important ones. so, search methods on mdnDocs if needed.

///////////////////////////////////////
// Coding Challenge #4

/* 
Write a program that receives a list of variable names written in underscore_case and convert them to camelCase.
The input will come from a textarea inserted into the DOM (see code below), and conversion will happen when the button is pressed.
THIS TEST DATA (pasted to textarea)
underscore_case
 first_name
Some_Variable 
  calculate_AGE
delayed_departure
SHOULD PRODUCE THIS OUTPUT (5 separate console.log outputs)
underscoreCase      ✅
firstName           ✅✅
someVariable        ✅✅✅
calculateAge        ✅✅✅✅
delayedDeparture    ✅✅✅✅✅
HINT 1: Remember which character defines a new line in the textarea 😉
HINT 2: The solution only needs to work for a variable made out of 2 words, like a_b
HINT 3: Start without worrying about the ✅. Tackle that only after you have the variable name conversion working 😉
HINT 4: This challenge is difficult on purpose, so start watching the solution in case you're stuck. Then pause and continue!
Afterwards, test with your own test data!
GOOD LUCK 😀
*/

document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

document.querySelector('button').addEventListener('click', function () {
  // first divide across new line in an seperate array /

  const splittedInput = document.querySelector('textarea').value.split('\n');
  for (let [i, input] of splittedInput.entries()) {
    input = input.toLowerCase();

    // than divide each word across "_" in an seperate array
    let textSplit = input.split('_');
    let firstWord = textSplit[0];
    let secondWord = textSplit[1];
    if (textSplit.length > 2 || firstWord === '' || secondWord === '') {
      textSplit.length > 2
        ? console.log(`string entered in on line ${i + 1} is wrong`)
        : console.log(`string entered in on line ${i + 1} is empty`);
      continue;
    } else {
      secondWord = secondWord[0].toUpperCase() + secondWord.slice(1);
      let output = [firstWord, secondWord].join('').trim();

      output = output.padEnd(20) + `${'✅'.repeat(i + 1)}`;
      console.log(output);
    }
  }
});

// 2nd Solution-:

// document.body.append(document.createElement('textarea'));
// document.body.append(document.createElement('button'));

// document.querySelector('button').addEventListener('click', function () {
//   const text = document.querySelector('textarea').value;
//   const rows = text.split('\n');

//   for (const [i, n] of rows.entries()) {
//     const strSplit = n.split('_');
//     // console.log(strSplit);

//     if (strSplit.length > 2 || rows[i] === '') {
//       strSplit.length > 2
//         ? console.log(`String entered in line ${i + 1} is wrong.`)
//         : console.log(`String entered in line ${i + 1} is empty.`);
//       continue;
//     } else {
//       const newStr1 = strSplit[0].toLowerCase().trim();
//       const newStr2 =
//         strSplit[1].toLowerCase().trim()[0].toUpperCase() + // or we can use .replace() method-: strSplit[1].toLowerCase().trim().replace(newStr2[0], strSplit[0].toUpperCase());  the only problem here using this method is that it replaces a alphabet which is already in upperCase to lowerCase.
//         strSplit[1].toLowerCase().trim().slice(1); // here we are using toLowerCase() method again because we know that toLowerCase() doesn't change the original string and we are accessing the second part(part after "_") of the string using the original string("newStr2").

//       const output = [newStr1, newStr2].join('');
//       console.log(`${output.padEnd(20)}${'✅'.repeat(i + 1)}`); // here output.padEnd() will make the length of each string fixed(length  = 20) so that emoji string starts from a fixed position for each sting in the output. Also we have not mentioned the second parameter of .padEnd() method because we don't want our output string to pad with anything or we could have given a empty string '' instead in the second parameter.
//       // NOTE-: since, block scoping is introduced in ES6 don't console anything outside the blocks of else {} block.
//     }
//   }
// });

// NOTE-: also check the video's solution.
