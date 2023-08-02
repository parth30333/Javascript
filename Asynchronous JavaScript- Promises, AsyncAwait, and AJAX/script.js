'use strict';

/*                                                 (v.v.v.imp.)

Ques-: What is the diff. B/W Synchronous and Asynchronous ? 
Ans-: Synchronous-: 1-: code is executed line by line.
                    2-: code is blocking sometimes, means every line of code has to wait for the previous line to be executed and if a line of code takes more time than
                        other code has to wait, code we are doing till now is Synchronous in nature. 
      
NOTE-: Also the execution of each line of code is done by thread of execution-:  it is a part of the execution context and actually executes the code in computer's CPU.

      Asynchronous-: 1-: Asynchronous code is executed after a task related to that codee that runs in the "background" is finished. 
                     2-: Asynchronous code is non-blocking.
                     3-: Execution context doesn't wait for aynchronous task to finish it's work, synchronous code keeps on executing while asynchronous code runs 
                         in the background.
    
    watch the example of Synchronous and Asynchronous code in vid-: 243                     */

/*                                                              (v.v.v.imp.)

    Note-: There can be multiple example/use-cases of Asynchronous JS, but one of the most important is AJAX calls(Asynchronous javascript and XML)
    AJAX-: AJAX is a part of JS that deals with transferring data to and from servers dynamically(without requiring a full page load) or we can say AJAX is a part of 
           JS that interacts with online API's.
    
    API-: Application programming interface(ex=> a child class using public(parent) class methods). There can be many types of APIs in Web Development-: DOM API, 
          Geolocation API, Own class API, online APIs or Web APIs(generally Web servers).
      
    Online APIs-: Application running on  web Servers that recieves requests for data and send data back as response.
    
    NOTE-: We can build our own APIs(but it requires back-end development for server to ineratct with database) or we can use 3rd-party APIs.
   
    NOTE-: "X" in AJAX stands for "XML", XML is the data format which used to be widely used by most of the APIs for data transfer, but it is the old story, these days
           "JSON"(Javascript object converted into string) data format is used by most of the APIs. So, "X" in AJAX is just a name attached to it because of the initial
           use. 
    */

// NOTE-: A list of all free APIs generally used-: https://github.com/public-apis/public-apis

// First AJAX API call-:

const btn = document.querySelector('.btn-country');
const countryContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} Million</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>`;

  countryContainer.insertAdjacentHTML('beforeend', html);
  countryContainer.style.opacity = 1; // we have done this in .finally()
};

const renderError = function (msg) {
  countryContainer.insertAdjacentText('beforeend', msg);
  countryContainer.style.opacity = 1; // we have done this in .finally()
};

// const getCountryandNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

//   /* NOTE-: we can't store the result immediately inside a variable like this, const data  = request.send(); , because this is a AJAX call, all the process happens
//             Asynchronously and a "load" event is fired as soon as the process is completed. */

//   request.addEventListener("load", function () {
//     let data = JSON.parse(this.responseText); // this = request
//     if (data.length > 1) {
//       [, data] = data;
//     } else [data] = data;

//     renderCountry(data);
//     console.log(data);

//     const [neighbour] = data.borders;

//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener("load", function () {
//       const data2 = JSON.parse(this.responseText);

//       renderCountry(data2, "neighbour");
//     });
//   });
// };

// getCountryandNeighbour("india");

/*  NOTE-: Since, the countries was appearing randomly based on the time taken for the data to arrive form the server, Now we are rendering 2nd country based on
           1st country's data(as we are using borders property). So that neighbour country always appear 2nd. */

/* NOTE-: Above code has event Listener inside event listener, which is adding multiple callbacks for Asynchronous tasks, those callbacks can be in numbers of 
          20,30,100, etc. it will create code very chaotic(it is called callback hell-: when there are multiple callbacks).   */

// NOTE-:  The order of flags appearing on the page can be different, because these are AJAX calls which ever process gets finished early in the background gets executed first.

/*  NOTE-: Any public API you will come up to will have 3 things-: Authentication, HTTPS(a https link is required to access the API), 
           CORS(cross origin resource sharing)-: it will be either YES or Unknown, you can learn more about CORS here-: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS 
           
           Endpoints-: endpoints in REST Countries API is the HTTP URL required to access the API. */

// NOTE-:  Look How the Web Works: Requests and Responses or how client and server communicates in vid-: 245

// const getCountryandNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

/* (v.imp.) NOTE-: 1-: The Solution to callback hell is "Promises" in JS, instead of nested callbacks like before, now we can chain multiple promises for a sequence
                       of Asynchronous operations: "escaping callback hell". 
                   2-: Fetch('URL')-: returns a Promise-: An Object that is used as a placeholder for a future result of a asynchronous operation. 
                   3-: Promise lifecycle-:  Since, Promises works with Asynchronous operations they are time sensitive and can change overtime.So Promises can be in 
                       different states, which leads to Promise lifecycle.
                        Pending (Async task) ----> settled
                                                   /     \
                                           Fullfilled   Rejected
                        we can handle these different states in our code.
                    So, fetch('URL')-> "Builds" a promise and than we "Consume" the Promise.                       
                        */

const getJSON = function (url, errMessage = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${response.status} ${errMessage}`);

    return response.json();
  });
};

