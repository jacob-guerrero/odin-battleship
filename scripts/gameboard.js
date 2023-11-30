const Ship = require("./ship");
const battleship = Ship(4);

const Gameboard = () => {
  // const boardSize = 10;
  const ships = [];
  const missedAttacks = [];

  const gameBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const placeShip = (ship, x, y, isVertical) => {
    if (x < 0 || x >= gameBoard.length || y < 0 || y >= gameBoard[0].length) {
      // console.log("Invalid placement coordinates");
      return;
    }

    const shipCoordinates = [];
    for (let i = 0; i < ship.length; i++) {
      if (!isVertical) {
        shipCoordinates.push([x, y + i]);
      } else {
        shipCoordinates.push([x + i, y]);
      }
    }

    const overlapping = shipCoordinates.some(
      (coord) => gameBoard[coord[0]][coord[1]] !== 0
    );

    if (!overlapping) {
      for (const coord of shipCoordinates) {
        gameBoard[coord[0]][coord[1]] = 1;
      }
      // console.log("Ship placed successfully");
      ship.coordinates = shipCoordinates;
      ships.push(ship);
      return ship.coordinates;
    } else {
      // console.log("Cannot place ship, overlapping with another ship");
    }
  };

  const receiveAttack = (x, y) => {
    if (gameBoard[x][y] === 1) {
      // console.log("Hit!");
      gameBoard[x][y] = -1; // Mark the hit on the board
      return true;
    } else {
      // console.log("Missed shot!");
      missedAttacks.push([x, y]);
      return false;
    }
  };

  return { gameBoard, placeShip, receiveAttack };
};

module.exports = Gameboard;
