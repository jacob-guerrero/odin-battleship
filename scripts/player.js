const Player = (name) => {
  const attacks = [];

  const makeRandomAttack = (opponentGameboard) => {
    // Generate random coordinates
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    // Check if the move is legal
    if (!attacks.some((coord) => coord[0] === x && coord[1] === y)) {
      attacks.push([x, y]);
      opponentGameboard.receiveAttack(x, y);
      return { x, y };
    } else {
      // If the move is illegal, try again
      return makeRandomAttack(opponentGameboard);
    }
  };

  return { name, makeRandomAttack };
};

module.exports = Player;
