/*
File: script.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on December 16, 2020 at 10:51pm
Description: This file contains the data structure for the tiles, as well as both
drag/drop and updating the board/score.
*/


// Source variables for following functions
let letter_array = [];
let currentsrc = "";
let imgsrc = "a";
let dropElem;
let adjacentTiles = false;
let prev, next;
let dragged = false;
let dropped = true;
let userScore = 0;
let currentWord = 0;
let doubleWord = 0;

store_letters();
const newLetters = JSON.parse(letters)
store_letter_array();

const score = document.querySelector(".score")
const rackBox = document.querySelectorAll(".rack > .empty")
const clearBoardTiles = document.querySelectorAll(".letter")

function SubmitWord() {
  const sbmWord = document.querySelector(".subWord")
  const totalScore = document.querySelector(".totalScore")
  currentWord = currentWord + userScore;
  totalScore.textContent = currentWord;
  stockRack()
  clearErrorLog();
//})
}


// main drag and drop calls
setInterval(() => {
  let generate = document.querySelectorAll(".generate");
  generate.forEach(tile => {
    tile.addEventListener("dragstart", drag_begin);
    tile.addEventListener("dragend", drag_done);
  });

  // select all the boxes 
  const empty = document.querySelectorAll(".empty");
  empty.forEach(slot => {
    slot.addEventListener("dragover", drag_check);
    slot.addEventListener("dragleave", drag_save);
    slot.addEventListener("drop", dropTile);
  });

}, 100);

// checks when the user starts dragging image
function drag_begin(){
  currentsrc = this.children[0].src;
  // gets the dropElem so if the drag wasnt successful then undo the img
  dropElem = this.parentElement;
  // remove the element once moved after small delay
  setTimeout(()=> (dropElem.textContent = ""), 0);
}

// when the user lets go of the img
function drag_done(){
  this.classList.add("generate")
  if(dropped == false || dragged == false){
    if(dropElem.classList.contains("letter"))
      errorLog("BadDrag")
    else
      errorLog("Invalid")
    newImg(dropElem)
  }
}

// listens for when the img is on this particular box
function drag_check(e){
  // prevent the default behaviour of dragover otherwise dropTile() wouldnt work
  e.preventDefault();
  dragged = true;
}

// checks when img leaves the div
function drag_save(){
  // if the image is dragged out of the box then set it to false so it doesnt make the img disappear
  dragged = false;
}

// checks when img is dropped in the div
function dropTile(){
  const checkSib = document.querySelectorAll(".letter")
  adjacentTiles = [...checkSib].some(getSiblings)

  // check for spaces and to make sure its placed next to existing tile
  if(!this.classList.contains("first")
   && this.classList.contains("letter"))
    prev = this.previousSibling.previousSibling.childNodes.length;
 
  if(!this.classList.contains("last")
   && this.classList.contains("letter"))
    next = this.nextSibling.nextSibling.childNodes.length;
  
  // took the rest of the function out to make it more readable
  moveTiles(this)
}

function moveTiles(elem){
  // if the box already contains img then dont add
  if(elem.childNodes.length >= 1 && dragged === true ){
    dropped = false;
    dragged = false;
    errorLog("TileExists")
    return;
  }
  //  once the tile has been placed. it should not be moved around
  if(dropElem.classList.contains("undraggable")){
    dropped = false;
    dragged = false;
    errorLog("BadDrag")
    return;
  }

  // check if the dropped box is the same box not the rack, if so take the value of the word
  if(elem.classList.contains("letter") && (prev == 1 || next == 1 || adjacentTiles == false)){
    clearErrorLog()
    newImg(elem);
    // to prevent it from moving again in the future
    elem.classList.add("undraggable")
    
    adjacentTiles == true

    // get the letter value from the img src
    imgsrc = currentsrc.substring(currentsrc.indexOf("img/") + 4, currentsrc.indexOf(".jpg"));
    updateUserScore(imgsrc, elem)
  } 

  // if the user moves the tiles in the rack
  else if(elem.classList.contains("rLetter"))
    newImg(elem);

  // if it wasnt a valid play and it was not the rack then reset the letter
  else{
    dropped = false;
    dragged = false;
    newImg(dropElem);
    errorLog("NoSiblings")
  }
  // if drag was successful
  dropped = true;
  dragged = true;
}

// checks if siblings exist for the game board 
function getSiblings(elem){
  if(elem.childNodes.length == 1)
    return true;
  return false;
} 

