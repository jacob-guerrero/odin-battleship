const Gameboard = require("./gameboard");
const Player = require("./player");
const Ship = require("./ship");
const Doom = require("./doom");
const DragDrop = require("./dragDrop");

const interact = require("interactjs");

const player1Gameboard = Gameboard();
const player2Gameboard = Gameboard();

let xStartCoord = 0;
let yStartCoord = 0;
const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]; // Add more ships as needed

const initializeGame = () => {
  const player1 = Player("Player 1");
  const player2 = Player("Computer");
  
  const ship1 = Ship(3);
  const ship2 = Ship(3);
  // Samples ships
  player1Gameboard.placeShip(ship1, 0, 0, false);
  player2Gameboard.placeShip(ship2, 2, 2, true);

// Allow Player 1 to drag and drop ships
console.log(player1Gameboard.gameBoard);
DragDrop.enableDragAndDrop(player1Gameboard, ships);

// Computer places ships randomly for Player 2
//placeShipsRandomly(player2Gameboard);

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


const updateGameboard = (ship, xCoord, yCoord, isVertical) => {
  const isOverlapping = player1Gameboard.placeShip(ship, xCoord, yCoord, isVertical);
  console.log(player1Gameboard.gameBoard, ship, xCoord, yCoord, isVertical);

  for (let i = 0; i < ship.length; i++) {
    if (!isVertical) {
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord}"][data-y="${yCoord + i}"]`
      );
      Doom.updateCellValue(cellToUpdate, player1Gameboard.gameBoard[xCoord][yCoord + i]);
    } else {
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord + i}"][data-y="${yCoord}"]`
      );
      Doom.updateCellValue(cellToUpdate, player1Gameboard.gameBoard[xCoord + i][yCoord]);
    }
  }
  
  return isOverlapping;
}

const removePrevCoords = (ship, xCoord, yCoord, isVertical) => {
  for (let i = 0; i < ship.length; i++) {
    if (!isVertical) {
      player1Gameboard.gameBoard[xCoord][yCoord + i] = 0;
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord}"][data-y="${yCoord + i}"]`
      );
      Doom.updateCellValue(cellToUpdate, player1Gameboard.gameBoard[xCoord][yCoord + i])
    } else {
      player1Gameboard.gameBoard[xCoord + i][yCoord] = 0;
      const cellToUpdate = document.querySelector(
        `#player1-board [data-x="${xCoord + i}"][data-y="${yCoord}"]`
      );
      Doom.updateCellValue(cellToUpdate, player1Gameboard.gameBoard[xCoord + i][yCoord])
    }
  }
}



// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: true,
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
      const dropzoneDiv = document.querySelector('.dropzone');
      const dropzoneDivRight = dropzoneDiv.getBoundingClientRect().right;
      const dropzoneDivBottom = dropzoneDiv.getBoundingClientRect().bottom;
      const draggableRight = event.target.getBoundingClientRect().right;
      const draggableBottom = event.target.getBoundingClientRect().bottom;
      
      const xCoord = +event.target.getBoundingClientRect().x - +dropzoneDiv.getBoundingClientRect().x;
      const yCoord = +event.target.getBoundingClientRect().y - +dropzoneDiv.getBoundingClientRect().y + (+event.target.getBoundingClientRect().height / 2);

      console.log("x: " + Math.floor(yCoord / 30));
      console.log("y: " + Math.floor(xCoord / 30));
      
      if ( (draggableRight >= dropzoneDivRight + 30) || (draggableBottom >= dropzoneDivBottom + 15) || (Math.floor(yCoord / 30) < 0) || (Math.floor(xCoord / 30) < 0)) {
        console.log("its outside!");
        console.log(xStartCoord, yStartCoord);
        event.target.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
        event.target.setAttribute("data-x", "");
        event.target.setAttribute("data-y", "");

        if(event.target.classList.contains("isPlaced")) {
          event.target.classList.remove("isPlaced");

          const ship = ships[+event.target.dataset.ship];
          const isVertical = !event.target.classList.contains("horizontal");
          const xCoordPlaced = event.target.dataset.xplaced;
          const yCoordPlaced = event.target.dataset.yplaced;
          
          // Remove prev coords
          removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);
          
          event.target.setAttribute("data-xPlaced", "");
          event.target.setAttribute("data-yPlaced", "");
        }
      }
      else {
        const isOverlapping = updateGameboard(ships[+event.target.dataset.ship], Math.floor(yCoord / 30), Math.floor(xCoord / 30), false);

        if (isOverlapping === true) {
          console.log("its overlapping!");
          event.target.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
          event.target.setAttribute("data-x", "");
          event.target.setAttribute("data-y", "");

          if(event.target.classList.contains("isPlaced")) {
            event.target.classList.remove("isPlaced");
  
            const ship = ships[+event.target.dataset.ship];
            const isVertical = !event.target.classList.contains("horizontal");
            const xCoordPlaced = event.target.dataset.xplaced;
            const yCoordPlaced = event.target.dataset.yplaced;
            
            // Remove prev coords
            removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);
            
            event.target.setAttribute("data-xPlaced", "");
            event.target.setAttribute("data-yPlaced", "");
          }
          
        } else {
          
          event.target.classList.add("isPlaced");
        }
        if (event.target.classList.contains("isPlaced") && event.target.dataset.xplaced) {
          const ship = ships[+event.target.dataset.ship];
          const isVertical = !event.target.classList.contains("horizontal");
          const xCoordPlaced = event.target.dataset.xplaced;
          const yCoordPlaced = event.target.dataset.yplaced;
          
          // Remove prev coords
          removePrevCoords(ship, +xCoordPlaced, +yCoordPlaced, isVertical);
          console.log("Removed!", +isVertical, +xCoordPlaced, yCoordPlaced)
        }
      }

      // Placing ship
      if(event.target.classList.contains("isPlaced")) {
        //event.target.classList.add("isPlaced");
        event.target.setAttribute("data-xPlaced", Math.floor(yCoord / 30));
        event.target.setAttribute("data-yPlaced", Math.floor(xCoord / 30));
        
      }
    },
  },
});

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.transform = "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// enable draggables to be dropped into this
interact(".dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: ["#yes-drop", ".ship"],
  // Require a 80% element overlap for a drop to be possible
  overlap: 0.80,

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
    draggableElement.textContent = "Dragged in";
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
    event.relatedTarget.textContent = "Dragged out";
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = "Dropped";
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





// Initialize the game
initializeGame();
