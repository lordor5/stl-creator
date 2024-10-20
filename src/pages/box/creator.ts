import pkg1 from "@jscad/modeling/src/primitives";
const { cuboid, roundedCuboid } = pkg1;

import pkg2 from "@jscad/modeling/src/operations/booleans";
const { subtract, union, intersect } = pkg2;

import pkg3 from "@jscad/io/index";
const { stlSerializer } = pkg3;

import pkg4 from "@jscad/modeling/src/operations/transforms";
const { translate } = pkg4;

interface Cordenates {
  x: number;
  y: number;
  n: number;
}

export async function POST({ request }: { request: Request }) {
  const { walls, data } = await request.json();

  const numColumns = walls[0].length;
  const numRows = walls.length;

  const length = parseFloat(data.length);
  const width = parseFloat(data.width);
  const height = parseFloat(data.height);
  const wallThickness = parseFloat(data.wallThickness);
  const insidewallHeight = height;

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

  // Serialize the model to STL format
  const stlData = stlSerializer.serialize({ binary: false }, box);
  //const geometryData = geom3.toCompactBinary(box);

  return new Response(stlData, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.ms-pkistl", // "application/json",  // STL MIME type
      //"Content-Disposition": 'attachment; filename="model.stl"',
    },
  });
}
