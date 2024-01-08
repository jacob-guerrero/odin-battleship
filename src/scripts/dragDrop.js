const Gameboard = require("./gameboard");
const Ship = require("./ship");

const cellSize = 30; // Size of each cell
//const ships = [Ship(2), Ship(4)]; // Add more ships as needed

const enableDragAndDrop = (gameboard, ships) => {
  console.log(gameboard.gameBoard);

  ships.forEach((ship) => {
    const shipElement = createShipElement(ship);
    document.body.appendChild(shipElement);
  });
};

const createShipElement = (ship) => {
  const shipElement = document.createElement("div");
  shipElement.classList.add("ship", "draggable");

  // Adjust the ship's appearance
  shipElement.style.width = ship.length * cellSize - 8 + "px";
  shipElement.style.height = cellSize - 4 + "px";

  // Add a class to represent the ship's orientation (e.g., "vertical")
  shipElement.classList.add("vertical");

  // Handle orientation toggle on click
  shipElement.addEventListener("click", () => {
    shipElement.classList.toggle("vertical");
  });

  return shipElement;
};

module.exports = { enableDragAndDrop, createShipElement };
