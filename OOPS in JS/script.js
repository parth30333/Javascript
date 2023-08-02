'use strict';

// NOTE-: Read OOP Notes from the JS old course notebook.

/*  NOTE-: Basic structure of OOP in JS using constructor function pattern.  1-: new {} is created
                                           2-: this keyword in constructor function call is set to the newly created object.
                                           3-: {} linked to prototype property, but always remember that the "prototype property is the proprty of constructor function" 
                                               but "prototype property is the prototype of all the new objects being created using that constructor function".
                                           4-: constructor function automatically return the newly created object. */

/* Ques-: What is prototypal inheritance Behaviour of JS in OOP ?
     Ans-: When we call a method or use a property on an instance(object created using constructor function) which is not present in the constructor function pattern,
           JS looks for that method or property in the prototype of that instance and JS will keep on looking until the prototype chain ends(end of the prototype 
           chain is null).*/

// NOTE-: Do not use arrow functions in OOP, because of this keyword problem.

const Person = function (firstName, birthYear) {
  // instance properties-:
  this.firstName = firstName;
  this.birthYear = birthYear;

  // never write methods in function constructors-:
  // this.calcAge = function () {
  //   console.log(2021 - this.birthYear);
  // }; // beacause when we do this, method gets attached to every instance created fom this contructor function and hence it will increase the data inside a instance
  // irrespective of wether it is req. or not.
};
const parth = new Person('parth', 2000);
console.log(parth);

Person.prototype.calcAge = function () {
  return 2021 - this.birthYear;
};
console.log(parth.calcAge());
// NOTE-: every object has access to all the properties and methods associated to their prototype object.

console.log(parth.__proto__); // you can check out the methods and properties on the prototype object of parth object.
console.log([1872, 9878, 86, 'sd'].__proto__); // it will show you the prototype object for arrays, which will have all the methods & properties we can use on an array.

Person.prototype.species = 'Homo Sapiens';
console.log(parth.species);

console.log(parth.hasOwnProperty('species')); // false, beacuse it is not inherited from the constructor, it is a prototype property.

// (v.imp.) NOTE-: Look at the prototype chain of DOM in vid. 208 from 12:00

// creating a method on built-In Objects like Array.prototype
Array.prototype.unique = function () {
  return [...new Set(this)];
};
console.log([2, 4, 5, 62, 2, 5, 7, 4].unique());

// NOTE-: DO not create methods on built-in objects prototype, because it will create confusion for other people working on the same project, also if a new method of
//        same name is introduced in the new version of JS than our code will use the method in the newer version.

// (v.imp.) NOTE-: The real reason why we can call methods on a function is-: function itself is a special type of object in JS and thus have prototype which is a
//                 object and object has methods Look at the console of code below.

const name = function () {
  return 'parth';
};
console.dir(name);

//////////////////////
// Coding Challenge #1
/* 
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.
DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h */

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} going at ${this.speed} km/h`);
};
Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} going at ${this.speed} km/h`);
};

const bmw = new Car('BMW', 120);
const Mercedes = new Car('Mercedes', 95);

bmw.accelerate();
Mercedes.brake();
Mercedes.accelerate();
bmw.brake();

// static method-:
Person.hey = function () {
  console.log('hey there 👋');
  console.log(this); // this = object calling the method, since it is a static method only Person object can call this.
};
Person.hey();

/* ES6 Classes-: 
                 Classes in Js are baically like contructor function pattern only diff. B/W classes and function constructor pattern is the Syntax. */

// Like functions classes can be declared as function expressions-:

// classes declaration-:
// const PersonCl = class {};

// class declarations-:
class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }
  // instance methods-:
  // Methods will be added to the prototype property-:
  calcage() {
    console.log(2021 - this.birthYear);
  }

  // set a property that already exist-:
  set fullName(name) {
    // if (name.includes(' ')) this.fullName = name; // this will create a max call stack size exceeded error because "both contructor and setter function are trying to set a property with name = fullName".
    if (name.includes(' ')) this._fullName = name;
  }
  get fullName() {
    return this._fullName;
  }

  // static methods-:
  static hey() {
    console.log('hey there 👋');
    console.log(this);
  }
}

