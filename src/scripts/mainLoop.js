const Gameboard = require("./gameboard");
const Player = require("./player");
const Ship = require("./ship");
const Doom = require("./doom");
const DragDrop = require("./dragDrop");

const interact = require("interactjs");

let player1Gameboard = Gameboard();
let player2Gameboard = Gameboard();

const cellSize = 30; // Size of each cell
/* let xStartCoord = 0;
let yStartCoord = 0; */
let ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]; // Add more ships as needed
let ships2 = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]; // Add more ships as needed

const initializeGame = () => {
  const player1 = Player("Player 1");
  const player2 = Player("Computer");

  const ship1 = Ship(3);
  const ship2 = Ship(3);
  // Samples ships
  player1Gameboard.placeShip(ship1, 0, 0, false);
  player2Gameboard.placeShip(ship2, 2, 2, true);

  // Allow Player 1 to drag and drop ships
  DragDrop.enableDragAndDrop(player1Gameboard, ships);

  // Computer places ships randomly for Player 2
  Doom.placeShipsRandomly(player2Gameboard, ships2);

  // Render initial game boards
  Doom.renderGameboard("player1-board", player1Gameboard);
  Doom.renderGameboard("player2-board", player2Gameboard);

  // Start the game loop
  gameLoop(player1, player2, player1Gameboard, player2Gameboard);
};

const restartGame = () => {
  const shipContainer = document.querySelector(".ship-container");
  const btn = document.querySelector(".start");
  const instructionsDiv = document.querySelector(".instructions-container");
  const boardContainer = document.querySelector(".container");
  const fbContainer = document.querySelector(".fb-container");
  const btnReset = document.querySelector(".reset");

  const fbTitle = document.querySelector(".fb-title");
  const fbText = document.querySelector(".fb-text");
  const fbShips1 = document.querySelector(".fb-ships-1");
  const fbShips2 = document.querySelector(".fb-ships-2");

  shipContainer.classList.remove("hidden");
  shipContainer.replaceChildren();
  fbShips1.replaceChildren();
  fbShips2.replaceChildren();
  btn.classList.remove("hidden");
  btnReset.classList.add("hidden");
  instructionsDiv.classList.remove("hidden");
  fbContainer.classList.add("hidden");
  boardContainer.classList.remove("playing");

  btn.classList.remove("btn-active");
  btn.removeEventListener("click", handleClick);

  fbTitle.textContent = "Your Turn";
  fbText.textContent = "Click on the opponent's board (on the right) to shoot";

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      player1Gameboard.gameBoard[row][col] = 0; // Set the value at each position to 0
      player2Gameboard.gameBoard[row][col] = 0; // Set the value at each position to 0
    }
  }

  ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]; // Create new ships
  ships2 = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]; // Create new ships2

  player1Gameboard = Gameboard();
  player2Gameboard = Gameboard();
  initializeGame();
};

