/*
File: errorHandle.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on December 17, 2020 at 11:40am

Description: This file contains the error catching for anything that goes wrong.
*/

// logs the errors
const error = document.querySelector("#error");
function errorLog(errType = "Default"){
  const Default = "There was an error moving this tile."
  const BadDrag = "The tile can't be moved once placed. Please submit the word continue."
  const NoAdjacent = "The tile couldn't be placed. Place a tile next to an existing board tile."
  const Invalid = "The tile couldn't be placed. Please place the tiles on the board."
  const TileExists = "The block already contains a tile. Place the letter in an empty board tile."
  const GameOver = "Game over! Please reset the game to get new tiles."

  clearErrorLog();
  switch(errType){
    case "BadDrag":
      error.textContent = BadDrag;
      break;
    case "NoAdjacent":
      error.textContent = NoAdjacent;
      break;
    case "TileExists":
      error.textContent = TileExists;
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