// BlackJack Script

// Document getters
hitBtn = document.getElementById('bj-hit-btn');
standBtn = document.getElementById('bj-stand-btn');
dealBtn = document.getElementById('bj-deal-btn');

// Functions
let BJGame = {
  "firstPlayer": {
    'scoreSpan': '#firstPlayer-blackjack-result',
    'div': '#firstPlayer-box',
    'score': 0,
  },
  "secondPlayer": {
    'scoreSpan': '#secondPlayer-blackjack-result',
    'div': '#secondPlayer-box',
    'score': 0,
  },
  "cards": ['2','3','4','5','6','7','8','9','10','J','K', 'A','Q'],
  "cardsMap": {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'J': 10,'K': 10, 'A':[1, 11],'Q': 10},
  'wins': 0,
  'draws': 0,
  'losses': 0,
  'isStand': false,
  'completeTurn': false,
}

const theFirstPlayer = BJGame['firstPlayer'];
const theSecondPlayer = BJGame['secondPlayer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const lossSound = new Audio('static/sounds/aww.mp3');
const winSound = new Audio('static/sounds/cash.mp3');

// display the cards
function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    console.log(document.querySelector(activePlayer['div']).appendChild(cardImage));
    hitSound.play();
  }  
}

// randomize the cards
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 15);
  return BJGame['cards'][randomIndex];
}

// The hit function
function bjHit() {
  if (BJGame['isStand'] === false){
    let card = randomCard();
    showCard(card, theFirstPlayer);
    updateScore(card, theFirstPlayer);
    showScore(theFirstPlayer);
  }
}

// the stand function
function bjStand() {
  dealerLogic();
}

// The Deal function
function bjDeal() {
  if (BJGame['completeTurn'] === true) {
    BJGame['isStand'] = false;
    let firstPlayerImages = document.querySelector('#firstPlayer-box').querySelectorAll('img');
    for (let i = 0; i < firstPlayerImages.length; i++) {
      firstPlayerImages[i].remove();
    }

    let secondPlayerImages = document.querySelector('#secondPlayer-box').querySelectorAll('img');
    for(i=0; i<secondPlayerImages.length; i++){
      secondPlayerImages[i].remove();
    }

    theFirstPlayer['score'] = 0;
    theSecondPlayer['score'] = 0;
    document.querySelector('#firstPlayer-blackjack-result').textContent = 0;
    document.querySelector('#firstPlayer-blackjack-result').style.color = 'white';
    document.querySelector('#secondPlayer-blackjack-result').textContent = 0;
    document.querySelector('#secondPlayer-blackjack-result').style.color = 'white';
    
    document.querySelector('#blackjack-result').textContent = "Let's Play";
    document.querySelector('#blackjack-result').style.color = "black";

    BJGame['completeTurn'] = true;
  }
}

// The update score function
function updateScore(card, activePlayer) {
  if (card === 'A') {
    if ((activePlayer['score'] + BJGame['cardsMap'][card][1]) <= 21) {
      activePlayer['score'] += BJGame['cardsMap'][card][1];
    } else {
      activePlayer['score'] += BJGame['cardsMap'][card][0];
    }
  } else {
    activePlayer['score'] += BJGame['cardsMap'][card];
  }
}

// display score function
function showScore(activePlayer) {
  if (activePlayer['score'] <= 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = "OVERBOARD";
    document.querySelector(activePlayer['scoreSpan']).style.color = "red";

  }
}

// Dealer Logic: Second player Version
// function dealerLogic() {
//   BJGame['isStand'] = true;
//   let card = randomCard();
//   showCard(card, theSecondPlayer);
//   updateScore(card, theSecondPlayer);
//   showScore(theSecondPlayer);

//   if (theSecondPlayer['score'] > 15)  {
//     BJGame['completeTurn'] = true;
//     // Display the result
//     showResult(computeWinner());
//   } 
// }

// Dealer Logic: Bot Version
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  BJGame['isStand'] = true;
  while (theSecondPlayer['score']  < 16 && BJGame['isStand'] === true) {
    let card = randomCard();
    showCard(card, theSecondPlayer);
    updateScore(card, theSecondPlayer);
    showScore(theSecondPlayer);
    await sleep(850);
  }

  BJGame['completeTurn'] = true;
  showResult(computeWinner());
}

// compute the result
function computeWinner() {
  let winner;
  if (theFirstPlayer['score'] <= 21) {
    // 1: Higher score than theSecondPlayer, 2. theFirstPlayer score but theSecondPlayer burst
    if ((theFirstPlayer['score'] > theSecondPlayer['score']) || (theSecondPlayer['score'] > 21)) {
      BJGame['wins']++; // incrementing the wins
      winner = theFirstPlayer;
    }
    else if ((theFirstPlayer['score'] < theSecondPlayer['score'])){
      BJGame['losses']++; // incrementing the losses
      winner = theSecondPlayer;
    }
    else if ((theFirstPlayer['score'] == theSecondPlayer['score']) ){
      BJGame['draws']++; // incrementing the draws
    }
  }
  // if I have a burst but theSecondPlayer with less score
  else if (theFirstPlayer['score'] > 21 && theSecondPlayer['score'] <= 21){
    BJGame['losses']++; // incrementing the losses
    winner = theSecondPlayer;
  }

  // Both users GO OVERBOARD
  else {
    BJGame['draws']++; // incrementing the draws
  }
  return winner;
}

// Display the winner at the top: For Playing against bot
function showResult(winner) {
  let message, messageColor;
  if (BJGame['completeTurn'] === true) {
    if (winner === theFirstPlayer) {
      document.querySelector('#wins').textContent = BJGame['wins'];
      message = "First Player Won!";
      messageColor = 'green';
      winSound.play();
    } else if (winner === theSecondPlayer) {
      document.querySelector('#losses').textContent = BJGame['losses'];
      message = "Bot Won!";
      messageColor = 'green';
      lossSound.play();
    } else {
      document.querySelector('#draws').textContent = BJGame['draws'];
      message = 'You Both Drew!';
      messageColor = 'orange';
    }

    // adding it into the html
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
  }
}

// Display the winner at the top: For Playing against second user
function showResult(winner) {
  let message, messageColor;
  if (BJGame['completeTurn'] === true) {
    if (winner === theFirstPlayer) {
      document.querySelector('#wins').textContent = BJGame['wins'];
      message = "First Player Won!";
      messageColor = 'green';
      winSound.play();
    } else if (winner === theSecondPlayer) {
      document.querySelector('#losses').textContent = BJGame['losses'];
      message = "Second Player Won!";
      messageColor = 'green';
      winSound.play();
    } else {
      document.querySelector('#draws').textContent = BJGame['draws'];
      message = 'You Both Drew!';
      messageColor = 'orange';
    }

    // adding it into the html
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
  }
}

// Event Listeners
hitBtn.addEventListener('click', bjHit, false);
standBtn.addEventListener('click', bjStand, false);
dealBtn.addEventListener('click', bjDeal, false);