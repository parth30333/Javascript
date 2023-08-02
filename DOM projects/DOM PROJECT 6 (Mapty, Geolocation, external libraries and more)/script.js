'use strict';

//(v.v.imp.) NOTE-: watch vid-: 228 (how to plan a web project), it will help me making the architecture and flowchart of my projects in future.

// Geolocation API-: it is a Browser's API like-: DOM, Intersection, etc.

// (v.imp.) NOTE-: There are multiple Browser's API like API to access camera, etc. we can use them when required.

// Create the Websiite from scratch on your own for practice and implement all the functionalities told in the last video of the section also watch the last video-:

// Workout classes-:
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in Km
    this.duration = duration; // in min.
  }

  _setDescription() {
    // prettier-ignore
    // we have wrote the comment above to change the appearence of array below, can check the original appearence by removing this comment.
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/*(v.imp.) NOTE-: we have created "id" field in workout class to identify each Object created using Workout, Running or Cycling class(as these are child of Workout class
                  hence they will also have "id property"), but in real world application it is a bad practice to use Date.now as a id because 2 different users can 
                  create a workout a the same time than, Date.now() will create a same timestamp.   */

////////////////////////////////////////////////////
// App Architecture-:

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;

  constructor() {
    // get User's position
    this._getPosition();

    // get data from loacal storage
    this._getLocalStorage();

    // attaching Event Listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._togglElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Your position cannot be fetched');
        }
      );
    // this._loadMap is called by the getCurrentPosition() function thus, this._loadMap is a normal call and "this keyword" will be undefined.
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.co.in/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    // Using Leaflet library to display map-:
    // Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. We can use npm to install this library or just add the "leaflet CDN script"
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    console.log(this.#map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling click event on Map-:
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');

    form.style.display = 'none'; // because of as soon as we remove the hidden class, form class in css starts functioning and "transition animation in form class in css" moves the workout in list up and we din't want that effect that's we have set the display: none.
    setTimeout(() => (form.style.display = 'grid'), 1000); // beacuse in css form class display was initially set to display:grid;
  }

  _togglElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputDistance.focus();
  }

  _newWorkout(e) {
    e.preventDefault(); // to prevent form from reloading  the page.
    const validinputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const positiveInputs = (...inputs) => inputs.every(inp => inp > 0); // elevation can be -ve thus we have created 2 helper functions to check inputs.
    const { lat, lng } = this.#mapEvent.latlng;

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    // if workout running, create a running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // check if data is valid
      if (
        // using a guard clause
        !validinputs(distance, duration, cadence) ||
        !positiveInputs(distance, duration, cadence)
      )
        return alert('Inputs are not Correct!');

      workout = new Running([lat, lng], distance, duration, cadence);
      console.log(workout);
    }

    // if workout cycling, create a cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value; // "+" to change the input string into numbers and "Elevation can be zero".

      // check if data is valid
      if (
        !validinputs(distance, duration, elevation) ||
        !positiveInputs(distance, duration)
      )
        return alert('Inputs are not Correct!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new workout object to the workout array
    this.#workouts.push(workout);

    // Render workout on map as a marker
    this._renderWorkoutMarker(workout);

    // Render workout as a list
    this._renderWorkout(workout);

    // Hide form + clear input fields-:
    this._hideForm();

    //set Local storage to all workouts-:
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // Creating and displaying a marker-:

    // console.log(this.#mapEvent);
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      ) // setContent method return "this keyword" so that we can chain methods and setPopupContent is a L.maker() method and there is also a method on L.popup() we can use that method too. .
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id= ${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'running')
      html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`;

    if (workout.type === 'cycling')
      html += `
         <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> `;

    form.insertAdjacentHTML('afterend', html); // we have choosen "form", beacuse in the list(<ul> <li>) we want workouts to be the sibling('afterend) of the form.
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout'); // we have used closest() after e.target because there are multiple html elements on the wokout item in the list, but we want the element which is closest to the container(<ul></ul>) and have a class "workout".

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // (v.v.imp.) NOTE-: in the above method, e.target points to submit button which was used to create a workout in HTML. Since, the addEventListener is attached to the containerWorkout and submit button in HTML is also inside the containerWorkout in HTML so whenever we create a workout by submitting the form(using enter keyword) click event is fired(i don't know why) and that's why e.target was pointing to submit button.
  // (v.v..v.imp.) Find the solution for the above problem

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts)); // we have to convert the data to be stored locally into string and the is stored in an array.
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => this._renderWorkout(work));

    // (v.imp.) NOTE-: we have called this._renderWorkoutMarker in _loadMap() method not here because we are calling _getLocalStorage method in the contructor so as soon as the page loads up _getLocalStorage method gets called, but the map loads after some time. so we render marker on the map when map is loaded by _loadMap() method.

    // (v.v.v. imp.) NOTE-: when we convert our object to string and than string back to the Object, we lost the prototype chain so the objects fetched from local storage are normal objects.
  }

  // Public method-:
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();

// NOTE-: To convert Object into String-: JSON.stringify() , To convert String into Object-: JSON.parse()

// NOTE-: we have called the methods in the constructor not by the instance(app) because we want everything to be loaded automatically as the page loads up.

/* (v.imp.) Ques-: How we are able to use "e event" in _newWorkout() method considering that we have changed the "this.keyword" using "bind" while calling the _newWorkout method in the constructor function ?
            Ans-: Beacuse callback accepts a single parameter: an object based on Event describing the event that has occurred, and it returns nothing. And we are 
                  calling the addEvenListener on the form so, "e" parameter will always the information about the event occuring rergardless of "this keyword".   */

//(imp.) NOTE-: we have stored L.map().setView() in the variable "map" beacause we want to call an event listener on the map later and "leaflet offers a special type of addEventListener() method" called "map.on()" which works almost same as addEventListener() and map.on.has an argument similar to event argument in addEventListener().

// (v.imp.) NOTE-:  get used to of using libraries and frameworks and to use them it is very important to learn from their documentation.

/*(v.imp.) NOTE-: "L" in the leaflet code is a name Space or a entry point object provided by the library which have many methods attached to it. like-: INtl() in 
                   internationalisation API which have multiple methods attached to it. 
                   methods-: L.map('id') -: it accepts the "id" of the HTML code where Map is to be displayed on the website.  L.map().setView([coordinates], map Zoom value),
                   L.maker() -:  is used to create the map. 
                   L.tileLayer() -: it accepts the url of the map which is to be loaded and in that URL some customizations for the map are also present and you can learn about the customizations in the leaflet documentation.
                   "TileLayer" is the structure of the map, map is made out of multiple tiles(can learn about this on google)
                   "openstreetmap" in the URL is a open source map.*/

// navigator.geolocation.getcurrentPosition()-: 1st function gets executed when position is located, 2nd function is executed when position is not located.

/*   (v.imp.) NOTE-: If we have multiple scripts in our code than global variables of a script can be accessed by other scripts, but it depends on the order of 
                     occurence of those scripts in HTML. It means "L" Object is a global variable in leaflet script ex-: watch below */

// console.log(firstName); // firstName is defined in "others.js" script, script.js can access global variables of leaflet & others.js script but "others.js" can only global variables of leaflet Script.

/* Ques-:  Why we have used defer for script loading ?
   Ans-: 1-: Because when we use script tag at the end of the Body than script will be fetched by the DOM after "domContentLoaded event" is fired (this event is fired 
          when HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.)
         2-: Using Async-: The script is loaded asynchronously and executed immediately, means script is fetched while HTML parsing is in the process, but script gets 
                           executed immediately and HTML code has to wait till script execution is complete.
         3-: Using Defer-: script is still loaded/fetched asynchronously but executed after "domContentLoaded event is fired".  
         
         Advanatge of "Defer" over "Async"-: "domContentLoaded event is generally fired when all the HTML is parsed and all the scripts are executed" and "Async" is 
                                              the exception where DOMContentLoaded doesn't wait for the script to be loaded. So, if a very long script takes more time
                                              to get fetched by the DOM then HTML gets loaded before the script is executed, this will create problem in the website.*/
