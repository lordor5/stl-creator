const jscad = require("@jscad/modeling");
const { subtract, union } = jscad.booleans;
const { polygon, cylinder, cuboid } = jscad.primitives;
const { extrudeLinear } = require("@jscad/modeling").extrusions;
const { translate, rotate } = require("@jscad/modeling").transforms;
const { colorize } = jscad.colors;
const { vectorText } = require("@jscad/modeling").text;
const { path2 } = require("@jscad/modeling").geometries;
const { expand } = require("@jscad/modeling").expansions;
const { measureBoundingBox } = require("@jscad/modeling").measurements;

// inpiracion
// https://www.etsy.com/listing/1527787822/dd-dm-screen-custom-initiative-tracker?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=initiative+tracker&ref=sr_gallery-1-10&bes=1&sts=1&content_source=b6635dc994eef66aac47a4033c124e3908dfb1ec%253A1527787822&search_preloaded_img=1&organic_search_click=1&variation0=3893915074&variation1=4331951279
// https://www.thingiverse.com/thing:3859240/files
// https://www.thingiverse.com/thing:4057843
// https://www.thingiverse.com/thing:4703189/files

const texto = "Boss";
const numero = "2";
const outerRadius = 5; // Outer radius of the hexagon
// Height of the extrusion
const raftHeight = 1.2;

const squareThickness = 2; // Thickness of the hexagon's wall
const textBold = 0.7;
const textWidth = outerRadius / 1.2;
const textHeight = 0.5;

const anchoSuperficie = 18;

const magnetWidth = 6 + 0.8;
const magnetHeight = 3.5;

function main() {
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
  finalShape = translate([0, 0, outerRadius], finalShape);

  return [finalShape];
}

// Helper function to create hexagon points
function createHexagon(radius) {
  const points = [];
  for (let i = 0; i <= 4; i++) {
    const angle = (Math.PI / 2) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
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
    { height: size, align: "right", lineSpacing: 2 },
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

module.exports = { main };