// const getCountryData = function (country) {
//   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
//     .then((response) => {
//       if (!response.ok) throw new Error(`Country not Found ${response.status}`);

//       return response.json();
//     })
//     .then((data) => {
//       if (data.length > 1) {
//         [, data] = data;
//       } else [data] = data;
//       renderCountry(data);

//       const neighbour = data.borders[0];
//  //     const neighbour = data.borders[11]; there is no neighbour at index 11.
//       if (!neighbour) throw new Error(`Country not Found ${response.status}`) ;

//       // 2nd Country
//       return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     })
//     .then((response) => response.json())
//     .then((data) => renderCountry(data, "neighbour"))
//     .catch((err) => {
//       console.log(`Something went wrong ${err.message}`);
//       renderError(`Something went wrong error, ${err.message}`);
//     })
//     .finally(() => (countryContainer.style.opacity = 1));
// };

// btn.addEventListener("click", function () {
//   getCountryData("ohjhjk  ");
//   // getCountryData("india");
// });

// const getCountryData = function (country) {
//   // Country 1
//   getJSON(
//     `https://restcountries.eu/rest/v2/name/${country}`,
//     "Country not Found"
//   )
//     .then((data) => {
//       if (data.length > 1) {
//         [, data] = data;
//       } else [data] = data;
//       renderCountry(data);

//       const neighbour = data.borders[0];

//       // if (!neighbour) return; // it will create a error later in the code-: cannot read property of undefined. since, we are not returning anything
//       if (!neighbour) throw new Error("Neighbour not found");

//       // 2nd Country
//       return getJSON(
//         `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
//         "Country not Found"
//       );
//     })
//     .then((data) => renderCountry(data, "neighbour"))
//     .catch((err) => {
//       renderError(`${err.message}. Try again!`);
//     })
//     .finally(() => (countryContainer.style.opacity = 1));
// };

// btn.addEventListener("click", function () {
//   getCountryData("australia");
//   // getCountryData("india");
// });

/*                                                        "Consuming and Chaining Promises "

   NOTE-: 1-: Since we know that fetch() returns promise immediately so, we call a method ".then()" on the promise which will accept a callback(as a argument) and that callback will 
          be executed as soon as the promise is fulfilled. In then() method, callback has a argument which is the response from the server to the server request and to see the response
          we have to call .json() method on the response which in turn will also return a promise and to see data in the 2nd promise we have to call then() method again
          and the 2nd callback's argument of 2nd then() method will have the actual data.  
          
          2-: then() method always returns a Promise no matter wether we actually return something or not in then. So, we have returned a Promise instead of the default promise
              and that promise will become the fulfillment value.

          3-:  Mistake to avoid-: Since we know that fetch() method immediately returns a Promise that's why some people attach then() method directly to 2nd Country 
               fetch() but that will result in a callback hell(because 2nd fetch() is a return value of the callback of 2nd then() and if we would have attached a 3rd
               then() to it will create a callback inside a callback)
          . */

