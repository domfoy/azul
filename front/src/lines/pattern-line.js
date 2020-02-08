import Line from './generic';

const patternSlots = [1, 2, 3, 4, 5].map((line) => {
  const slots = [];

  for (let col = 1; col <= line; col++) {
    slots.push({
      col,
      line
    });
  }

  return slots;
});

const config = {
  patternSlots
};

export default Line(config);
