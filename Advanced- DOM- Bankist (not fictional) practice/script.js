// 'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); // because anchor tag makes the page scroll to where link tag is positioned in html
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(item => {
  item.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// navigation bar fade-out animation

const handler = function (e, opacity) {
  const target = e.target;
  if (target.classList.contains('nav__link')) {
    const siblings = target.closest('.nav').querySelectorAll('.nav__link');
    const logo = target.closest('.nav').querySelector('img');
    siblings.forEach(item => {
      if (item !== target) item.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  handler(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handler(e, 1);
});
//  or we can do this nav.addEventListener('mouseover', handler.bind(0.5)); here this would become 0.5 and 'e' argument won't change and we even don't have to pass it as argument

// Sticky navigation

const header = document.querySelector('.header');
const height = nav.getBoundingClientRect().height;

const sticky = function (entries, observer) {
  const [entry] = entries;
  entry.isIntersecting === false
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(sticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});

headerObserver.observe(header);

// Revealing section
const sections = document.querySelectorAll('.section');

const reveal = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.1,
});

sections.forEach(item => {
  sectionObserver.observe(item);
  item.classList.add('section--hidden');
});

// Lazy loading
const images = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // to "start" loading them 200px before we reach the images
});

images.forEach(img => imgObserver.observe(img));

// Page Navigation

// document
//   .querySelectorAll('.nav__link')
//   .forEach(el => el.addEventListener('click', function () {}));
// Instead of doing this we can attach event listeners whenever it's required by using event delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // because anchor tag makes the page scroll to where link tag is positioned in html without applying smooth scrolling

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// smoooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  const s1coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // this method might not work in every browser
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed Component-:

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.btn'); // we are checking for btn class because there is a <span> inside button which will be selected when we click on it

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabContent.forEach(el => el.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

(function () {
  // slider
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slider = document.querySelector('.slider');
  const dotsContainer = document.querySelector('.dots');

  // slider.style.transform = 'scale(0.3) translateX(-800px)';
  // slider.style.overflow = 'visible';

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(s => s.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // previous slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    createDots();
    activateDots(0);
    goToSlide(0);
  };
  init();

  // Event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  dotsContainer.addEventListener('click', function (e) {
    const target = e.target;
    const { slide } = e.target.dataset;

    if (target.classList.contains('dots__dot')) {
      goToSlide(slide);
      activateDots(slide);
    }
  });
})();

///////////// LECTURES ///////////////

/*

// Creating and inserting elements
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

///////////////////////////////////////
// Styles, Attributes and Classes

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(message.style.color);
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

*/

/*
// Event Bubbling
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(
    0,
    255
  )},${randomInt(0, 255)})`;

console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
// To see the effect on all three of them click on the element who is child to other 2 element because bubbling happens from child to parent all the way upto root element
*/

/*
// DOM Traversing
const h1 = document.querySelector('h1');

// Going Downwards-:
console.log(h1.querySelectorAll('.highlight')); // we can also use querySelector on elements
console.log(h1.childNodes); //  all the nodes returns a nodelist
console.log(h1.children); // only direct children returns a HTML collection
h1.firstElementChild.style.color = 'white';
console.log(h1.lastElementChild);

// window.onbeforeunload = () => window.scrollTo(0, 0); // to move the page to top on reload

// Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
// Closest() is opposite of querySelector() it finds the parent, whereas querySelector() finds the children

// Going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextSibling);
// with these 2 we can only access previous and next sibling

console.log(h1.parentElement.children); // to access the all the sibling but it will include the "h1"
*/

// function f(x) {
//   x += 1;
// }

// function g(x) {
//   x.value *= 5;
// }
// var a;
// var b = 1;
// var c = { value: 2 };
// var d = c;

// f(a);
// f(b);
// g(d);
// console.log(a, b, c.value, d.value);

// function foo(a, b, c) {
//   a++;
//   b = 'new';
//   c['key'] = 'new';
// }

// var a = 1;
// var b = 'old';
// var c = { key: 'old' };

// foo(a, b, c);
// console.log(a, b, c);

// NOTE-: use the concept of passing the reference(value) in javascript to solve the above 2 questions