/*                                                              "Error Handling" 

  NOTE-: 1-:  a-: We can pass a 2nd callback function into then() method(to catch the error) which has a "error" argument.
               b-: All the errors propagate down to the end of the chain so we can catch the error at the end of the chain using "catch()" method instead passing 2nd 
                   callback to every then() method and .catch() always returns a Promise.

          2-: We can also use a  method .finally() at the end of the chain which which will always execute the callback(inside finally) wether Promise gets fulfilled    
              or rejected. .finally() works because .catch() returns a Promise, which means finally() gets executed after catch is executed. 
          
          3-: The Problem with using only catch() method to catch a error is, fetch() method only rejects a promise when there is no internet connection. So,in case if 
              we pass a wrong country in getCountryData() method then the country in the promise would be undefined and error will be cannot read property of undefined,
               but important is promise stil generated. So, we are not able to see the correct Error. we can throw a mannual error using "throw new Error('error message')"
               which will reject the promise returned by then() method and we have to throw a mannual error in every then() method because error can arrive in any chained
               then() method(ex=> if there is no neighbour country(australia has no neighbour)).
          
          4-: Rejected promise from throw new Error() will propagate down to chain and catch() method will catch the correct error.    */

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.
Here are your tasks:
PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.
PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)
TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474
GOOD LUCK 😀
*/

// const whereAmI = function (lat, lng) {
//   fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then((res) => {
//       if (!res.ok) throw new Error(`Problem with Geocoding API, ${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log(`You are in ${data.city}, ${data.country}`);
//       return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
//     })
//     .then((response) => {
//       if (!response.ok) throw new Error(`Country not found!`);
//       return response.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) => console.error(`${err.message}`));
// };

// whereAmI(52.508, 13.381); // The API we used doesn't work sometimes so, reload the page.

/*                                                       Behind the scenes of Asynchronous JS 
Event Loop-: As we have studied previously that a JS Runtime has-: JS Engine(memory heap, call stack), Web APIs, Event loop & callback queue. callback queue has all
             callback functions in the code. Once the call stack is empty  event loop pushes all the callback functions in call stack that's is the reason we need 
             callback functions for Asynchronous code, because they get executed once a condition is fulfilled.
      
Non-blocking Concurrency model(Asynchronous Behaviour)-: JS is single threaded therefore it executes one task at a time. So, it requires a mechanism to execute Async. 
                                                         code. All the Async. code in JS runs in the Web API Environment "becasue the event Attached to the Async. 
code(let's say "load event" fired after loading of image or we can say loading of image happens inside Web API Environment) is put inside the Web API Environment and thus the  
                                                         callback attached to that event is also put inside Web API Environment", once the event(image loading) in Web API  
                                                         Environment is loaded or completed than callback attached to that event(callback inside addEventListener which  
                                                         runs after load event) is shifted to the callback Queue by the Runtime Environment, but in case of Normal  
                                                         callback, callback is directly put inside the callback Queue.
                                              
NOTE-: For Async. code being executed in a non-blocking way 3 things are Responsible-: Web API Environment, Callback Queue, Event Loop.

(v.v.v.imp.) settimeout is Dillusional-: Let's say time set in settimeout() function is "5 sec" which means after 5 sec. the callback inside setTimeoout() or Async. code
                              is put inside callback Queue by runtime Environment and in case there are other callback's waiting inside the callback Queue and suppose it
                                         takes 1 sec. to put all the callbacks into call stack by event loop. So, total time taken to execute settimeout() function
                                         callback is 5+1 = 6 sec not 5 sec. 
                                        
(v.v.imp.) Micro-tasks Queue-: some Async. callback's from Web API Environment goes to micro-tasks Queue "which has a higher priority over callback Queue" and callback
                               functions inside microtasks Queue are put inside call stack before callback functions inside callback Queue. ex=> As soon as the fetch() 
                         gets data(Promise) from the server(3rd party API), the callback inside the fetch().then() method is placed inside the micro-tasks Queue and than 
                               moved inside the call stack by Event Loop before other callback functions in callback Queue.
  */

