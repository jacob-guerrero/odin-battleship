const Ship = (length) => {
  let hits = 0;

  const hit = () => {
    hits += 1;
  };

  const isSunk = () => {
    return hits === length ? true : false;
  };

  return { length, hit, isSunk };
};

module.exports = Ship;
