const { cuboid, roundedCuboid } = require("@jscad/modeling").primitives;
const { translate } = require("@jscad/modeling").transforms;
const { subtract, union, intersect } = require("@jscad/modeling").booleans;

function main(params) {
  const { length, width, height, wallThickness, insidewallHeight } = params;

  const numColumns = 12; // Number of columns
  const numRows = 6; // Number of rows

  const ux = length / numColumns;
  const uy = width / numRows;

  // Create the outer box
  const outerBox = roundedCuboid({
    center: [0, 0, height / 2],
    size: [length, width, height],
    roundRadius: 0.4,
    segments: 4,
  });

  // Create the inner space (to be subtracted)
  const innerSpace = translate(
    [0, 0, wallThickness + height / 2],
    cuboid({
      size: [length - 2 * wallThickness, width - 2 * wallThickness, height],
    })
  );

  // Subtract the inner space from the outer box
  let box = subtract(outerBox, innerSpace);

  const walls = [
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 0 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 0 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 0 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 0 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 0 },
    ],
    [
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
      { y: 1 },
    ],
  ];

  // Add horizontal dividers
  for (let i = 1; i < walls.length + 1; i++) {
    for (let j = 1; j < walls[i - 1].length + 1; j++) {
      if (walls[i - 1][j - 1].x === 1) {
        const divider = translate(
          [-length / 2 + ux * j + wallThickness / 2, -i * uy + width / 2, 0],
          cuboid({
            center: [
              -ux / 2 - wallThickness / 2,
              0,
              insidewallHeight / 2 + 0.5,
            ],
            size: [ux, wallThickness, insidewallHeight],
          })
        );
        box = union(box, divider);
      }
      if (walls[i - 1][j - 1].y === 1) {
        const divider = translate(
          [-length / 2 + ux * j, -i * uy + width / 2, 0],
          cuboid({
            center: [
              0,
              +uy / 2 - wallThickness / 2 + 0.3,
              insidewallHeight / 2 + 0.5,
            ],
            size: [wallThickness, uy, insidewallHeight],
          })
        );
        box = union(box, divider);
      }
    }
  }

  box = intersect(box, outerBox);
  return box;
}

// Define the parameter definitions
const getParameterDefinitions = () => {
  return [
    {
      name: "length",
      type: "float",
      initial: 10,
      caption: "Total length:",
      min: 10,
      max: 200,
      step: 1,
    },
    {
      name: "width",
      type: "float",
      initial: 10,
      caption: "Total width:",
      min: 10,
      max: 200,
      step: 1,
    },
    {
      name: "height",
      type: "float",
      initial: 10,
      caption: "Total height:",
      min: 1,
      max: 200,
      step: 1,
    },
    {
      name: "wallThickness",
      type: "float",
      initial: 0.8,
      caption: "Wall Thickness:",
      min: 0.8,
      max: 1.6,
      step: 0.4,
    },
    {
      name: "insidewallHeight",
      type: "float",
      initial: 10,
      caption: "Inside Wall Height:",
      min: 1,
      max: 200,
      step: 1,
    },
  ];
};

// Export the main function and parameters
module.exports = { main, getParameterDefinitions };