// // Event Loop and settimeout() dilusional behaviour in practice-:
// console.log("start");
// setTimeout(() => console.log("0 sec. timer"), 0);
// Promise.resolve("Promise 1").then((res) => {
//   for (let i = 0; i < 1000000000; i++) {}
//   console.log(res);
// });
// console.log("end");

// // timer will wait till the promise callback is executed

// // Build a Simple Promise-:
// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log("Lottery draw is happening 🔮");
//   setTimeout(function () {
//     if (Math.random() >= 0.5) resolve("You win 🍷");
//     else reject(new Error("You lost your money 💩"));
//   }, 2000);
// });

// lotteryPromise
//   .then((res) => console.log(res))
//   .catch((err) => console.error(err));

// /*  NOTE-: new Promise() accepts a executor function(means as soon as the Promise Constructor runs it automatically execute the executor function) and executor function
//            has 2 arguments resolve & reject, which are functions. resolve function is executed when a Promise is fulfilled and reject() function is executed when a
//            Promise is rejected and to make the code Async. we added a setTimeout() function(beacause we are creating a Promise immediately, Promise is not waiting for data).   */
// // we are handling(consuming) promise like we used to consume promise recieved from fetch() method

// // Promisifying callbacks-: it is used to convert callback based Async. code into Promise based Async. code

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// }; // wait() function is like fetch(), which returns a promise which can be consumed later

// wait(1)
//   .then(() => {
//     // we have not passed response argument in then() because we have not defined anything inside response() function in the Promise wait() function.
//     console.log("1 second passed");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("2 second passed");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("3 second passed");
//     return wait(1);
//   })
//   .then(() => console.log("4 second passed")); // attaching another then() is like chaining Promises in AJAx calls we previously did.

// // setTimeout(() => {
// //   console.log('1 second passed');
// //   setTimeout(() => {
// //     console.log('2 seconds passed');
// //     setTimeout(() => {
// //       console.log('3 second passed');
// //       setTimeout(() => {
// //         console.log('4 second passed');
// //       }, 1000);
// //     }, 1000);
// //   }, 1000);
// // },
// // when only setTimeout() would be used or only callback based Async. would be used, this code is similar to the wait()

// // we can also fulfill or Reject a Promise immediately-:

// Promise.resolve("abc").then((x) => console.log(x));
// Promise.reject(new Error("Problem!")).catch((x) => console.error(x));

// Promisifying Geolocation API-:

// const getPosition = navigator.geolocation.getCurrentPosition(
//   (pos) => console.log(pos),
//   (err) => console.log(err)
// );
// console.log("Getting Position"); // to show that geolocation API works Asynchronously

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     // navigator.geolocation.getCurrentPosition(
//     //   (position) => resolve(position),
//     //   (err) => reject(err)
//     // );
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//     // since, getCurrentPosition() calls the function and passes the argument automatically, so we don't have to specify the resolve & reject function manually like in code commented out above.
//   });
// };

// getPosition().then((pos) => console.log(pos));
// console.log("Getting Position");

// const whereAmI = function () {
//   const position = getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     })
//     .then((res) => {
//       if (!res.ok) throw new Error(`Problem with Geocoding API, ${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log(`You are in ${data.city}, ${data.country}`);
//       return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
//     })
//     .then((response) => {
//       if (!response.ok) throw new Error(`Country not found!`);
//       return response.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) => console.error(`${err.message}`));
// };

// btn.addEventListener("click", whereAmI);

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.
Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉
PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.
If this part is too tricky for you, just watch the first part of the solution.
PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.
TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.
GOOD LUCK 😀
*/

// const createImage = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement('img');
//     img.src = imgPath;

