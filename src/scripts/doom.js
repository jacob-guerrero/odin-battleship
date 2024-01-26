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

  if (elementId === "player2-board") {
    boardElement.classList.add("hidden")
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

const placeShipsRandomly = (gameboard, ships) => {
  for (const ship of ships) {
    let isVertical = Math.random() < 0.5; // Randomly choose vertical or horizontal placement
    let xCoord, yCoord;

    // Generate random coordinates within the game board boundaries
    if (isVertical) {
      xCoord = Math.floor(Math.random() * (gameboard.gameBoard.length - ship.length + 1));
      yCoord = Math.floor(Math.random() * gameboard.gameBoard[0].length);
    } else {
      xCoord = Math.floor(Math.random() * gameboard.gameBoard.length);
      yCoord = Math.floor(Math.random() * (gameboard.gameBoard[0].length - ship.length + 1));
    }

    // Check if the randomly chosen position is valid for the ship
    let isValidPosition = true;
    for (let i = 0; i < ship.length; i++) {
      if (isVertical) {
        if (gameboard.gameBoard[xCoord + i][yCoord] !== 0) {
          isValidPosition = false;
          break;
        }
      } else {
        if (gameboard.gameBoard[xCoord][yCoord + i] !== 0) {
          isValidPosition = false;
          break;
        }
      }
    }

    // If the position is valid, place the ship on the game board
    if (isValidPosition) {
      gameboard.placeShip(ship, xCoord, yCoord, isVertical);
    } else {
      // If the position is not valid, try again with a new random position for the ship
      placeShipsRandomly(gameboard, [ship]); // Recursively call placeShipsRandomly with the same ship
    }
  }
};

module.exports = { renderGameboard, updateCellValue, placeShipsRandomly };
