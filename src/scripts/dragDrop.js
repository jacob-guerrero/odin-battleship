const Ship = require("./ship");
const interact = require("interactjs");

const cellSize = 30; // Size of each cell

const enableDragAndDrop = (gameboard) => {
  const ships = [Ship(2), Ship(4)]; // Add more ships as needed

  ships.forEach((ship) => {
    const shipElement = createShipElement(ship);
    document.body.appendChild(shipElement);
  });
};

const createShipElement = (ship) => {
  const shipElement = document.createElement("div");
  shipElement.classList.add("ship", "draggable");

  // Adjust the ship's appearance
  shipElement.style.width = ship.length * cellSize + "px";
  shipElement.style.height = cellSize + "px";
  shipElement.style.backgroundColor = "gray";

  // Add a class to represent the ship's orientation (e.g., "vertical")
  shipElement.classList.add("vertical");

  // Handle orientation toggle on click
  shipElement.addEventListener("click", () => {
    shipElement.classList.toggle("vertical");
  });

  return shipElement;
};

// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
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
      var textEl = event.target.querySelector("p");

      textEl &&
        (textEl.textContent =
          "moved a distance of " +
          Math.sqrt(
            (Math.pow(event.pageX - event.x0, 2) +
              Math.pow(event.pageY - event.y0, 2)) |
              0
          ).toFixed(2) +
          "px");
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
  accept: "#yes-drop",
  // Require a 90% element overlap for a drop to be possible
  overlap: 0.9,

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

/* let gridTarget = interact.snappers.grid({
  // can be a pair of x and y, left and top,
  // right and bottom, or width, and height
  x: cellSize,
  y: cellSize,

  // optional
  range: cellSize,
}); */
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

module.exports = { enableDragAndDrop, createShipElement };