// Static methods-: They are mostly used as helper methods these are like Array.from() method or Number.parseFloat() method which are attached only to the contructor itself not to the prototype, example below.
PersonCl.hey();

const parth2 = new PersonCl('Parth Chauhan', 1999);
parth2.calcage();

// NOTE-: see the line of Code below
console.log(parth2); //  the constructor call fullName property which in turn call "set fullName" and that's why property name initially in parth2 object is _fullName not fullName
console.log(parth2.fullName); // if we don't use getter than output = undefined because this.fullName property in the contructor has been overridden by "_fullName" property in setter function.

PersonCl.prototype.greet = function () {
  console.log(`Hey ${this._fullName}`);
};
parth2.greet(); // we can declare prototypal methods using prototype property as well as declaring them inside the class.

// NOTE-: methods declared in classes are prototypal methods, look at the example below.
console.log(parth2.__proto__ === PersonCl.prototype); // true

/* (v.imp.) NOTE-: diff. B/w Classes and Constructor function-: 
                   1-: Classes are not hoisted. So, we can use class declaration as well as class expressions.
                   2-: Classes are first class citizens. (we can return a class from a function and pass it as an parameter to a function.)
                   3-: Classes are always executed in strict mode(doen't matter wether we use strict mode in the script)*/

const account = {
  owner: 'parth',
  movements: [100, 787, 9],

  get latest() {
    return this.movements.slice(-1).pop();
  },
  set array(mov) {
    this.movements.push(mov);
  },
};

// NOTE-: We can declare a object with getter and setter like we did above, but declaring one of them would be sufficient.

console.log(account.latest);
account.array = 76; // (v.v.imp.) NOTE-: Since setter is treated as a property in a class that's why we have assigned it with a value which will be the parameter of the setter function when it was declared inside the class.
console.log(account.movements);

// NOTE-: set and get in a class are treated as a property.

// Object.create()-: it is used to create a new object and assign it's prototype manually.

const PersonProto = {
  calcAge() {
    console.log(`${this.firstName} is ${2021 - this.birthYear} years old.`);
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto); // steven object gets created and it's prototype is "PersonProto"
console.log(steven.__proto__ === PersonProto);
steven.firstName = 'steven';
steven.birthYear = 1999;
steven.calcAge();

const john = Object.create(PersonProto);
john.init('john', 2002); // "this keyword always point to the object calling the method. So, init() function will create firstName & birthYear property in john object.
john.calcAge();

///////////////////////////////////////
// Coding Challenge #2
/* 
1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.
DATA CAR 1: 'Ford' going at 120 km/h
GOOD LUCK 😀
*/

class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }
  accelerate() {
    this.speed += 10;
    console.log(`${this.make} going at ${this.speed} km/h`);
  }
  brake() {
    this.speed -= 5;
    console.log(`${this.make} going at ${this.speed} km/h`);
  }

  get speedUS() {
    return this.speed / 1.6;
  }
  set speedUS(s) {
    this.speed = s * 1.6;
  }
}

const ford = new CarCl('Ford', 100);
console.log(ford.speedUS);
ford.speedUS = 50;
console.log(ford);

///////////////////////////////////////
// Inheritance Between "Classes": Constructor Functions

const Student = function (firstName, birthYear, course) {
  // console.log(this); // Student, whenever a new instance will be created using Student class "new keyword" creates a new instance and sets this keyword to the contructor function object.
  Person.call(this, firstName, birthYear); // if we would have done a normal function call {Person()} than "this keyword would be undefined". So, we have set the "this keyword" manullay to Student Object(class).
  this.course = course;
};

// (v.v.imp.) Linking Prototypes (to add Person constructor function prototype to the prototype chain of Student Object(class))-:
Student.prototype = Object.create(Person.prototype);