stockRack()
// get random images each time page loads
function stockRack(){
  // goes thru the whole rack and restocks any img thats missing from the rack
  rackBox.forEach(box => {
    
    const index = Math.floor(Math.random() * letter_array.length)
    const randIndexValue = letter_array[index]
    
    // add img on the rack 
    if(box.children[0] == undefined && randIndexValue != undefined && !(letter_array.length <= 0)){
      newImg(box, randIndexValue)
    
      // take the words out/pop of the array once they are given to the user
      letter_array.splice(index, 1);

      // update the remaining letters for the user
      document.querySelector(".tilesLeft").textContent = letter_array.length;
    } 
    
    // checks if the game is done
    const endGame = [...rackBox].some(checkEndGame)
    if(randIndexValue == undefined && letter_array.length <= 0 && endGame == false)
      errorLog("GameOver")

  });

  // clear the board if user submits the word
  clearBoardTiles.forEach(element => {
    if(element.childElementCount >= 0){
      element.innerHTML = ""
      userScore = 0;
      score.innerHTML = userScore
    }
  });
}

// Creating New div and placing New Image inside
function newImg(box, img = currentsrc){
  // every time the block is moved, it makes a new img and deletes the old one
  const newDiv = document.createElement("div")
  const newImg = document.createElement("img")
  
  newDiv.classList.add("generate")
  newDiv.setAttribute('draggable', true);

  newImg.src = img;

  newDiv.append(newImg)
  box.append(newDiv)
}

function updateUserScore(letter, element){

  for(let i = 0; i < newLetters.pieces.length; i++){
    // get the letter from the JSON file
    if(newLetters.pieces[i].letter === letter.toUpperCase()){
      // if the tile has not been moved from original spot, then dont add score
      if(element == dropElem)
       return;
      if(element.classList.contains("doubleWord")) 
      {
        userScore = userScore * 2 + newLetters.pieces[i].value * 2;
        doubleWord = 1;
      }
      // if the selected letter is placed on doubleLetter and the word is doubled, quadruple the value of the new piece
      else if(element.classList.contains("doubleLetter") && (doubleWord == 1))
        userScore = userScore + (newLetters.pieces[i].value * 4);
      // if the selected letter is placed on a doubleLetter or has double word value, double the new tile value
      else if(element.classList.contains("doubleLetter") || (doubleWord == 1))
        userScore = userScore + (newLetters.pieces[i].value * 2);
      // else if its just a regular box, then only add the original value
      else if(!element.classList.contains("doubleLetter")
       && (!element.classList.contains("doubleWord")) 
       && element.classList.contains("letter"))
        userScore = userScore + newLetters.pieces[i].value;
      // update the score for the user
      score.textContent = userScore;
    }
  }
  doubleWord = 0;
}

// checks if the game is over
function checkEndGame(elem){
  if(elem.childElementCount == 1){
    return true;
  }
  return false;
}

function store_letters() {
  // JSON object of letter data
letters = `{"pieces": [
    {"letter":"A", "value":1,  "amount":9},
    {"letter":"B", "value":3,  "amount":2},
    {"letter":"C", "value":3,  "amount":2},
    {"letter":"D", "value":2,  "amount":4},
    {"letter":"E", "value":1,  "amount":12},
    {"letter":"F", "value":4,  "amount":2},
    {"letter":"G", "value":2,  "amount":3},
    {"letter":"H", "value":4,  "amount":2},
    {"letter":"I", "value":1,  "amount":9},
    {"letter":"J", "value":8,  "amount":1},
    {"letter":"K", "value":5,  "amount":1},
    {"letter":"L", "value":1,  "amount":4},
    {"letter":"M", "value":3,  "amount":2},
    {"letter":"N", "value":1,  "amount":6},
    {"letter":"O", "value":1,  "amount":8},
    {"letter":"P", "value":3,  "amount":2},
    {"letter":"Q", "value":10, "amount":1},
    {"letter":"R", "value":1,  "amount":6},
    {"letter":"S", "value":1,  "amount":4},
    {"letter":"T", "value":1,  "amount":6},
    {"letter":"U", "value":1,  "amount":4},
    {"letter":"V", "value":4,  "amount":2},
    {"letter":"W", "value":4,  "amount":2},
    {"letter":"X", "value":8,  "amount":1},
    {"letter":"Y", "value":4,  "amount":2},
    {"letter":"Z", "value":10, "amount":1}
  ]
}`
}

function store_letter_array() {
// go thru the json and get each "letter" into new array (reflecting amount per letter)
for(let i = 0; i < newLetters.pieces.length; i++){
  for(let j = 0; j < newLetters.pieces[i].amount; j++)
    letter_array.push(`img/${newLetters.pieces[i].letter}.jpg`)
}
}