const endGame = () => {
  const fbTitle = document.querySelector(".fb-title");
  const fbText = document.querySelector(".fb-text");
  const btnReset = document.querySelector(".reset");

  if (player1Gameboard.allShipsSunk()) {
    fbTitle.textContent = "You Lost!";
  } else {
    fbTitle.textContent = "You Won!";
  }

  fbText.textContent = "Click RESTART to play again";
  btnReset.classList.remove("hidden");

  btnReset.addEventListener("click", restartGame);
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
const checkShipSunk = (opponentPlayerShips, currentPlayer, player1, x, y) => {
  const opponentPlayerBoard = currentPlayer === player1 ? "player2-board" : "player1-board";
  const fbShipsRep = currentPlayer === player1 ? "fb-ships-2" : "fb-ships-1";
  const cellClicked = document.querySelector(`#${opponentPlayerBoard} .cell[data-x="${x}"][data-y="${y}"]`);

  opponentPlayerShips.forEach((ship, shipIndex) => {
    const isVertical = ship.coordinates[0][0] === ship.coordinates[1][0];
    const sunkShip = ship.isSunk();

    if (sunkShip && !cellClicked.classList.contains("ship-sunk") && !ship.processed) {
      if (isVertical) {
        ship.coordinates.forEach(([row, col], index) => {
          const cellElement = document.querySelector(`#${opponentPlayerBoard} .cell[data-x="${row}"][data-y="${col}"]`);
          if (index === 0) {
            cellElement.classList.add('ship-sunk', 'left-h');
          } else if (index === ship.coordinates.length - 1) {
            cellElement.classList.add('ship-sunk', 'right-h');
          } else {
            cellElement.classList.add('ship-sunk', 'middle-h');
          }
        });  
      } else {
        ship.coordinates.forEach(([row, col], index) => {
          const cellElement = document.querySelector(`#${opponentPlayerBoard} .cell[data-x="${row}"][data-y="${col}"]`);
          if (index === 0) {
            cellElement.classList.add('ship-sunk', 'top-v');
          } else if (index === ship.coordinates.length - 1) {
            cellElement.classList.add('ship-sunk', 'bottom-v');
          } else {
            cellElement.classList.add('ship-sunk', 'middle-v');
          }
        });  
      }

      ship.processed = true;
      console.log(shipIndex);
      const dataRepCells = document.querySelectorAll(`.${fbShipsRep} [data-ship-rep="${shipIndex}"] .ship-rep-cell`);
      dataRepCells.forEach(cell => {
        cell.style.backgroundColor = "red";
      });
    }
  });
}

const gameLoop = (player1, player2, player1Gameboard, player2Gameboard) => {
  const enemyBoardElement = document.getElementById(`player2-board`);
  let currentPlayer = player1;
  let isFinished = false;

  const handleAttack = (x, y) => {
    if (currentPlayer === player1) {
      playerLogic(player2Gameboard, x, y, player1);
      checkShipSunk(ships2, currentPlayer, player1, x, y);
      updateFbText(currentPlayer, player1, x, y);
    } else {
      computerLogic(player1Gameboard, player2);
      checkShipSunk(ships, currentPlayer, player1, x, y);
      updateFbText(currentPlayer, player1, x, y);
    }

    // Check if the game is over
    if (player1Gameboard.allShipsSunk() || player2Gameboard.allShipsSunk()) {
      enemyBoardElement.removeEventListener("click", inputAttack);

      endGame();

      isFinished = true;
    } else {
      // Switch players if it is not finished
      enemyBoardElement.addEventListener("click", inputAttack);
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
        // Generate random delay between 300 - 1200 ms
        const randomDelay = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;

        enemyBoardElement.removeEventListener("click", inputAttack);
        setTimeout(() => {
          handleAttack(x, y);
        }, randomDelay);
      }
    }
  };

  const updateFbText = (currentPlayer, player1, x, y) => {
    const fbTitle = document.querySelector(".fb-title");
    const fbText = document.querySelector(".fb-text");

    if (currentPlayer.name === player1.name) {
      fbTitle.textContent = "Opponent's Turn";

      switch (player2Gameboard.gameBoard[x][y]) {
        case 2:
          fbText.textContent = "Hit!";
          break;
        default:
          fbText.textContent = "Miss!";
          break;
      }
    } else {
      fbTitle.textContent = "Your Turn";
    }
  };

  enemyBoardElement.addEventListener("click", inputAttack);
};

const updateGameboard = (ship, xCoord, yCoord, isVertical) => {
  const isOverlapping = player1Gameboard.placeShip(
    ship,
    xCoord,
    yCoord,
    isVertical
  );
  //console.log(player1Gameboard.gameBoard, ship, xCoord, yCoord, isVertical);

  for (let i = 0; i < ship.length; i++) {
    if (!isVertical) {
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord}"][data-y="${yCoord + i}"]`
      );
      Doom.updateCellValue(
        cellToUpdate,
        player1Gameboard.gameBoard[xCoord][yCoord + i]
      );
    } else {
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord + i}"][data-y="${yCoord}"]`
      );
      Doom.updateCellValue(
        cellToUpdate,
        player1Gameboard.gameBoard[xCoord + i][yCoord]
      );
    }
  }

  return isOverlapping;
};

