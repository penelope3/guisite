/*
File: script.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on December 17, 2020 at 11:40am
Description: This file contains the data structure for the tiles, as well as both
drag/drop and updating the board/score.
*/


// Source variables for following functions
// for image-value getting
let letter_array = [];
let currentsrc = "";
let imgsrc = "a";
// for drag/drop events
let dragged = false;
let dropped = true;
let dropElem;
let adjacentTiles = false;
let prev, next;
// for updating score
let userScore = 0;
let currentWord = 0;
let doubleWord = 0;
let newLetters;

// set up letters with values
store_letters();
store_letter_array();

const score = document.querySelector(".score")
const emptyRack = document.querySelectorAll(".rack > .empty")
const clearBoardTiles = document.querySelectorAll(".letter")

// fill rack with letter tiles
fillRack()

// gets new current score and adds to total score
function SubmitWord() {
  const sbmWord = document.querySelector(".subWord")
  const totalScore = document.querySelector(".totalScore")
  currentWord = currentWord + userScore;
  totalScore.textContent = currentWord;
  //clear doubleWord status after submitting to prevent future math mistakes
  doubleWord = 0;
  fillRack()
  clearErrorLog();
//})
}


// DRAG and DROP modeled from https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
// this method uses js on any specified HTML element, and combined with drop event, will allow
// the dropping necessary for the assignment
// main drag and drop calls
setInterval(() => {
  let generate = document.querySelectorAll(".generate");
  generate.forEach(tile => {
    tile.addEventListener("dragstart", drag_begin);
    tile.addEventListener("dragend", drag_done);
  });

  const empty = document.querySelectorAll(".empty");
  empty.forEach(slot => {
    slot.addEventListener("dragover", drag_check);
    slot.addEventListener("dragleave", drag_save);
    slot.addEventListener("drop", dropTile);
  });

});

// checks when the user starts dragging image
function drag_begin(){
  currentsrc = this.children[0].src;
  dropElem = this.parentElement;
  setTimeout(()=> (dropElem.textContent = ""), 0);
}

// checks when the user lets go
function drag_done(){
  this.classList.add("generate")
  if(dropped == false || dragged == false){
    if(dropElem.classList.contains("letter"))
      errorLog("BadDrag")
    else
      errorLog("Invalid")
    generateTile(dropElem)
  }
}

// checks if image is on the droppable box (board tile)
function drag_check(e){
  e.preventDefault();
  dragged = true;
}

// makes sure tile doesn't disappear
function drag_save(){
  dragged = false;
}

// drops image onto board
function dropTile(){
  const checkSib = document.querySelectorAll(".letter")
  adjacentTiles = [...checkSib].some(checkAdjacent)

  // makes sure tile is placed on existing tile, next to an already placed tile
  if(!this.classList.contains("first")
   && this.classList.contains("letter"))
    prev = this.previousSibling.previousSibling.childNodes.length;
 
  if(!this.classList.contains("last")
   && this.classList.contains("letter"))
    next = this.nextSibling.nextSibling.childNodes.length;

  moveTiles(this)
}

function moveTiles(elem){
  if(elem.childNodes.length >= 1 && dragged === true ){
    dropped = false;
    dragged = false;
    errorLog("TileExists")
    return;
  }
  // required case of don't drag a placed tile
  if(dropElem.classList.contains("undraggable")){
    dropped = false;
    dragged = false;
    errorLog("BadDrag")
    return;
  }

  // check if the board tile is the same div not the rack
  if(elem.classList.contains("letter") && (prev == 1 || next == 1 || adjacentTiles == false)){
    clearErrorLog()
    generateTile(elem);
    elem.classList.add("undraggable")
    adjacentTiles == true

    // get the letter value and update the score element
    imgsrc = currentsrc.substring(currentsrc.indexOf("img/") + 4, currentsrc.indexOf(".jpg"));
    getNewScore(imgsrc, elem)
  } 
  else if(elem.classList.contains("rLetter"))
    generateTile(elem);
  // reset letter if invalid
  else{
    dropped = false;
    dragged = false;
    generateTile(dropElem);
    errorLog("NoAdjacent")
  }
  // if drag was successful
  dropped = true;
  dragged = true;
}

// checks if tiles next to the chosen drop exist for the game board 
function checkAdjacent(elem){
  if(elem.childNodes.length == 1)
    return true;
  else
    return false;
} 

// get random tiles each time page loads
function fillRack(){
  // goes thru the whole rack and restocks any img thats missing from the rack
  emptyRack.forEach(emptytile => {
    
    const index = Math.floor(Math.random() * letter_array.length)
    const randIndexValue = letter_array[index]
    
    // add img on the rack 
    if(emptytile.children[0] == undefined && randIndexValue != undefined && !(letter_array.length <= 0)){
      generateTile(emptytile, randIndexValue)
      // take the words out/pop of the array once they are given to the user
      letter_array.splice(index, 1);
      // update the remaining letters for the user
      document.querySelector(".tilesLeft").textContent = letter_array.length;
    } 
    // checks if the game is done
    const endGame = [...emptyRack].some(checkEndGame)
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
function generateTile(emptytile, img = currentsrc){
  // every time the block is moved, it makes a new img and deletes the old one
  const newDiv = document.createElement("div")
  const newImg = document.createElement("img")
  
  newDiv.classList.add("generate")
  newDiv.setAttribute('draggable', true);

  newImg.src = img;

  newDiv.append(newImg)
  emptytile.append(newDiv)
}

function getNewScore(letter, element){

  for(let i = 0; i < newLetters.tiles.length; i++){
    // get the letter from the JSON file
    if(newLetters.tiles[i].letter === letter.toUpperCase()){
      // if the tile has not been moved from original spot, then dont add score
      if(element == dropElem)
       return;
      if(element.classList.contains("doubleWord")) 
      {
        userScore = userScore * 2 + newLetters.tiles[i].value * 2;
        doubleWord = 1;
      }
      // if the selected letter is placed on doubleLetter and the word is doubled, quadruple the value of the new piece
      else if(element.classList.contains("doubleLetter") && (doubleWord == 1))
        userScore = userScore + (newLetters.tiles[i].value * 4);
      // if the selected letter is placed on a doubleLetter or has double word value, double the new tile value
      else if(element.classList.contains("doubleLetter") || (doubleWord == 1))
        userScore = userScore + (newLetters.tiles[i].value * 2);
      // else if its just a regular box, then only add the original value
      else if(!element.classList.contains("doubleLetter")
       && (!element.classList.contains("doubleWord")) 
       && element.classList.contains("letter"))
        userScore = userScore + newLetters.tiles[i].value;
      // update the score for the user
      score.textContent = userScore;
    }
  }
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
letters = `{"tiles": [
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
newLetters = JSON.parse(letters)
}

function store_letter_array() {
// go thru the json and get each "letter" into new array (reflecting amount per letter)
for(let i = 0; i < newLetters.tiles.length; i++){
  for(let j = 0; j < newLetters.tiles[i].amount; j++)
    letter_array.push(`img/${newLetters.tiles[i].letter}.jpg`)
}
}