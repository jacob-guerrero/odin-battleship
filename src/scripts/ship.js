const Ship = (length) => {
  let hits = 0;

  const hit = () => {
    hits += 1;
  };

  const isSunk = () => {
    return hits === length;
  };

  return { length, hit, isSunk };
};

module.exports = Ship;