const removePrevCoords = (ship, xCoord, yCoord, isVertical) => {
  for (let i = 0; i < ship.length; i++) {
    if (!isVertical) {
      player1Gameboard.gameBoard[xCoord][yCoord + i] = 0;
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord}"][data-y="${yCoord + i}"]`
      );
      Doom.updateCellValue(
        cellToUpdate,
        player1Gameboard.gameBoard[xCoord][yCoord + i]
      );
    } else {
      player1Gameboard.gameBoard[xCoord + i][yCoord] = 0;
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord + i}"][data-y="${yCoord}"]`
      );
      Doom.updateCellValue(
        cellToUpdate,
        player1Gameboard.gameBoard[xCoord + i][yCoord]
      );
    }
  }
};

/* Start game */
const hideOpponentShips = () => {
  const coordsOpponentShips = player2Gameboard.ships;
  coordsOpponentShips.forEach((ship) => {
    /* console.log(ship.coordinates)
    console.log(ship, ship.isSunk()) */
    for (let i = 0; i < ship.coordinates.length; i++) {
      const x = ship.coordinates[i][0];
      const y = ship.coordinates[i][1];

      const cellToHide = document.querySelector(
        `#player2-board [data-x="${x}"][data-y="${y}"]`
      );
      cellToHide.style.backgroundColor = "lightblue";
    }
  });
};

const handleClick = () => {
  hideOpponentShips();
  Doom.placeShipRepresentations("player1-board", ships);
  Doom.placeShipRepresentations("player2-board", ships2);

  const shipContainer = document.querySelector(".ship-container");
  const btn = document.querySelector(".start");
  const player2Board = document.querySelector("#player2-board");
  const instructionsDiv = document.querySelector(".instructions-container");
  const boardContainer = document.querySelector(".container");
  const fbContainer = document.querySelector(".fb-container");

  shipContainer.classList.add("hidden");
  btn.classList.add("hidden");
  instructionsDiv.classList.add("hidden");
  player2Board.classList.remove("hidden");
  fbContainer.classList.remove("hidden");

  boardContainer.classList.add("playing");
};

const checkAllShipsPlaced = () => {
  const numShips = document.querySelectorAll(".isPlaced").length;
  const btn = document.querySelector(".start");

  if (numShips === 5) {
    btn.classList.add("btn-active");

    btn.addEventListener("click", handleClick);
  } else {
    btn.classList.remove("btn-active");

    btn.removeEventListener("click", handleClick);
  }
};

// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: {
    resistance: 50, // Lower resistance for slower speed
    minSpeed: 200, // Adjust the maximum speed
    endSpeed: 100, // Adjust the minimum speed
  },
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: ".dropzone",
      endOnly: true,
    }),
  ],
  // enable autoScroll
  autoScroll: false,

  listeners: {
    // call this function on every dragmove event
    move: dragMoveListener,

    // call this function on every dragend event
    end(event) {
      const dropzoneDiv = document.querySelector(".dropzone");
      const dropzoneDivRight = dropzoneDiv.getBoundingClientRect().right;
      const dropzoneDivBottom = dropzoneDiv.getBoundingClientRect().bottom;
      const draggableRight = event.target.getBoundingClientRect().right;
      const draggableBottom = event.target.getBoundingClientRect().bottom;

      const xCoord =
        +event.target.getBoundingClientRect().x -
        +dropzoneDiv.getBoundingClientRect().x +
        cellSize / 2;
      const yCoord =
        +event.target.getBoundingClientRect().y -
        +dropzoneDiv.getBoundingClientRect().y +
        cellSize / 2;

      /* console.log("x: " + Math.floor(yCoord / cellSize));
      console.log("y: " + Math.floor(xCoord / cellSize));
      console.log(xCoord, yCoord) */

      const isVertical = !event.target.classList.contains("horizontal");

      if (
        draggableRight >= dropzoneDivRight + cellSize / 2 - 4 ||
        draggableBottom >= dropzoneDivBottom + cellSize / 2 - 4 ||
        Math.floor(yCoord / cellSize) < 0 ||
        Math.floor(xCoord / cellSize) < 0 ||
        (isVertical && draggableRight >= dropzoneDivRight + cellSize / 2 - 6) ||
        (isVertical && draggableBottom >= dropzoneDivBottom + cellSize / 2 - 6)
      ) {
        //Restart ship position when its outside
        event.target.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
        event.target.setAttribute("data-x", "");
        event.target.setAttribute("data-y", "");
        event.target.style.width =
          ships[+event.target.dataset.ship].length * cellSize - 4 + "px";
        event.target.style.height = cellSize - 4 + "px";

        //Restart ship properties when its placed
        if (event.target.classList.contains("isPlaced")) {
          event.target.classList.remove("isPlaced");

          const ship = ships[+event.target.dataset.ship];
          const isVertical = !event.target.classList.contains("horizontal");
          const xCoordPlaced = event.target.dataset.xplaced;
          const yCoordPlaced = event.target.dataset.yplaced;

          // Remove prev coords
          removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);

          event.target.classList.add("horizontal");
          event.target.setAttribute("data-xPlaced", "");
          event.target.setAttribute("data-yPlaced", "");
        }
      } else {
        const isVertical = !event.target.classList.contains("horizontal");
        const isOverlapping = updateGameboard(
          ships[+event.target.dataset.ship],
          Math.floor(yCoord / cellSize),
          Math.floor(xCoord / cellSize),
          isVertical
        );

        if (isOverlapping === true) {
          //Restart ship position when its overlapping
          event.target.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
          event.target.setAttribute("data-x", "");
          event.target.setAttribute("data-y", "");
          event.target.style.width =
            ships[+event.target.dataset.ship].length * cellSize - 4 + "px";
          event.target.style.height = cellSize - 4 + "px";

          //Restart ship properties when its overlapping and placed
          if (event.target.classList.contains("isPlaced")) {
            event.target.classList.remove("isPlaced");

            const ship = ships[+event.target.dataset.ship];
            const isVertical = !event.target.classList.contains("horizontal");
            const xCoordPlaced = event.target.dataset.xplaced;
            const yCoordPlaced = event.target.dataset.yplaced;

            // Remove prev coords
            removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);

            event.target.classList.add("horizontal");
            event.target.setAttribute("data-xPlaced", "");
            event.target.setAttribute("data-yPlaced", "");
          }
        } else {
          event.target.classList.add("isPlaced");
        }
        if (
          event.target.classList.contains("isPlaced") &&
          event.target.dataset.xplaced
        ) {
          const ship = ships[+event.target.dataset.ship];
          const isVertical = !event.target.classList.contains("horizontal");
          const xCoordPlaced = event.target.dataset.xplaced;
          const yCoordPlaced = event.target.dataset.yplaced;

          // Remove prev coords
          removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);
        }
      }

      // Placing ship
      if (event.target.classList.contains("isPlaced")) {
        event.target.setAttribute(
          "data-xPlaced",
          Math.floor(yCoord / cellSize)
        );
        event.target.setAttribute(
          "data-yPlaced",
          Math.floor(xCoord / cellSize)
        );

        const ship = +event.target.dataset.ship;
        const xTranslate = Math.floor(xCoord / cellSize) * cellSize + 2; // +2px: borders
        const yTranslate =
          Math.floor(yCoord / cellSize) * cellSize -
          dropzoneDivBottom +
          60 -
          ship * cellSize +
          4 +
          ship * 4; // +60px: distance between ship-container to board, +4px: borders, +ship*cellSize: size of other ships, +ship*4: other ships borders

        // translate the element
        event.target.style.transform =
          "translate(" + xTranslate + "px, " + yTranslate + "px)";

        // update the posiion attributes
        event.target.setAttribute("data-x", xTranslate);
        event.target.setAttribute("data-y", yTranslate);
      }

      /* Check if all ships were placed */
      checkAllShipsPlaced();
    },
  },
});

function shipPlacedChecker(target) {
  const shipTarget = target.getBoundingClientRect();
  const allPlacedShips = Array.from(document.querySelectorAll(".isPlaced"))
    .filter((ship) => ship !== target)
    .map((ship) => ship.getBoundingClientRect());

  // Check if the target's rectangle doesn't overlap with any other rectangle
  return allPlacedShips.some(
    (ship) =>
      shipTarget.right > ship.left &&
      shipTarget.left < ship.right &&
      shipTarget.bottom > ship.top &&
      shipTarget.top < ship.bottom
  );
}

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  if (shipPlacedChecker(target)) {
    target.classList.add("overlapping");
  } else {
    target.classList.remove("overlapping");
  }

  // translate the element
  target.style.transform = "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// enable draggables to be dropped into this
