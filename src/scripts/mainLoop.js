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
  console.log(gameboard);
  player1.attack(x, y, gameboard);
  const cellToUpdate = document.querySelector(
    `#player2-board [data-x="${x}"][data-y="${y}"]`
  );

  if (cellToUpdate) {
    updateCellValue(cellToUpdate, gameboard.gameBoard[x][y]);
  }
};
const computerLogic = (gameboard, player2) => {
  const computerAttack = player2.makeRandomAttack(gameboard);
  const x = computerAttack.x;
  const y = computerAttack.y;

  const cellToUpdate = document.querySelector(
    `#player1-board [data-x="${x}"][data-y="${y}"]`
  );

  if (cellToUpdate) {
    updateCellValue(cellToUpdate, gameboard.gameBoard[x][y]);
  }
};

const gameLoop = (player1, player2, player1Gameboard, player2Gameboard) => {
  let currentPlayer = player1;

  const handleAttack = (x, y) => {
    const opponentGameboard =
      currentPlayer === player1 ? player2Gameboard : player1Gameboard;
    if (currentPlayer === player1) {
      playerLogic(opponentGameboard, x, y, player1);
    } else {
      // computerLogic(opponentGameboard, player2);
    }

    // Check if the game is over
    if (player1Gameboard.allShipsSunk() || player2Gameboard.allShipsSunk()) {
      endGame();
    } else {
      // Computer turn and Switch players
      const opponentGameboard2 =
        currentPlayer === player1 ? player1Gameboard : player2Gameboard;
      computerLogic(opponentGameboard2, player2);
    }
  };

  // Add event listeners for user input (Player 1)
  const enemyBoardElement = document.getElementById(`player2-board`);
  enemyBoardElement.addEventListener("click", (event) => {
    // Check if the clicked element is a cell
    if (event.target.classList.contains("cell")) {
      // Get the clicked coordinates from the dataset
      console.log(event.target);
      const x = +event.target.dataset.x;
      const y = +event.target.dataset.y;

      // Handle the attack
      handleAttack(x, y);
    }
  });
};

// Function to end the game
const endGame = () => {
  // Implement logic to display the winner or handle the end of the game
  console.log("finished");
};

// Initialize the game
initializeGame();
