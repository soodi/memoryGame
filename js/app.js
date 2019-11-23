/*
 * Create a list that holds all of your cards
 */

function createList(){
    const list=['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt',
                'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
    return list;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
const cards = document.querySelector('.deck');
cards.addEventListener('click', function(evt){
    if(evt.target.nodeName === 'LI')
    clickTheCard(evt);
});

const reset = document.querySelector('.restart');
reset.addEventListener('click', restartGame, true);

const playBtn = document.querySelector('.play-again');
playBtn.addEventListener('click', playAgain, true);


let openCardList='';
let moveCounter = 0;
let timer, seconds;

setTimer();

/*
 * Add to timer counter every second
 */
function setTimer(){
    seconds = 0;   
    timer = setInterval(function(){
    seconds++;
    generateTime(seconds);
}, 1000);
}
/*
 * Displays the time in page
 */

function generateTime(sec)
{
    document.querySelector('.seconds').innerHTML = sec;
}

/*
 * Add Card to the list of Open Cards
 * if the cards are the same lock their position 
 * if the cards are not match, remove them from open cards list and hide them
 */

function clickTheCard(evt){
    displayCardSymbol(evt);
    if (openCardList.length == 0){
        addCardToOpenCardList(evt);
    }
    else {
        let elem = evt.target.children;
        if (elem[0].classList.contains(openCardList[1])){
            lockTheSameCardPosition(evt);
                let matchedCard = document.querySelectorAll('.match');
                if (matchedCard.length === 16)
                    openModal();
        }
        else
            hideCards(evt);
        incrementMoveCounter();
    }
}

/*
 * Display card symbol
 */

function displayCardSymbol(evt){
    evt.target.classList.add('show','open','stop-event');
}

/*
 * Add card to open card list
 */

function addCardToOpenCardList(evt){
    let elem = evt.target.children;
    openCardList = elem[0].classList;
}

/*
 * If the cards are the same, locks their position
 */

function lockTheSameCardPosition (evt){
    evt.target.classList.add('match');
    evt.target.classList.remove('show','open');

    let element = document.getElementsByClassName('open');
    element[0].classList.add('match');
    element[0].classList.remove('show','open');
    openCardList = '';
}

/*
 * If the cards are the not the same, hides their position
 */ 
function hideCards(evt){
    evt.target.classList.remove('show','open');
    evt.target.classList.add('lock');
    let elements = document.getElementsByClassName('show');
    elements[0].classList.add('lock');

    // wait half of the second to see the red cards
    setTimeout(function(){ 
        let elements = document.getElementsByClassName('lock');
        evt.target.classList.remove('show', 'open','lock','stop-event');
        elements[0].classList.remove('show', 'open','lock','stop-event');
     }, 500);
     openCardList = '';
}

/*
 * Increment move counter turns off one of the starts after every 7 moves until there is just one full start left
 */

function incrementMoveCounter(){
    document.querySelector('.moves').innerHTML = ++moveCounter;
    let result = moveCounter % 7;
    if (result === 0 && Math.floor(moveCounter/7) < 3){
        let fullStarts = document.querySelectorAll('.fa-star');
        fullStarts[fullStarts.length - 1].classList.remove('fa-star');
        fullStarts[fullStarts.length - 1].classList.add('fa-star-o');
    }
}

/*
 * Reset move counter
 */

function resetMoveCounter(){
    document.querySelector('.moves').innerHTML = 0;
    moveCounter = 0;
}

/*
 * Reset the game to the what was in the begining
 */

function restartGame(){
    let matchedCard = document.querySelectorAll('.match');
    let cards = document.querySelectorAll('.card .fa');
    let openCard = document.querySelector('.open');

    let cardList = shuffle(createList());

    for (let i=0; i<cardList.length; ++i){
        cards[i].classList.remove(cards[i].classList.item(1));
        cards[i].classList.add(cardList[i]);
    }
    for (let i=0; i<matchedCard.length; ++i){
        matchedCard[i].classList.remove('stop-event', 'match');
    }
    if (openCard){
        openCard.classList.remove('show', 'open','stop-event');
        openCardList = '';
    }

    let fullStarts = document.querySelectorAll('.fa-star-o');
    for (let elem of fullStarts){
        elem.classList.remove('fa-star-o');
        elem.classList.add('fa-star'); 
    }
    resetMoveCounter();
    clearInterval(timer);
    generateTime(0);
    setTimer();
}

/*
 * Opens modal
 */
function openModal(){
    let modal = document.querySelector('.modal');
    modal.style.display = 'block';
    document.querySelector('.total-time').innerHTML = seconds;
    document.querySelector('.total-moves').innerHTML = moveCounter;
    let remainingStars = document.querySelectorAll('.fa-star');
    document.querySelector('.total-stars').innerHTML = remainingStars.length;
}

/*
 * Closes the modal and resets the game
 */
function playAgain(){
    let modal = document.querySelector('.modal');
    modal.style.display = 'none';
    restartGame();    
}