interact(".dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: [".ship"],
  // Require a 80% element overlap for a drop to be possible
  overlap: 0.8,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add("drop-active");
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add("drop-target");
    draggableElement.classList.add("can-drop");
    //draggableElement.textContent = "Dragged in";
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
    //event.relatedTarget.textContent = "Dragged out";
  },
  ondrop: function (event) {
    //event.relatedTarget.textContent = "Dropped";
    event.relatedTarget.classList.remove("can-drop");
    event.relatedTarget.classList.remove("overlapping");
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove("drop-active");
    event.target.classList.remove("drop-target");
  },
});

interact(".drag-drop").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: ".dropzone",
      endOnly: true,
    }),
    /* interact.modifiers.snap({ targets: [gridTarget] }), */
  ],
  autoScroll: true,
  // dragMoveListener from the dragging demo above
  listeners: { move: dragMoveListener },
});

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

/* const getStartCoords = (event) => {
  xStartCoord = +event.target.getBoundingClientRect().x;
  yStartCoord = +event.target.getBoundingClientRect().y;
  console.log(xStartCoord, yStartCoord);
} */

/* on tap ships */
const checkShips = (
  player1Gameboard,
  xCoordPlaced,
  yCoordPlaced,
  ship,
  isVertical
) => {
  for (let i = 1; i < ship.length; i++) {
    const x = isVertical ? xCoordPlaced : xCoordPlaced + i;
    const y = isVertical ? yCoordPlaced + i : yCoordPlaced;

    if (player1Gameboard.gameBoard[x][y] === 1) {
      return true;
    }
  }
  return false;
};

interact(".ship").on("tap", function (event) {
  const dropzoneDiv = document.querySelector(".dropzone");

  const xCoord =
    +event.target.getBoundingClientRect().x -
    +dropzoneDiv.getBoundingClientRect().x +
    cellSize / 2;
  const yCoord =
    +event.target.getBoundingClientRect().y -
    +dropzoneDiv.getBoundingClientRect().y +
    cellSize / 2;

  if (event.target.classList.contains("isPlaced")) {
    const ship = ships[+event.target.dataset.ship];
    const isVertical = !event.target.classList.contains("horizontal");

    const xCoordPlaced = +event.target.dataset.xplaced;
    const yCoordPlaced = +event.target.dataset.yplaced;

    // Check if ship will be inside gameboard
    if (xCoordPlaced + ship.length <= 10 && yCoordPlaced + ship.length <= 10) {
      // Check if ship will not be overlapping
      if (
        !checkShips(
          player1Gameboard,
          xCoordPlaced,
          yCoordPlaced,
          ship,
          isVertical
        )
      ) {
        //Change ship direction
        const length = ship.length * cellSize - 4;
        const size = cellSize - 4;

        event.currentTarget.style.width = isVertical
          ? `${length}px`
          : `${size}px`;
        event.currentTarget.style.height = isVertical
          ? `${size}px`
          : `${length}px`;

        // Remove prev coords and update gameboard
        removePrevCoords(ship, xCoordPlaced, yCoordPlaced, isVertical);
        event.currentTarget.classList.toggle("horizontal");
        updateGameboard(
          ship,
          Math.floor(yCoord / cellSize),
          Math.floor(xCoord / cellSize),
          !isVertical
        );
      } else {
        event.currentTarget.classList.add("overlapping");

        setTimeout(() => {
          event.currentTarget.classList.add("overlapping-fade");
          setTimeout(() => {
            event.currentTarget.classList.remove("overlapping");
            event.currentTarget.classList.remove("overlapping-fade");
          }, 400);
        }, 200);
      }
    } else {
      event.currentTarget.classList.add("overlapping");

      setTimeout(() => {
        event.currentTarget.classList.add("overlapping-fade");
        setTimeout(() => {
          event.currentTarget.classList.remove("overlapping");
          event.currentTarget.classList.remove("overlapping-fade");
        }, 400);
      }, 200);
    }
  }

  event.preventDefault();
});

// Initialize the game
initializeGame();
