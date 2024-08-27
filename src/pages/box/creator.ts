import pkg1 from "@jscad/modeling/src/primitives";
const { cuboid, roundedCuboid } = pkg1;

import pkg2 from "@jscad/modeling/src/operations/booleans";
const { subtract, union, intersect } = pkg2;

import pkg3 from "@jscad/io/index";
const { stlSerializer } = pkg3;

import pkg4 from "@jscad/modeling/src/operations/transforms";
const { translate } = pkg4;

import pkg5 from "@jscad/modeling/src/geometries";
const { geom3 } = pkg5;

import type { APIRoute } from "astro";

interface Cordenates {
  x: number;
  y: number;
  n: number;
}

export async function ALL({
  request,
}: {
  request: Request;
}): Promise<APIRoute> {
  const body = await request;

  const numColumns = 12; // Number of columns
  const numRows = 18; // Number of rows
  let walls: Array<Array<Cordenates>> = [];

  // const data = await request.formData();
  // for (let i = 0; i < numRows; i++) {
  //   for (let j = 0; j < numColumns; j++) {
  //     walls[i][j].x = data.get(`${walls[i][j].n}y`) ? 1 : 0;
  //     walls[i][j].y = data.get(`${walls[i][j].n}x`) ? 1 : 0;
  //   }
  // }

  walls = [
    [
      { x: 0, y: 0, n: 0 },
      { x: 1, y: 0, n: 1 },
      { x: 0, y: 0, n: 2 },
      { x: 1, y: 0, n: 3 },
      { x: 0, y: 0, n: 4 },
      { x: 1, y: 0, n: 5 },
      { x: 0, y: 0, n: 6 },
      { x: 1, y: 0, n: 7 },
      { x: 0, y: 0, n: 8 },
      { x: 1, y: 0, n: 9 },
      { x: 0, y: 0, n: 10 },
      { x: 1, y: 0, n: 11 },
    ],
    [
      { x: 0, y: 1, n: 12 },
      { x: 1, y: 1, n: 13 },
      { x: 0, y: 1, n: 14 },
      { x: 1, y: 1, n: 15 },
      { x: 0, y: 1, n: 16 },
      { x: 1, y: 1, n: 17 },
      { x: 0, y: 1, n: 18 },
      { x: 1, y: 1, n: 19 },
      { x: 0, y: 1, n: 20 },
      { x: 1, y: 1, n: 21 },
      { x: 0, y: 1, n: 22 },
      { x: 1, y: 1, n: 23 },
    ],
    [
      { x: 0, y: 0, n: 24 },
      { x: 1, y: 0, n: 25 },
      { x: 0, y: 0, n: 26 },
      { x: 1, y: 0, n: 27 },
      { x: 0, y: 0, n: 28 },
      { x: 1, y: 0, n: 29 },
      { x: 0, y: 0, n: 30 },
      { x: 1, y: 0, n: 31 },
      { x: 0, y: 0, n: 32 },
      { x: 1, y: 0, n: 33 },
      { x: 0, y: 0, n: 34 },
      { x: 1, y: 0, n: 35 },
    ],
    [
      { x: 0, y: 1, n: 36 },
      { x: 1, y: 1, n: 37 },
      { x: 0, y: 1, n: 38 },
      { x: 1, y: 1, n: 39 },
      { x: 0, y: 1, n: 40 },
      { x: 1, y: 1, n: 41 },
      { x: 0, y: 1, n: 42 },
      { x: 1, y: 1, n: 43 },
      { x: 0, y: 1, n: 44 },
      { x: 1, y: 1, n: 45 },
      { x: 0, y: 1, n: 46 },
      { x: 1, y: 1, n: 47 },
    ],
    [
      { x: 0, y: 0, n: 48 },
      { x: 1, y: 0, n: 49 },
      { x: 0, y: 0, n: 50 },
      { x: 1, y: 0, n: 51 },
      { x: 0, y: 0, n: 52 },
      { x: 1, y: 0, n: 53 },
      { x: 0, y: 0, n: 54 },
      { x: 1, y: 0, n: 55 },
      { x: 0, y: 0, n: 56 },
      { x: 1, y: 0, n: 57 },
      { x: 0, y: 0, n: 58 },
      { x: 1, y: 0, n: 59 },
    ],
    [
      { x: 0, y: 1, n: 60 },
      { x: 1, y: 1, n: 61 },
      { x: 0, y: 1, n: 62 },
      { x: 1, y: 1, n: 63 },
      { x: 0, y: 1, n: 64 },
      { x: 1, y: 1, n: 65 },
      { x: 0, y: 1, n: 66 },
      { x: 1, y: 1, n: 67 },
      { x: 0, y: 1, n: 68 },
      { x: 1, y: 1, n: 69 },
      { x: 0, y: 1, n: 70 },
      { x: 1, y: 1, n: 71 },
    ],
    [
      { x: 0, y: 0, n: 72 },
      { x: 1, y: 0, n: 73 },
      { x: 0, y: 0, n: 74 },
      { x: 1, y: 0, n: 75 },
      { x: 0, y: 0, n: 76 },
      { x: 1, y: 0, n: 77 },
      { x: 0, y: 0, n: 78 },
      { x: 1, y: 0, n: 79 },
      { x: 0, y: 0, n: 80 },
      { x: 1, y: 0, n: 81 },
      { x: 0, y: 0, n: 82 },
      { x: 1, y: 0, n: 83 },
    ],
    [
      { x: 0, y: 1, n: 84 },
      { x: 1, y: 1, n: 85 },
      { x: 0, y: 1, n: 86 },
      { x: 1, y: 1, n: 87 },
      { x: 0, y: 1, n: 88 },
      { x: 1, y: 1, n: 89 },
      { x: 0, y: 1, n: 90 },
      { x: 1, y: 1, n: 91 },
      { x: 0, y: 1, n: 92 },
      { x: 1, y: 1, n: 93 },
      { x: 0, y: 1, n: 94 },
      { x: 1, y: 1, n: 95 },
    ],
    [
      { x: 0, y: 0, n: 96 },
      { x: 1, y: 0, n: 97 },
      { x: 0, y: 0, n: 98 },
      { x: 1, y: 0, n: 99 },
      { x: 0, y: 0, n: 100 },
      { x: 1, y: 0, n: 101 },
      { x: 0, y: 0, n: 102 },
      { x: 1, y: 0, n: 103 },
      { x: 0, y: 0, n: 104 },
      { x: 1, y: 0, n: 105 },
      { x: 0, y: 0, n: 106 },
      { x: 1, y: 0, n: 107 },
    ],
    [
      { x: 0, y: 1, n: 108 },
      { x: 1, y: 1, n: 109 },
      { x: 0, y: 1, n: 110 },
      { x: 1, y: 1, n: 111 },
      { x: 0, y: 1, n: 112 },
      { x: 1, y: 1, n: 113 },
      { x: 0, y: 1, n: 114 },
      { x: 1, y: 1, n: 115 },
      { x: 0, y: 1, n: 116 },
      { x: 1, y: 1, n: 117 },
      { x: 0, y: 1, n: 118 },
      { x: 1, y: 1, n: 119 },
    ],
    [
      { x: 0, y: 0, n: 120 },
      { x: 1, y: 0, n: 121 },
      { x: 0, y: 0, n: 122 },
      { x: 1, y: 0, n: 123 },
      { x: 0, y: 0, n: 124 },
      { x: 1, y: 0, n: 125 },
      { x: 0, y: 0, n: 126 },
      { x: 1, y: 0, n: 127 },
      { x: 0, y: 0, n: 128 },
      { x: 1, y: 0, n: 129 },
      { x: 0, y: 0, n: 130 },
      { x: 1, y: 0, n: 131 },
    ],
    [
      { x: 0, y: 1, n: 132 },
      { x: 1, y: 1, n: 133 },
      { x: 0, y: 1, n: 134 },
      { x: 1, y: 1, n: 135 },
      { x: 0, y: 1, n: 136 },
      { x: 1, y: 1, n: 137 },
      { x: 0, y: 1, n: 138 },
      { x: 1, y: 1, n: 139 },
      { x: 0, y: 1, n: 140 },
      { x: 1, y: 1, n: 141 },
      { x: 0, y: 1, n: 142 },
      { x: 1, y: 1, n: 143 },
    ],
    [
      { x: 0, y: 0, n: 144 },
      { x: 1, y: 0, n: 145 },
      { x: 0, y: 0, n: 146 },
      { x: 1, y: 0, n: 147 },
      { x: 0, y: 0, n: 148 },
      { x: 1, y: 0, n: 149 },
      { x: 0, y: 0, n: 150 },
      { x: 1, y: 0, n: 151 },
      { x: 0, y: 0, n: 152 },
      { x: 1, y: 0, n: 153 },
      { x: 0, y: 0, n: 154 },
      { x: 1, y: 0, n: 155 },
    ],
    [
      { x: 0, y: 1, n: 156 },
      { x: 1, y: 1, n: 157 },
      { x: 0, y: 1, n: 158 },
      { x: 1, y: 1, n: 159 },
      { x: 0, y: 1, n: 160 },
      { x: 1, y: 1, n: 161 },
      { x: 0, y: 1, n: 162 },
      { x: 1, y: 1, n: 163 },
      { x: 0, y: 1, n: 164 },
      { x: 1, y: 1, n: 165 },
      { x: 0, y: 1, n: 166 },
      { x: 1, y: 1, n: 167 },
    ],
    [
      { x: 0, y: 0, n: 168 },
      { x: 1, y: 0, n: 169 },
      { x: 0, y: 0, n: 170 },
      { x: 1, y: 0, n: 171 },
      { x: 0, y: 0, n: 172 },
      { x: 1, y: 0, n: 173 },
      { x: 0, y: 0, n: 174 },
      { x: 1, y: 0, n: 175 },
      { x: 0, y: 0, n: 176 },
      { x: 1, y: 0, n: 177 },
      { x: 0, y: 0, n: 178 },
      { x: 1, y: 0, n: 179 },
    ],
    [
      { x: 0, y: 1, n: 180 },
      { x: 1, y: 1, n: 181 },
      { x: 0, y: 1, n: 182 },
      { x: 1, y: 1, n: 183 },
      { x: 0, y: 1, n: 184 },
      { x: 1, y: 1, n: 185 },
      { x: 0, y: 1, n: 186 },
      { x: 1, y: 1, n: 187 },
      { x: 0, y: 1, n: 188 },
      { x: 1, y: 1, n: 189 },
      { x: 0, y: 1, n: 190 },
      { x: 1, y: 1, n: 191 },
    ],
    [
      { x: 0, y: 0, n: 192 },
      { x: 1, y: 0, n: 193 },
      { x: 0, y: 0, n: 194 },
      { x: 1, y: 0, n: 195 },
      { x: 0, y: 0, n: 196 },
      { x: 1, y: 0, n: 197 },
      { x: 0, y: 0, n: 198 },
      { x: 1, y: 0, n: 199 },
      { x: 0, y: 0, n: 200 },
      { x: 1, y: 0, n: 201 },
      { x: 0, y: 0, n: 202 },
      { x: 1, y: 0, n: 203 },
    ],
    [
      { x: 0, y: 1, n: 204 },
      { x: 1, y: 1, n: 205 },
      { x: 0, y: 1, n: 206 },
      { x: 1, y: 1, n: 207 },
      { x: 0, y: 1, n: 208 },
      { x: 1, y: 1, n: 209 },
      { x: 0, y: 1, n: 210 },
      { x: 1, y: 1, n: 211 },
      { x: 0, y: 1, n: 212 },
      { x: 1, y: 1, n: 213 },
      { x: 0, y: 1, n: 214 },
      { x: 1, y: 1, n: 215 },
    ],
  ];

  const length = 50;
  const width = 48;
  const height = 5.5;
  const wallThickness = 0.8;
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
      "Content-Disposition": 'attachment; filename="model.stl"',
    },
  });
}
