const Gameboard = require("../scripts/gameboard");
const Ship = require("../scripts/ship");

const gameBoard1 = Gameboard();
const battleship = Ship(4);
const ship3 = Ship(3);
const ship2 = Ship(2);

gameBoard1.placeShip(battleship, 0, 4, false);
gameBoard1.placeShip(ship2, 7, 7, false);

test("Create gameboard", () => {
  expect(gameBoard1.gameBoard.length).toBe(10);
  expect(gameBoard1.gameBoard[0].length).toBe(10);
});

test("Ship coordinates", () => {
  expect(gameBoard1.placeShip(ship3, 5, 4, true)).toStrictEqual([
    [5, 4],
    [6, 4],
    [7, 4],
  ]);
});

test("Hit ship", () => {
  expect(gameBoard1.receiveAttack(0, 4)).toBeTruthy();
  expect(gameBoard1.receiveAttack(0, 7)).toBeTruthy();
});

test("Miss shot", () => {
  expect(gameBoard1.receiveAttack(0, 8)).toBeFalsy();
  expect(gameBoard1.receiveAttack(0, 3)).toBeFalsy();
  expect(gameBoard1.receiveAttack(1, 4)).toBeFalsy();
});