// (v.v.imp.) NOTE-: Link prototypes before creating prototype of child Object(Student) because Object.create() will create a "empty object of Student.prototype" before assigning it to Person.prototype and if we would have created the child object(Student) prototype before "linking" than Student.prototype would have been empty.

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const luke = new Student('Luke', 2000, 'Computer science');
luke.introduce();
console.log(luke.calcAge());

Student.prototype.constructor = Student; // Object.create() sets the prototype of Student = Person.prototype, that's why luke.__proto__ shows Person on the console

console.dir(Student.prototype.constructor);
console.log(luke.__proto__); // In Chrome there is a problem that's why output = Person even after changing "Student.prototype.constructor = Student;" but it works fine firefox.

// prototype chain created after linking prototypes-:
console.log(luke instanceof Student);
console.log(luke instanceof Person);
console.log(luke instanceof Object);

///////////////////////////////////////
// Coding Challenge #3

/* 
1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
2. Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo';
3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉
DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%
GOOD LUCK 😀
*/

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge = `${Number.parseFloat(this.charge) - 1}%`;
  console.log(
    `${this.make} going at ${this.speed}Km/h, with ${this.charge} charge.`
  );
};
// we can also simple number as charge and write it in % in console message.
const tesla = new EV('Tesla', 100, '80%');
tesla.chargeBattery('85%');
console.log(tesla);
tesla.accelerate();
tesla.brake();

// (v.v.imp.) NOTE-: 1st Method in the prototype chain with the same name will be used or "child can override a mehtod inherited from the parent" ex-: in tesla.accelerate(), EV(child) accelerate method was used.

///////////////////////////////////////
// Inheritance Between "Classes": ES6 Classes

// NOTE-: syntax to inherit all the prototypes & parent properties to the child-: "class Child extends Parent"

class Studentcl extends PersonCl {
  constructor(fullName, birthYear, course) {
    // this needs to be first because "super()" is responsible for creating "this keyword for the child Object(StudentCl)", it also automatically calls the parent with "this keyword = child Object(StudentCl)." .
    super(fullName, birthYear);
    this.course = course;
  }
  introduce() {
    console.log(`My name is ${this.fullName} and I study ${this.course}`);
  }
  calcAge() {
    console.log(
      `My name is ${this.fullName} and I am ${
        2021 - this.birthYear
      }years old, but as a student I feel like ${2021 - this.birthYear + 10} `
    );
  }
}

const martha = new Studentcl('Martha Jones', 2000, 'Computer Science');
martha.introduce();
martha.calcAge(); // it will override the calcaAge() in PersonCl(Parent) because child can override inherited methods.
console.log(martha);

// (v.imp.) NOTE-:  we don't have to define any contructor function inside the child class if no new property is created in the child class.
class student2Cl extends PersonCl {}

const lewis = new student2Cl('Hamilton lewis', 2000);
console.log(lewis);

// H.W => Search Functional Programming vs OOP in JavaScript on google and find wether we can use functional programming in place of OOP without loosing performance & effeciency or we can use both of them together for better result.
// https://dev.to/bhaveshdaswani93/oop-vs-fp-with-javascript-39jf

///////////////////////////////////////
// Inheritance Between "Classes": Object.create

// First we create the SudentProto(child prototype) and link all the "Parent prototype methods & properties" to the child prototype.
const StudentProto = Object.create(PersonProto); // we don't write "PersonProto.prototype" Object.create() becasue PersonProto is not a contructor function it is just an  object.

StudentProto.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

StudentProto.init = function (firstName, birthYear, course) {
  PersonProto.init.call(this, firstName, birthYear);
  this.course = course; // The init function in personProto.init.call is the "init function" from personProto not from StudenProto.
};

