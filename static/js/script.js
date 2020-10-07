// Challenge 5: BlackJack

let blackJackGame = {
  "you": {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
  "dealer": {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
  "cards": ['2','3','4','5','6','7','8','9','10','J','K', 'A','Q'],
  "cardsMap": {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'J': 10,'K': 10, 'A':[1, 11],'Q': 10},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'turnsOver': false,
};

const YOU = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const lossSound = new Audio('static/sounds/aww.mp3');
const winSound = new Audio('static/sounds/cash.mp3');


function showCard(card, activePlayer) {
  // To show the burst if player's score is > 21
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
  cardImage.src = `static/images/${card}.png`;
  document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitSound.play();
  }
  
  
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame['cards'][randomIndex];
}

function blackJackHit(){
  if (blackJackGame['isStand'] === false) {
    let card = randomCard();
  showCard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
  }
  
}

// The stand button function
function blackJackStand(){
  dealerLogic();
}

function blackJackDeal(){
  if (blackJackGame['turnsOver'] === true) {

    blackJackGame['isStand'] = false;

    // Remove all the images in dealer's box
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    for(i=0; i<yourImages.length; i++){
      yourImages[i].remove();
    }
    
    // Remove all the images in dealer's box
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for(i=0; i<dealerImages.length; i++){
      dealerImages[i].remove();
    }

    // Resets the score back to zero
    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = '#ffffff';
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's Play";
    document.querySelector('#blackjack-result').style.color = "black";

    blackJackGame['turnsOver'] = true; // helps us restart the game 
  }

}

function updateScore(card, activePlayer) {
  // For Ace, if adding 11 is above 21, use 1, else add 1
  if (card === 'A'){
    
    if((activePlayer['score'] + blackJackGame['cardsMap'][card][1]) <= 21) {
      // update the score
      activePlayer['score'] += blackJackGame['cardsMap'][card][1]; // this adds eleven
    } else {
      // update the score
      activePlayer['score'] += blackJackGame['cardsMap'][card][0];
    }
  }
  else {
    // update the score
     activePlayer['score'] += blackJackGame['cardsMap'][card];
  }
  
  // [card] is the key
}

function showScore(activePlayer) {
  if (activePlayer['score'] <= 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  } else{
    document.querySelector(activePlayer['scoreSpan']).textContent = "BUST";
    document.querySelector(activePlayer['scoreSpan']).style.color = "red";
  }
}


// The dealer's logic: Second player version
// function dealerLogic() {
//   blackJackGame['isStand'] = true;
//   let card = randomCard();
//   showCard(card, DEALER);
//   updateScore(card, DEALER);
//   showScore(DEALER);

//   if (DEALER['score'] > 15)  {
//     blackJackGame['turnsOver'] = true;
//     // Display the result
//     showResult(computeWinner());
//   }
  
// }

// Dealer's Logic: Bot version
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackJackGame['isStand'] = true;

  while (DEALER['score'] < 16 && blackJackGame['isStand'] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackJackGame['turnsOver'] = true;
  // Display the result
  showResult(computeWinner());
}


// Compute winner, update the wins, draws and losses of you and return who won
function computeWinner() {
  let winner;
  if (YOU['score'] <= 21) {
    // 1: Higher score than dealer, 2. your score but dealer burst
    if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
      blackJackGame['wins']++; // incrementing the wins
      winner = YOU;
    }
    else if ((YOU['score'] < DEALER['score'])){
      blackJackGame['losses']++; // incrementing the losses
      winner = DEALER;
    }
    else if ((YOU['score'] == DEALER['score']) ){
      blackJackGame['draws']++; // incrementing the draws
    }
  }
  // if I have a burst but dealer with less score
  else if (YOU['score'] > 21 && DEALER['score'] <= 21){
    blackJackGame['losses']++; // incrementing the losses
    winner = DEALER;
  }

  // Both users bust
  else {
    blackJackGame['draws']++; // incrementing the draws
  }

  console.log('Winner is: ', winner);
  console.log(blackJackGame);
  return winner;
}

// Display the winner at the top
function showResult(winner) {
  let message, messageColor;

  if (blackJackGame['turnsOver'] === true) {
    if (winner === YOU){
      document.querySelector('#wins').textContent = blackJackGame['wins'];
      message = "You Won!";
      messageColor = 'green';
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector('#losses').textContent = blackJackGame['losses'];
      message = 'You Lost!';
      messageColor = 'red';
      lossSound.play();
    } else {
      document.querySelector('#draws').textContent = blackJackGame['draws'];
      message = 'You Both Drew!';
      messageColor = 'orange';
    }

    // adding it into the html
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
  }

  
}

hitButton = document.getElementById('blackjack-hit-button');
hitButton.addEventListener('click', blackJackHit, false);

standButton = document.getElementById('blackjack-stand-button');
standButton.addEventListener('click', blackJackStand, false);

dealButton = document.getElementById('blackjack-deal-button');
dealButton.addEventListener('click', blackJackDeal, false);