//     img.addEventListener('load', function () {
//       document.querySelector('.images').append(img);
//       resolve(img);
//     });

//     img.addEventListener('error', function () {
//       reject(new Error('Image not loaded'));
//     });
//   });
// };

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// let currentImg;
// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image 2 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.error(err));

// do Network-fast 3G to have the same effect as in video

/////////////////////////
// Consuming promises using Async/await-: it is an another way to consume promises like .then(), mostly diff. is of Syntax.

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// const whereAmI = async function () {
//   // Gelocation

//   try {
//     const pos = await getPosition();
//     console.log(pos);

//     // Reverese Geocoding
//     const { latitude: lat, longitude: lng } = pos.coords;

//     const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     if (!resGeo.ok) throw new Error('Country cannot be found');
//     const dataGeo = await resGeo.json();

//     // Country data
//     const res = await fetch(
//       `https://restcountries.eu/rest/v2/name/${dataGeo.country6u56}`
//     );
//     if (!res.ok) throw new Error('Problem in finding Country');
//     const data = await res.json();
//     console.log(data);
//     renderCountry(data[1]);

//     return `You are in ${dataGeo.city}, ${dataGeo.country}`;
//   } catch (err) {
//     throw err;
//   }
// };

// /* (v.v.v.imp.) Ques-:Why doesn't the promise gets rejected as we have thrown a error manually in case of error in the 2nd fetch() ?
//                 Ans-: 1-: As we know async keyword functions always returns a Promise and to reject the Promise in case of a error not identified by the fetch()
//                       (like 404 error) we have to throw a error and catch it, but problem here is 2-: we are using try & catch inside the asnc functions thus we are
//                       not able to catch the final promise returned by async functions and thus promise doesn't gets rejected. if

//                 Solution-: To reject a promise in an async function, throw a error in catch block.         */

// /* (v.imp.) Here Problem with try & catch is , it only catch the error when promise gets rejected and in "403 or 404" error promise is not considered rejected. So,
//             we have to throw error manually. */

// // In whereAmI()-: 1st we get coordinates-> then get the country from coordinates-> then display the country
// // whereAmI()
// //   .then(city => console.log(city))
// //   .catch(err => console.error(err.message));

// (async function () {
//   try {
//     const city = await whereAmI();
//     console.log(city);
//   } catch (err) {
//     console.error(err.message);
//   }
// })(); // this IIFE is similar to then().catch() in the in commented code above.

// (v.v.imp.) NOTE-:  Always wrap a Async keyword function in try and catch block.

/* NOTE-: "Async" keyword will make the function Asynchronous and await is used to consume the promise, but it happens in the background where await waits for the 
          Promise and as the Promise arrives we can store it into a variable and that is one of the major diff. B/W consuming Promises using Async/await & then() as we
          remember we were not able to store consumed Promises into variable, also await() waits for the promise or "stops the execution of the async function" unitl
          promise is arrived, but the main thread keeps executing the code other than function(as async keyword is resposible to execute function in the background or 
          asynchronously).     
      
  try and catch-:  we can use try and catch to catch error in normal code in JS as well.       */

// Returning a value from async/await function-:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

/* (v.v.imp.) NOTE-: A fetch() call is only rejected if the network request itself fails for some other reason (host not found, no connection, server not responding, etc...).
                     Any result back from the server (404, 500, etc...) is considered successful request from the promise point of view. */

/////////////////
// Running Promises in Parallel-: when the Promises are not related to each other.

// const get3Countries = async function (c1, c2, c3) {
//   try {
//     // const [data1] = await getJSON(`https://restcountries.eu/rest/v2/name/${c1}`);
//     // const [data2] = await getJSON(`https://restcountries.eu/rest/v2/name/${c2}`);
//     // const [data3] = await getJSON(`https://restcountries.eu/rest/v2/name/${c3}`);
//     // console.log([data1.capital, data2.capital, data3.capital]);

