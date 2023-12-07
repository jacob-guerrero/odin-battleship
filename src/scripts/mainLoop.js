const Gameboard = require("./gameboard");
const Player = require("./player");
const Ship = require("./ship");

const initializeGame = () => {
  const player1 = Player("Player 1");
  const player2 = Player("Computer");
  const player1Gameboard = Gameboard();
  const player2Gameboard = Gameboard();

  const ship1 = Ship(3);
  const ship2 = Ship(3);
  // Samples ships
  player1Gameboard.placeShip(ship1, 0, 0, false);
  player2Gameboard.placeShip(ship2, 2, 2, true);

  // Render initial game boards
  renderGameboard("player1-board", player1Gameboard);
  renderGameboard("player2-board", player2Gameboard);

  // Start the game loop
  gameLoop(player1, player2, player1Gameboard, player2Gameboard);
  console.log("its working");
};

// Function to render a game board
const renderGameboard = (elementId, gameboard) => {
  const boardElement = document.getElementById(elementId);
  boardElement.innerHTML = "";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cellValue = gameboard.gameBoard[row][col];
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Apply styles based on cell value
      updateCellValue(cell, cellValue);

      // Add dataset attributes for coordinates
      cell.dataset.x = row;
      cell.dataset.y = col;

      // Append the cell to the board
      boardElement.appendChild(cell);
    }
  }
};

const updateCellValue = (cell, cellValue) => {
  switch (cellValue) {
    case -1:
      cell.style.backgroundColor = "blue";
      break;
    case 0:
      cell.style.backgroundColor = "lightblue";
      break;
    case 1:
      cell.style.backgroundColor = "gray";
      break;
    case 2:
      cell.style.backgroundColor = "red";
      break;
    default:
      break;
  }
};

const playerLogic = (gameboard, x, y, player1) => {
};
const computerLogic = (gameboard, player2) => {
};

const gameLoop = (player1, player2, player1Gameboard, player2Gameboard) => {
};

// Function to end the game
const endGame = () => {
  // Implement logic to display the winner or handle the end of the game
  console.log("finished");
};

// Initialize the game
initializeGame();
