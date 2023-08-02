/*
GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

var scores, roundScore, active, gameplaying, prevRoundScore;

init(); // because of hoisting we can call this function here and define it later.

document.querySelector('.btn-roll').addEventListener('click', function () {
  // 1-:to generate a random number
  if (gameplaying) {
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    // 2-:to display it on screen

    document.getElementById('dice-1').style.display = 'block';
    document.getElementById('dice-2').style.display = 'block';
    document
      .getElementById('dice-1')
      .setAttribute('src', 'dice-' + dice1 + '.png');
    document
      .getElementById('dice-2')
      .setAttribute('src', 'dice-' + dice2 + '.png');

    // 3-: update the roundScore if the dice no. is not 1

    if (dice1 !== 1 && dice2 !== 1) {
      roundScore += dice1 + dice2;
      document.querySelector('#current-' + active).textContent = roundScore;
    } else {
      // next player
      nextPlayer();
    }

    /* if(prevRoundScore===6 && dice===6) {
        scores[active] = 0;
        document.querySelector('#score-' + active).textContent = scores[active];
        nextPlayer();
    }
    else if(dice !==1) {
        roundScore = roundScore + dice;   
        document.querySelector('#current-' + active).textContent = roundScore;
      }  else {
            // next player
             nextPlayer();        
            }
           prevRoundScore = dice;
       }  */
  }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
  // since, we are using roundScore to update the current score. So, it is not possible/appropriate to use the same variable to upadte global score
  // for both players, instead of that we can use the 'scores' array.

  // add current score to global score
  if (gameplaying) {
    scores[active] += roundScore;

    // update the UI
    document.querySelector('#score-' + active).textContent = scores[active];

    var input = document.querySelector('.Score-goal').value; // it will get the value entered in the input typebox
    // because 'JS' type cohesion-: 0, undefined, null or ""(empty string) are cohersed to false
    // and anythinxg else is cohersed to true
    var winningScore;
    if (input) {
      winningScore = input;
    } else {
      // if no value is entered
      winningScore = 100;
    }

    if (scores[active] >= winningScore) {
      document.getElementById('name-' + active).textContent = 'Winner';
      hideDice();
      document
        .querySelector('.player-' + active + '-panel')
        .classList.add('winner');
      document
        .querySelector('.player-' + active + '-panel')
        .classList.remove('active'); // we hve added 'winner' class and removed 'active'
      // class cause we want to remove the 'dot'  ahead of the player name(as it represents th active player).
      gameplaying = false;
    } else {
      // next player
      nextPlayer();
    }
  }
});

function nextPlayer() {
  active === 0 ? (active = 1) : (active = 0);
  roundScore = 0;

  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  hideDice(); // this step is to hide the dice when dice=1 & when the player is switched and
  // previous no. on  is should be hidden or disappear for the next player.
}

// after a winner is decided-: creating the 'new game'
document.querySelector('.btn-new').addEventListener('click', init);

// to create a new game we have to set most of the variables to '0' which is already been done in the starting.So, following the 'DRY'
// (don't repeat yourself) principle a function  is needed-:

function init() {
  scores = [0, 0];
  gameplaying = true;
  roundScore = 0;
  active = 0; // to know which player is playing
  prevRoundScore = 0;

  hideDice();

  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');

  document.querySelector('.player-1-panel').classList.remove('active'); // we are removing .active classes from player-1 box, cause to make
  // sure that when a new game is started it always started from player-1.
  document.querySelector('.player-0-panel').classList.add('active');
}

function hideDice() {
  document.getElementById('dice-1').style.display = 'none';
  document.getElementById('dice-2').style.display = 'none';
}