//     const data = await Promise.all([
//       getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
//       getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
//     ]);
//     console.log(data.map(d => d[0].capital));
//   } catch (err) {
//     console.error(err);
//   }
// };

// get3Countries('portugal', 'australia', 'usa');

// Promise.race()-:
// (async function () {
//   const data = await Promise.race([
//     getJSON(`https://restcountries.eu/rest/v2/name/usa`),
//     getJSON(`https://restcountries.eu/rest/v2/name/Italy`),
//     getJSON(`https://restcountries.eu/rest/v2/name/Portugal`),
//   ]);
//   console.log(data[0]);
// })();

// const timeOut = function (sec) {
//   return new Promise((_, reject) => {
//     setTimeout(function () {
//       reject(new Error('Data cannot be fetched'));
//     }, sec * 1000);
//   });
// };

// Promise.race([
//   getJSON('https://restcountries.eu/rest/v2/name/afghanistan'),
//   timeOut(2), // use 0.5 sec
// ])
//   .then(res => console.log(res[0]))
//   .catch(err => console.error(err));

// // Promise.allSettled()-:
// Promise.allSettled([
//   Promise.resolve('success'),
//   Promise.reject(new Error('Problem in fetching Promise')),
//   Promise.resolve('success 2'),
// ]).then(res => console.log(res));

// Promise.any([
//   Promise.resolve('success'),
//   Promise.reject(new Error('Problem in fetching Promise')),
//   Promise.resolve('success 2'),
// ]).then(res => console.log(res));

/*  (imp.) NOTE-: 1-: Promise.all() returns a new Promise which runs all the Promises inside the array passed as an argument. So, we can consume the Promise from 
                  Promise.all() using "await". and the consumed Promise(which runs all other promised) will return an array having other arrays and each array will have
                  a promise(which is the result of running getJSON() method).

                  2-:Promise.all() is called a Promise Combinator.
                  
                  2-: if one of the Promise inside the Promise combinator gets rejected all the promise will get Rejected. But it doesn't happen very often and it is 
                      better to use combinators because they can save a lot of time of loading a Website.
                      
                  Promise.race()-: It returns a promise not an array, which ever Promise passed in the argument array gets settled(rejected or fulfilled) first becomes 
                                   the returned value of Promise.race().
                  
                (v.imp.)-: we can use Promise.race() where a promise might take long time for processing than we can pass an error like we did in line 606.
                
                (v.imp.) Diff. B/W Promise.all() & Promise.allSettled()-:
          
                Promise.all will reject as soon as one of the Promises in the array rejects.                                            
                Promise.allSettled will never reject - it will resolve once all Promises in the array gets either rejected or resolved.
                                                                        
                Their resolve values are different as well. Promise.all will resolve to an array of each of the values that the Promises 
                resolve to - eg [Promise.resolve(1), Promise.resolve(2)] will turn into [1, 2]. Promise.allSettled will instead give you
                [{ status : 'fulfilled', value: 1 }, { status : 'fulfilled', value: 2 }]
                           
                  Promise.any()-: It is same as Promise.race(), but it ignores the rejected Promise or it only returns only fulfilled promises.                       
                  */

///////////////////////////////////////
// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.
PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).
TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.
GOOD LUCK 😀
*/

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      document.querySelector('.images').append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not loaded'));
    });
  });
};

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// // PART-1
// const loadNPause = async function () {
//   try {
//     let img = await createImage('img/img-1.jpg');
//     console.log('Imgage 1 is loaded');
//     await wait(2);
//     img.style.display = 'none';

//     // Load Image 2
//     img = await createImage('img/img-2.jpg');
//     console.log('Image 2 is loaded');
//     await wait(2);
//     img.style.display = 'none';
//   } catch (err) {
//     console.error(err.message);
//   }
// };
// loadNPause();

// PART-2
const loadAll = async function (imgArr) {
  try {
    let imgs = imgArr.map(async img => await createImage(img));
    console.log(imgs);

    const imgsEl = await Promise.all(imgs);
    console.log(imgsEl);
    imgsEl.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.error(err.message);
  }
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
