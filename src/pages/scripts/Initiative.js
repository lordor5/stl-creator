const jscad = require("@jscad/modeling");
const { subtract, union } = jscad.booleans;
const { polygon, cylinder, cuboid } = jscad.primitives;
const { extrudeLinear } = require("@jscad/modeling").extrusions;
const { translate, rotate, translateZ } = require("@jscad/modeling").transforms;
const { colorize } = jscad.colors;
const { vectorText } = require("@jscad/modeling").text;
const { path2 } = require("@jscad/modeling").geometries;
const { expand } = require("@jscad/modeling").expansions;
const { measureBoundingBox } = require("@jscad/modeling").measurements;

// inpiracion
// https://www.etsy.com/listing/1527787822/dd-dm-screen-custom-initiative-tracker
// https://www.thingiverse.com/thing:3859240/files
// https://www.thingiverse.com/thing:4057843
// https://www.thingiverse.com/thing:4703189/files

//import customFont from "../../vector/CustomFont.js";

const texto = "Enemgo";
const numero = "1";

const outerRadius = 5; // Outer radius of the hexagon
const raftHeight = 1.2; // Height of the extrusion

const squareThickness = 1.5; // Thickness of the hexagon's wall
const textBold = 0.4;
const textWidth = outerRadius / 1.5;
const textHeight = 0.5;

const anchoSuperficie = 18; //grosor de la madera/carton

const magnetWidth = 10 + 1.4;
const magnetHeight = 3 + 0.4;

module.exports = { main };

function main() {
  const enemigo = iniciativa();

  const Veneno = efecto();

  console.log("bounding box: ", measureBoundingBox(Veneno));
  return [Veneno, enemigo];
}

// efectos
function efecto() {
  let raftBottom = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(outerRadius + 0.4 * 2 * 4, magnetHeight + 0.2 * 4),
    })
  );

  let magnetHole = createMagnetHole();
  magnetHole = rotate([0, Math.PI / 2, 0], magnetHole);
  magnetHole = translate(
    [0, 0, outerRadius + 0.4 * 4 + raftHeight],
    magnetHole
  );

  let raftTop = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(outerRadius + 0.4 * 2 * 4, magnetHeight + 0.2 * 4),
    })
  );
  raftTop = translateZ(outerRadius * 2 + 0.4 * 2 * 4 + raftHeight, raftTop);

  let effect = union(raftTop, magnetHole, raftBottom);
  effect = rotate([Math.PI / 2, 0, 0], effect);
  effect = translate(
    [0, outerRadius + 0.4 * 4 + raftHeight, outerRadius + 0.4 * 4],
    effect
  );

  return effect;
}

function createArrow(radius, height) {
  const points = [];

  let angle = (Math.PI / 3) * 0; // 60 degrees for each corner
  let x = height / 2;
  let y = 0;
  points.push([x, y]);

  angle = (Math.PI / 3) * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle) + height / 2;
  y = radius * Math.sin(angle) - 0.5;
  points.push([x, y]);

  angle = (Math.PI / 3) * 2; // 60 degrees for each corner
  x = radius * Math.cos(angle) + height / 2 - 0.1;
  y = radius * Math.sin(angle) - 0.5;
  points.push([x, y]);

  angle = (Math.PI / 3) * 3;
  x = radius * Math.cos(angle) + height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 4;
  x = radius * Math.cos(angle) + height / 2 - 0.1;
  y = radius * Math.sin(angle) + 0.5;
  points.push([x, y]);

  angle = (Math.PI / 3) * 5;
  x = radius * Math.cos(angle) + height / 2;
  y = radius * Math.sin(angle) + 0.5;
  points.push([x, y]);

  return points;
}

function createMagnetHole() {
  let raftUnion = cuboid({
    size: [
      outerRadius * 2 + 0.4 * 2 * 4,
      outerRadius * 2 + 0.4 * 2 * 4,
      magnetHeight + 0.2 * 4,
    ],
  });

  let magnetEntrance = cuboid({
    size: [magnetWidth, magnetWidth, magnetHeight],
    center: [0, magnetWidth / 1.35, 0],
  });

  //Make a second hole to be able to take out the magenet
  let magnetExtractor = cuboid({
    size: [magnetWidth / 3, magnetWidth / 3, magnetHeight],
    center: [0, -magnetWidth / 2, 0],
  });

  let magnet = cylinder({
    height: magnetHeight,
    radius: magnetWidth / 2,
    segments: 100,
  });

  magnet = union(magnet, magnetEntrance, magnetExtractor);
  raftUnion = subtract(raftUnion, magnet);

  return [raftUnion];
}

