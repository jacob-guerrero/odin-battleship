const Gameboard = require("./gameboard");
const Player = require("./player");
const Ship = require("./ship");
const Doom = require("./doom");

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
  Doom.renderGameboard("player1-board", player1Gameboard);
  Doom.renderGameboard("player2-board", player2Gameboard);

  // Start the game loop
  gameLoop(player1, player2, player1Gameboard, player2Gameboard);
};

const playerLogic = (gameboard, x, y, player1) => {
  player1.attack(x, y, gameboard);

  const cellToUpdate = document.querySelector(
    `#player2-board [data-x="${x}"][data-y="${y}"]`
  );
  if (cellToUpdate) {
    Doom.updateCellValue(cellToUpdate, gameboard.gameBoard[x][y]);
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
    Doom.updateCellValue(cellToUpdate, gameboard.gameBoard[x][y]);
  }
};

const gameLoop = (player1, player2, player1Gameboard, player2Gameboard) => {
  let currentPlayer = player1;
  let isFinished = false;

  const handleAttack = (x, y) => {
    if (currentPlayer === player1) {
      playerLogic(player2Gameboard, x, y, player1);
    } else {
      computerLogic(player1Gameboard, player2);
    }

    // Check if the game is over
    if (player1Gameboard.allShipsSunk() || player2Gameboard.allShipsSunk()) {
      const enemyBoardElement = document.getElementById(`player2-board`);
      enemyBoardElement.removeEventListener("click", inputAttack);

      isFinished = true;
    } else {
      // Switch players if it is not finished
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  };

  // Add event listeners for Player 1
  const inputAttack = (event) => {
    // Check if the clicked element is a cell
    if (!isFinished && event.target.classList.contains("cell")) {
      // Get the clicked coordinates from the dataset
      const x = +event.target.dataset.x;
      const y = +event.target.dataset.y;

      // Handle the attack
      handleAttack(x, y);

      // Switch players if it is not finished
      if (!isFinished) {
        handleAttack(x, y);
      }
    }
  };

  const enemyBoardElement = document.getElementById(`player2-board`);
  enemyBoardElement.addEventListener("click", inputAttack);
};

// Initialize the game
initializeGame();
