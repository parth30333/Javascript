('use script');

// selecting elements-:
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const dice = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

// manipulating elments-:
score0El.textContent = 0;
score1El.textContent = 0;
dice.classList.add('hidden');

let currentScore, totalScore, active, playing;

// functions-:
const switchPlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

const init = function () {
  currentScore = 0;
  activePlayer = 0;
  totalScore = [0, 0];
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
};
init();

// Event Listeners-:

btnRoll.addEventListener('click', function () {
  if (playing) {
    if (dice.classList.contains('hidden')) dice.classList.remove('hidden');
    const random = Math.trunc(Math.random() * 6 + 1);
    dice.src = `dice-${random}.png`;

    // if random  === 1 change the player
    if (random !== 1) {
      currentScore += random;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    totalScore[activePlayer] += currentScore;
    if (totalScore[activePlayer] >= 20) {
      playing = false;

      dice.classList.add('hidden');

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');

      document.getElementById(`name--${activePlayer}`).textContent =
        'Winner 🎉🎉';
    } else {
      // add current score to the active player total score;
      document.getElementById(`score--${activePlayer}`).textContent =
        totalScore[activePlayer];

      // switching to the next player
      switchPlayer();
    }
  }
});

document.querySelector('.btn--new').addEventListener('click', function () {
  document.getElementById(
    `name--${activePlayer}`
  ).textContent = `Player ${activePlayer}`;
  init();
});

// we could also have used window.location.reload();
// NOTE-:  Use diagram.net to create a flow chart of a project.