//Iniciativa
function iniciativa() {
  const raftTop = createRaft(numero, texto);

  let raftUnion = extrudeLinear(
    { height: -anchoSuperficie },
    polygon({
      points: createHexagonUnion(outerRadius),
    })
  );

  let magnetEntrance = cuboid({
    center: [0, -magnetHeight / 2, magnetWidth / 1.3],
    size: [magnetWidth, magnetHeight, magnetWidth],
  });
  let magnet = cylinder({
    center: [0, 0, magnetHeight / 2],
    height: magnetHeight,
    radius: magnetWidth / 2,
    segments: 100,
  });
  magnet = rotate([Math.PI / 2, 0, 0], magnet);
  magnet = union(magnet, magnetEntrance);
  magnet = translate(
    [anchoSuperficie / 2, -outerRadius / 2 + magnetHeight / 1.8],
    magnet
  ); //-outerRadius/10
  magnet = rotate([0, Math.PI / 2, 0], magnet);

  raftUnion = subtract(raftUnion, magnet);

  let raftBottom = createRaft(numero, texto);
  raftBottom = rotate([Math.PI / 100, -Math.PI, 0], raftBottom);
  raftBottom = translate([0, 0, -anchoSuperficie], raftBottom);

  let finalShape = union(raftTop, raftUnion, raftBottom);
  finalShape = rotate([0, -(Math.PI * 2) / 4, 0], finalShape);
  finalShape = translate([-anchoSuperficie / 2, 20, outerRadius], finalShape);

  return [finalShape];
}

function createHexagonRaft(radius, width) {
  const points = [];
  for (let i = 0; i <= 2; i++) {
    const angle = (Math.PI / 2) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  for (let i = 2; i <= 4; i++) {
    const angle = (Math.PI / 2) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) - width;
    points.push([x, y]);
  }
  return points;
}

function createHexagonUnion(radius) {
  const points = [];

  let angle = Math.PI * 2; // 60 degrees for each corner
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = Math.PI * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = Math.PI * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) - radius;
  points.push([x, y]);

  angle = Math.PI * 2;
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) - radius;
  points.push([x, y]);

  return points;
}

function createRaft(numero, text) {
  // Create outer hexagon
  const outerHexagon = polygon({
    points: createHexagonRaft(outerRadius, outerRadius),
  });

  // Create inner hexagon by reducing the outer radius by the wall thickness
  const innerHexagon = polygon({
    points: createHexagonRaft(outerRadius - squareThickness, outerRadius),
  });

  // Subtract inner hexagon from outer hexagon to create the wall
  let hexagonWithWall = subtract(outerHexagon, innerHexagon);
  hexagonWithWall = extrudeLinear({ height: textHeight }, hexagonWithWall);
  hexagonWithWall = translate([0, 0, raftHeight], hexagonWithWall);

  //--------------------------------------- Text -----------------------------

  let textName = drawText(texto, textWidth);
  textName = extrudeLinear({ height: textHeight }, textName);
  textName = rotate([0, 0, -(Math.PI * 2) / 4], textName);
  textName = translate(
    [-textWidth / 1.5, -outerRadius * 2, raftHeight],
    textName
  );

  // Measure the bounding box of the text to dynamically adjust raft size
  const textBoundingBox = measureBoundingBox(union(textName));
  const textLength = textBoundingBox[1][1] - textBoundingBox[0][1] + 10; // Height/Length of the text

  let textNumber = drawText(numero, textWidth);
  textNumber = extrudeLinear({ height: textHeight }, textNumber);
  const textNumberBoundingBox = measureBoundingBox(union(textNumber));
  const textNumberLength =
    textNumberBoundingBox[1][0] - textNumberBoundingBox[0][1]; // Height/Length of the text
  //textNumber = rotate([0, 0, -(Math.PI * 2) / 4], textNumber)
  textNumber = translate(
    [-textNumberLength / 2, -textWidth / 1.3 - outerRadius / 2, raftHeight],
    textNumber
  );
  if (textNumberLength > outerRadius) {
    textNumber = drawText(numero, textWidth / 1.5);
    textNumber = extrudeLinear({ height: textHeight }, textNumber);
    const textNumberBoundingBox = measureBoundingBox(union(textNumber));
    const textNumberLength =
      textNumberBoundingBox[1][0] - textNumberBoundingBox[0][1]; // Height/Length of the text
    //textNumber = rotate([0, 0, -(Math.PI * 2) / 4], textNumber)
    textNumber = translate(
      [-textNumberLength / 2, -textWidth / 2 - outerRadius / 2, raftHeight],
      textNumber
    );
  }

  const raft = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createHexagonRaft(outerRadius, textLength + outerRadius),
    })
  );
  return union(hexagonWithWall, textName, textNumber, raft);
}

function drawText(text, size) {
  const name = vectorText(
    { height: size, align: "right", lineSpacing: 2 /*font: customFont*/ },
    text
  );

  const segmentToPath = (segment) => {
    return expand(
      { delta: textBold, corners: "round" },
      path2.fromPoints({ close: true }, segment)
    );
  };

  return name.map((segment) => segmentToPath(segment));
}
