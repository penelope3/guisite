/*
File: errorHandle.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on December 16, 2020 at 10:52pm

Description: This file contains the error catching for anything that goes wrong.
*/

// logs the errors
const error = document.querySelector("#error");
function errorLog(errType = "Default"){
  const Default = "There was an error moving the tile."
  const BadDrag = "The tile can't be moved once placed on the board. Please submit the word to clear the board."
  const NoSiblings = "The tile couldn't be placed. The letter needs to be next to an existing tile."
  const ParentSiblings = "The tile can't be moved from the middle of the tiles. Please move the words next to it first."
  const Invalid = "The tile couldn't be placed. Please place the tiles on the board."
  const TileExists = "The block already contains a tile. Please place the tile in an empty slot."
  const NoRestock = "Can not restock the hand if board still has tiles, please submit the current word before stocking."
  const GameOver = "Game over! You are out of tiles. Please reset the game to continue playing."

  clearErrorLog();
  switch(errType){
    case "BadDrag":
      error.textContent = BadDrag;
      break;
    case "NoSiblings":
      error.textContent = NoSiblings;
      break;
    case "ParentSiblings":
      error.textContent = ParentSiblings;
      break;
    case "TileExists":
      error.textContent = TileExists;
      break;
    case "NoRestock":
      error.textContent = NoRestock;
      break;
    case "GameOver":
      error.textContent = GameOver;
      break;
    case "Invalid":
      error.textContent = Invalid;
      break;
    case "Default":
      error.textContent = Default;
      break;
  }
  error.style.padding = "20px";
}

// clears the error log
function clearErrorLog(){
  error.style.padding = "0";
  error.innerHTML = ""
}