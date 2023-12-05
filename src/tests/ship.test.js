const Ship = require("../scripts/ship");

const firstShip = Ship(2);
firstShip.hit();
firstShip.hit();

test("ship is created with its length", () => {
  expect(firstShip.length).toBe(2);
});

test("ship is sunk", () => {
  expect(firstShip.isSunk()).toBeTruthy();
});
