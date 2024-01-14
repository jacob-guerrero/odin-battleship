const Gameboard = () => {
  // const boardSize = 10;
  // 0 = no ship
  // 1 = ship
  // -1 = missed shot
  // 2 = hit ship

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
      return overlapping;
    }
  };

  const receiveAttack = (x, y) => {
    if (gameBoard[x][y] === 1) {
      // console.log("Hit!");

      // Find the ship based on coordinates
      const hitShip = ships.find((ship) =>
        ship.coordinates.some((coord) => coord[0] === x && coord[1] === y)
      );
      
      gameBoard[x][y] = 2; // Mark the hit on the board
      hitShip.hit();
      return true;
    } else {
      // console.log("Missed shot!");
      gameBoard[x][y] = -1;
      missedAttacks.push([x, y]);
      return false;
    }
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  return { gameBoard, placeShip, receiveAttack, allShipsSunk, missedAttacks };
};

module.exports = Gameboard;
