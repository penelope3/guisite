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

// JSON object of letter data
let letters = `{"pieces": [
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

const newLetters = JSON.parse(letters)
let lettersArr = [];
// go thru the json and get each "letter" into new array (reflecting amount per letter)
for(let i = 0; i < newLetters.pieces.length; i++){
  for(let j = 0; j < newLetters.pieces[i].amount; j++)
    lettersArr.push(`img/${newLetters.pieces[i].letter}.jpg`)
}

// Source variables for following functions
let currImgSrc = "";
let imgSrcValue = "a";
let parent;
let siblings = false;
let previous, next;
let dropped = true;
let draggedOver = false;
let userScore = 0;
let doubleWord = 0;

// restarts the game
document.querySelector(".reset").addEventListener("click", () => location.reload());

const score = document.querySelector(".score")
const rackBox = document.querySelectorAll(".rack > .empty")
const clearBoardTiles = document.querySelectorAll(".dropBox")

// keep getting the updated values
setInterval(() => {
  let fill = document.querySelectorAll(".fill");
  fill.forEach(currImg => {
    // dragStart event listens when dragging has been started
    currImg.addEventListener("dragstart", dragStart);
    // dragEnd listens for when you let go of the object
    currImg.addEventListener("dragend", dragEnd);
  });

  // select all the boxes 
  const empty = document.querySelectorAll(".empty");
  empty.forEach(emptyBox => {
    emptyBox.addEventListener("dragover", dragOver);
    emptyBox.addEventListener("dragleave", dragLeave);
    emptyBox.addEventListener("drop", dragDrop);
  });

}, 100);

// checks when the user starts dragging image
function dragStart(){
  currImgSrc = this.children[0].src;
  // gets the parent element so if the drag wasnt successful then undo the img
  parent = this.parentElement;
  // remove the element once moved after small delay
  setTimeout(()=> (parent.textContent = ""), 0);
}

// when the user lets go of the img
function dragEnd(){
  this.classList.add("fill")
  if(dropped == false || draggedOver == false){
    if(parent.classList.contains("dropBox"))
      errorLog("BadDrag")
    else
      errorLog("Invalid")
    newImg(parent)
  }
}

// listens for when the img is on this particular box
function dragOver(e){
  // prevent the default behaviour of dragover otherwise dragDrop() wouldnt work
  e.preventDefault();
  draggedOver = true;
}

// checks when img leaves the div
function dragLeave(){
  // if the image is dragged out of the box then set it to false so it doesnt make the img disappear
  draggedOver = false;
}

// checks when img is dropped in the div
function dragDrop(){
  const checkSib = document.querySelectorAll(".dropBox")
  siblings = [...checkSib].some(getSiblings)

  // check for spaces and to make sure its placed next to existing tile
  if(!this.classList.contains("first")
   && this.classList.contains("dropBox"))
    previous = this.previousSibling.previousSibling.childNodes.length;
 
  if(!this.classList.contains("last")
   && this.classList.contains("dropBox"))
    next = this.nextSibling.nextSibling.childNodes.length;
  
  // took the rest of the function out to make it more readable
  moveTileValidate(this)
}

function moveTileValidate(elem){
  // if the box already contains img then dont add
  if(elem.childNodes.length >= 1 && draggedOver === true ){
    dropped = false;
    draggedOver = false;
    errorLog("TileExists")
    return;
  }
  //  once the tile has been placed. it should not be moved around
  if(parent.classList.contains("undraggable")){
    dropped = false;
    draggedOver = false;
    errorLog("BadDrag")
    return;
  }

  // check if the dropped box is the same box not the rack, if so take the value of the word
  if(elem.classList.contains("dropBox") && (previous == 1 || next == 1 || siblings == false)){
    clearErrorLog()
    newImg(elem);
    // to prevent it from moving again in the future
    elem.classList.add("undraggable")
    
    siblings == true

    // get the letter value from the img src
    imgSrcValue = currImgSrc.substring(currImgSrc.indexOf("img/") + 4, currImgSrc.indexOf(".jpg"));
    updateUserScore(imgSrcValue, elem)
  } 

  // if the user moves the tiles in the rack
  else if(elem.classList.contains("rackLetters"))
    newImg(elem);

  // if it wasnt a valid play and it was not the rack then reset the letter
  else{
    dropped = false;
    draggedOver = false;
    newImg(parent);
    errorLog("NoSiblings")
  }
  // if drag was successful
  dropped = true;
  draggedOver = true;
}

// checks if siblings exist for the game board 
function getSiblings(elem){
  if(elem.childNodes.length == 1)
    return true;
  return false;
} 

// adds the word to the total score and restock the user hands
const sbmWord = document.querySelector(".sbtWord")
const totalScore = document.querySelector(".totalScore")
let tempUserScore = 0;
sbmWord.addEventListener("click", ()=>{
  tempUserScore = tempUserScore + userScore
  totalScore.textContent = tempUserScore
  stockRack()
  clearErrorLog();
})

// call it once before the game starts
stockRack()
// get random images each time page loads
function stockRack(){
  // goes thru the whole rack and restocks any img thats missing from the rack
  rackBox.forEach(box => {
    
    const index = Math.floor(Math.random() * lettersArr.length)
    const randIndexValue = lettersArr[index]
    
    // add img on the rack 
    if(box.children[0] == undefined && randIndexValue != undefined && !(lettersArr.length <= 0)){
      newImg(box, randIndexValue)
    
      // take the words out/pop of the array once they are given to the user
      lettersArr.splice(index, 1);

      // update the remaining letters for the user
      document.querySelector(".remainingLetters").textContent = lettersArr.length;
    } 
    
    // checks if the game is done
    const endGame = [...rackBox].some(checkEndGame)
    if(randIndexValue == undefined && lettersArr.length <= 0 && endGame == false)
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

// checks if the game is over
function checkEndGame(elem){
  if(elem.childElementCount == 1){
    return true;
  }
  return false;
}

// Creating New div and placing New Image inside
function newImg(box, img = currImgSrc){
  // every time the block is moved, it makes a new img and deletes the old one
  const newDiv = document.createElement("div")
  const newImg = document.createElement("img")
  
  newDiv.classList.add("fill")
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
      if(element == parent)
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
       && element.classList.contains("dropBox"))
        userScore = userScore + newLetters.pieces[i].value;
      // update the score for the user
      score.textContent = userScore;
    }
  }
}

