'use strict';

/* NOTE-: install prettier in VScode packages and than go to file-preferences-settings and set the default formatter to 'preettier' and also 
          set 'Format on save' in settings. while using prettier we don't have to worry much about the cleanliness of the code and makes our
          code consistent. */

/*  NOTE-: To change something in 'prettier', google-prettier-docs-about-configuring prettier-options-than create a '.prettierrc' named file  
           and add everything inside that file you want to configure.*/

/* NOTE-: to make coding easier we can make our snippets(we can make shortcuts keys for certain expressions, like creating a shorcut "cl" for console.log()), procedure to that is => 
          file-preferences-user_snippets-new_global_snippets after that watch video 55, 11:30 min.*/
/* NOTE-: 'settings sync' extension will create a gist on your github account and in that 'gist' all your VScode settings & extensions gets 
           uploaded( shift+alt+u ) and settings can be downloaded from the github gist as well( shift+alt+D ) in case you are using VScode on
           another computer or using VScode with another account.*/
/* NOTE-: to create or search shortcut key in VScode preferences-keyboard shortcuts-search the operatoion for which you want the shortcut key.*/

/* NOTE-: find what is node js and npm in important questions folder. */

// PROBLEM 1:
/* We work for a company building a smart home thermometer. Our most recent task is this: "Given an array of temperatures of one day, calculate the temperature 
   amplitude. Keep in mind that sometimes there might be a sensor error." */

const temperatures = [3, -2, -6, -1, 'error', 9, 13, 17, 15, 14, 9, 5];

// 1) Understanding the problem
// - What is temp amplitude? Answer: difference between highest and lowest temp
// - How to compute max and min temperatures?
// - What's a sensor error? And what do do?
// 2) Breaking up into sub-problems
// - How to ignore errors?
// - Find max value in temp array
// - Find min value in temp array
// - Subtract min from max (amplitude) and return it

const caclTempAmplitude = function (temp) {
  let max = temp[0];
  let min = temp[0];

  // we can also find min. and max. temperatures using "Math.min(array)" and 'Math.max(array)'.

  for (let i = 0; i < temp.length; i++) {
    const curTemp = temp[i];

    if (typeof curTemp !== 'number') continue; // type of returns a string having the type of datatype.
    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }

  return max - min;
};

const amplitude = caclTempAmplitude(temperatures);
console.log(amplitude);

// PROBLEM 2:
// Function should now receive 2 arrays of temps
// 1) Understanding the problem
// - With 2 arrays, should we implement functionality twice? NO! Just merge two arrays
// 2) Breaking up into sub-problems
// - Merge 2 arrays

const caclTempAmplitudeNew = function (t1, t2) {
  const temp = t1.concat(t2);
  let max = temp[0];
  let min = temp[0];

  // we can also find min. and max. temperatures using "Math.min(array)" and 'Math.max(array)'.

  for (let i = 0; i < temp.length; i++) {
    const curTemp = temp[i];

    if (typeof curTemp !== 'number') continue; // type of returns a string having the type of datatype.
    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }

  return max - min;
};

const newAmplitude = caclTempAmplitudeNew(
  [0, 1, 5, 7, -3, 8],
  [2, 4, 1, 7, -8, -4]
);
console.log(newAmplitude);

// NOTE-: watch vid. 61 which is very important to learn debugging. and also learn how to write testscripts.
// NOTE-: console.table(obj); to display the object in console in table format, which is easy sometimes to understand a longer object.

// Coding Challenge #1

/*
Given an array of forecasted maximum temperatures, the thermometer displays a string with these temperatures.
Example: [17, 21, 23] will print "... 17ºC in 1 days ... 21ºC in 2 days ... 23ºC in 3 days ..."
Create a function 'printForecast' which takes in an array 'arr' and logs a string like the above to the console.
Use the problem-solving framework: Understand the problem and break it up into sub-problems!
TEST DATA 1: [17, 21, 23]
TEST DATA 2: [12, 5, -5, 0, 4]
*/

/*
// 1) Understanding the problem
// - Array transformed to string, separated by ...
// - What is the X days? Answer: index + 1
// 2) Breaking up into sub-problems
// - Transform array into string
// - Transform each element to string with ºC
// - Strings needs to contain day (index + 1)
// - Add ... between elements and start and end of string
// - Log string to console */

const data1 = [17, 21, 23];
const data2 = [12, 5, -5, 0, 4];

const printForecast = function (t1, t2) {
  const temps = t1.concat(t2);

  let str = '';

  for (var i = 0; i < temps.length; i++) {
    str = str + `${temps[i]}ºC in ${i + 1} days... `;
  }
  return '... ' + str;
};

const forecast = printForecast(data1, data2);
console.log(forecast);
