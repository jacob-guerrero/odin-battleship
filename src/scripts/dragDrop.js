const cellSize = 30; // Size of each cell
let idShip = 0;
const shipContainer = document.querySelector(".ship-container")

const enableDragAndDrop = (gameboard, ships) => {
  console.log(gameboard.gameBoard);

  ships.forEach((ship) => {
    const shipElement = createShipElement(ship);
    idShip += 1;
    shipContainer.appendChild(shipElement);
  });
};

const createShipElement = (ship) => {
  const shipElement = document.createElement("div");
  shipElement.classList.add("ship", "draggable");
  shipElement.dataset.ship = idShip;

  // Adjust the ship's appearance
  shipElement.style.width = ship.length * cellSize - 4 + "px";
  shipElement.style.height = cellSize - 4 + "px";
  shipElement.style.position = "absolute";
  shipElement.style.top = idShip * (cellSize - 4) + "px";

  // Add a class to represent the ship's orientation (e.g., "vertical")
  shipElement.classList.add("horizontal");

  // Handle orientation toggle on click
  /* shipElement.addEventListener("click", () => {
    shipElement.classList.toggle("horizontal");
  }); */

  return shipElement;
};

module.exports = { enableDragAndDrop, createShipElement };
