const Gameboard = require("../scripts/gameboard");
const Player = require("../scripts/player");
const Ship = require("../scripts/ship");

const player1 = Player("Jacob");
const gameBoard1 = Gameboard();
const ship1 = Ship(2);
gameBoard1.placeShip(ship1, 2, 2, false);

const player2 = Player("Computer");
const gameBoard2 = Gameboard();
const ship2 = Ship(2);
gameBoard2.placeShip(ship2, 4, 4, true);

test("Player 1 attacks computer", () => {
  expect(player1.attack(2, 2, gameBoard2)).toStrictEqual({ x: 2, y: 2 });
});