// Now create instance of child Object which will have all the methods & properties of StudentProto as well as PesonProto(because of the prototype chain). Look at the prototype chain of inheritance using Object.create() in image available in this folder.
const jack = Object.create(StudentProto);
jack.init('Jack', 2010, 'Maths');
jack.calcAge();
jack.introduce();

// Diff. B/W Abstraction & Encapsulation-: Abstraction is used to show only the essential properties to the user. Encapsulation is used to make data private so that other class can't access that data.
// Polymorphism-: A child class can overwrite a method inherited from parent class.

// (v.imp.) NOTE-: New class field proposal in JS is a step towards implementing class behaviour like in some of the OOP languages like JAVA, c++, etc. in the new proposal "classes will be treated as classes in JAVA and they will have the abilities like classes in JAVA has(like private classes)" classes won't no longer be treated as a syntax for contructor function pattern after the new class field proposal.

// Public fields
// private fields
// public methods
// private methods

class Account {
  // 1 a) public fields-: which are added in every instance wether we pass it in to the constructor or not, like locale and movements field.
  locale = navigator.language;

  // 1 b) we can also use static public & private fields by using static before field declaration, static fields are available only on class.

  //  2) private fields-: add # in the start to make a field private.
  #movements = [];
  #pin; // we need to declare pin here because private fields are used before the constructor.

  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.#pin = pin;
    // this._movements = [];
    // this.locale = navigator.language;
  }

  // 3) Public methods or public API-: all the methods inherited by the instance.
  deposit(val) {
    this.#movements.push(val);
    return this;
  }
  getMovements() {
    return this.#movements;
  }
  withdraw(val) {
    this.deposit(-val);
    return this;
  }

  requestLoan(val) {
    if (this._approveLoan()) {
      this.deposit(val);
      console.log('Loan is approved!');
      return this;
    }
  }

  // 4) Private methods-: private methods are not implemented by chrome V8 till now that's why when we use "# before a method chrome consider method as a field"
  // #approveLoan() {
  _approveLoan() {
    return true;
  }
}

/* (v.v.imp.) NOTE-: 1-: For movements array we don't have to pass an empty array while creating the instance, we can directly assign an empty array in the contructor definition.
                     2-: when we don't need a input from the user(like an empty array) than we can use this technique of assigning properties in the constructor definition. */
const acc1 = new Account('jonas', 'EUR', 1111);

// acc1.movements.push(250);
// acc1.movements.push(-105);
// NOTE-: Practically in a banking app we dont't want someone to access the movements(it's like accessing all the transaction in a passbook) array. So defining new method for depodit and withdrawal would be a good practice.
acc1.deposit(250);
acc1.withdraw(50);

// (imp.) Need of data encapsulaion-: anyone can also access the approveLoan() method & pin property which should not be allowed.
console.log(acc1.pin);
acc1.requestLoan(768);
console.log(acc1);

// NOTE-: using "_" before a property is a convention for developers to identify which property should be private, but it doesn't make the properties private.

// chaining methods-: we have returned the object(this keyword) itself in methods so that we can chain methods.
acc1.deposit(790).withdraw(34).deposit(56).requestLoan(7687);
console.log(acc1.getMovements());

// (v.imp.) NOTE-: look at the ES6 classes summary image in this folder and vid-:223

///////////////////////////////////////
// Coding Challenge #4

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. They experiment with chining!
DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%
GOOD LUCK 😀
*/

class EVCl extends CarCl {
  #charge;
  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }
  // public API
  brake() {
    this.speed -= 5;
    return this;
  }

  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    return this;
  }

  accelerate() {
    this.speed += 20;
    this.charge = `${Number.parseFloat(this.charge) - 1}%`;
    console.log(
      `${this.make} going at ${this.speed}Km/h, with a charge of ${
        this.#charge
      }.`
    );
    return this;
  }
}

const tesla2 = new EVCl('Tesla', 120, '87%');
console.log(tesla2);
tesla2.brake().accelerate().chargeBattery('56%').accelerate();
console.log(tesla2.speedUS);
// console.log(tesla2.#charge);
