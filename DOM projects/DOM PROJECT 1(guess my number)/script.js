'use strict';
// const guess = Number(document.querySelector('.guess').value); // since we can only get the input once the check button is pressed that's the value will always be zero "if guess is declared outside the event listener"
const highScore = document.querySelector('.highscore');
const currScore = document.querySelector('.score');
const checkBtn = document.querySelector('.check');
const message = document.querySelector('.message');
const againBtn = document.querySelector('.again');

// const target = 12;
let target = Math.floor(Math.random() * 20) + 1;
let currScoreVar = 20;
let highScoreVar = 0;

checkBtn.addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    message.textContent = '⛔ No number!';
  }
  // when player wins
  else if (guess === target) {
    message.textContent = '🍾 Correct Number!';
    document.querySelector('.number').textContent = target;
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('body').style.backgroundColor = '#60b347';

    // current score > highscore
    if (currScoreVar > highScoreVar) {
      highScoreVar = currScoreVar;
      highScore.textContent = currScoreVar;
    }
  }

  // when guess is incorrect
  else if (guess !== target) {
    if (currScoreVar > 1) {
      message.textContent = guess > target ? '📈 Too high!' : '📉 Too low!';
      currScoreVar--;
      currScore.textContent = currScoreVar;
    } else {
      message.textContent = '🥲 You lost the game!'; // when all the tries are exhausted and current score is already 0
      currScore.textContent = 0;
    }
  }
  // display highScore
  // highScore.textContent = highScoreVar;
});

againBtn.addEventListener('click', function () {
  target = Math.floor(Math.random() * 20) + 1; // declared again because we want a different random number because this is a new game and since this event handler fucntion has it's own scope that's why this random number(target) will be different then the one that is declared on top.
  currScoreVar = 20;

  message.textContent = 'Start guessing...';
  document.querySelector('.number').textContent = '?';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('body').style.backgroundColor = '#222';

  currScore.textContent = currScoreVar;
  document.querySelector('.guess').value = '';
});
