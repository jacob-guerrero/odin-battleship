const cellSize = 30; // Size of each cell
let idShip = 0;
//const ships = [Ship(2), Ship(4)]; // Add more ships as needed

const enableDragAndDrop = (gameboard, ships) => {
  console.log(gameboard.gameBoard);

  ships.forEach((ship) => {
    const shipElement = createShipElement(ship);
    idShip += 1;
    document.body.appendChild(shipElement);
  });
};

const createShipElement = (ship) => {
  const shipElement = document.createElement("div");
  shipElement.classList.add("ship", "draggable");
  shipElement.dataset.ship = idShip;

  // Adjust the ship's appearance
  shipElement.style.width = ship.length * cellSize - 8 + "px";
  shipElement.style.height = cellSize - 4 + "px";

  // Add a class to represent the ship's orientation (e.g., "vertical")
  shipElement.classList.add("horizontal");

  // Handle orientation toggle on click
  /* shipElement.addEventListener("click", () => {
    shipElement.classList.toggle("horizontal");
  }); */

  return shipElement;
};

module.exports = { enableDragAndDrop, createShipElement };
