//pull 6 images from Dog API
//https://dog.ceo/api/breeds/image/random


document.getElementById("newGame").addEventListener("click", startGame);//start game function
document.getElementById('return').addEventListener('click', backToStart);


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let counter = 0;
let wrong = 0;
let numCards = 12;

function startGame() {
  document.getElementById("start").style.display = "none";
  document.getElementById("cards").style.display = "flex";
  document.getElementById('return').style.display = 'inline';
}

function backToStart() {
  document.getElementById("start").style.display = "";
  document.getElementById("cards").style.display = "none";
  document.getElementById('return').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

reset();

function flipCard() {

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  if (!hasFlippedCard) {
    //first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  } else {
    //second click
    hasFlippedCard = false;
    secondCard = this;

    // check if the cards match
    checkForMatch();

  }
}


function checkForMatch() {
  let isMatch = firstCard.getAttribute('name') === secondCard.getAttribute('name');
  //it matches 

  isMatch ? disableCards() : unflipCards();
  //add the score
  if (isMatch === true) {
    counter++;
    if (counter === (numCards / 2)) {
      document.getElementById('overlay').style.display = "block";
      document.getElementById('wrong').innerHTML = ' ' + wrong + ' ';

    }


  } else {
    wrong++;
  }
}


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
}

function unflipCards() {
  lockBoard = true;
  // not match
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    lockBoard = false;
    resetBoard();
  }, 1500);
}


function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function reset() {

  let addCards = '';

  let radios = document.getElementsByName('difficulty');

  for (let i = 0; i < 3; i++) {

    if (radios[i].checked) {

      numCards = 12 + (6 * i);

    }

  }

  for (let i = 0; i < (numCards / 2); i++) {

    addCards += `<div name="dog` + i + `" class="memory-card">
      <img class="front-face" alt="" />
      <img class="back-face" alt="/" />
    	</div>`;

    addCards += `<div name="dog` + i + `" class="memory-card">
      <img class="front-face" alt="" />
      <img class="back-face" alt="/" />
    	</div>`;

    

  }

  document.getElementById('cards').innerHTML = addCards;


  document.getElementById('overlay').style.display = "none";

  let dogUrl = [];

  for (let i = 0; i < numCards / 2; i++) {
    $.ajax({
      url: 'https://dog.ceo/api/breeds/image/random',
      type: 'GET',
      async: false,
      success: function (result, status, xhr) {

        dogUrl[i] = result.message;
       

      }

    });
  }

 

  for (let i = 0; i < numCards; i++) {

    //0 is front face, 1 is backface
    if (i % 2 == 0) {//for every even number (0-1, 2-3, 4-5, 6-7, 8-9, 10-11)
      document.getElementById('cards').children[i].children[0].src = dogUrl[i / 2];
      document.getElementById('cards').children[i + 1].children[0].src = dogUrl[i / 2];
    }
    //document.getEBYID('cards') gets the "cards" div
    //calling .children on that gives the "memory-cards" children of the above
    //calling .children on that gives the "front-face"/"back-face" children of the above
    document.getElementById('cards').children[i].children[1].src = "https://i.imgur.com/UzpkhiC.jpg";

  }



  //1) reset counter to 0
  //2), re-shuffle the board
  //3), remove the class "flip" from all the cards
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null, secondCard = null;
  counter = 0;
  wrong = 0;

  document.getElementById('score-box').innerHTML = '';

  

  for (let i = 0; i < numCards; i++) {

    document.getElementById('cards').children[i].classList.remove('flip');

  }

  setTimeout(function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * numCards);
      card.style.order = randomPos;
    });
  }, 1000);
  let cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => card.addEventListener('click', flipCard));
}

document.getElementById('newGame').addEventListener('click', reset);

