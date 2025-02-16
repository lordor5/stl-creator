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

const anchoSuperficie = 18; //grosor de la madera/carton

let magnetWidth = 10; //Tamaño del iman diametro
let magnetHeight = 3; //Grosor del iman

magnetWidth += 1.4;  //añadimons tolerancias de seguridad
magnetHeight += 0.4; //añadimons tolerancias de seguridad

const nozleDiameter = 0.4;
const layerHeight = 0.2;
const totalWidth = magnetWidth  + 2 * nozleDiameter * 2; //11.4 + 1.6 = 13
const TotalHeight = magnetHeight + 2 * layerHeight * 2;  //3.4+0.8 = 4.2

const outerRadius = totalWidth/2; // Outer radius of the hexagon
const raftHeight = 1.2; // Height of the extrusion

const squareThickness = 1.5; // Thickness of the hexagon's wall
const textBold = 0.4;
const textWidth = outerRadius / 1.5;
const textHeight = 0.5;

module.exports = { main };

function main() {
  const enemigo = iniciativa();

  const Veneno = efecto();

  //console.log("bounding box: ", measureBoundingBox(Veneno));
  return [enemigo];
}

// efectos
function efecto() {

  
  let raftBottom = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(totalWidth/2, 0),
    })
  );
  raftBottom = rotate([Math.PI / 2, 0,-Math.PI / 2], raftBottom);
  //raftBottom = translate(
  //  [anchoSuperficie*0, 0, TotalHeight*1.5],
  //  raftBottom
  //);

  let magnetHole = createMagnetHole();
  //magnetHole = translate(
  //  [0, 0, totalWidth/2,0],
  //  magnetHole
  //);

  let raftTop = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(totalWidth/2, TotalHeight),
    })
  );
  
  console.log("bounding box: ", measureBoundingBox(raftBottom));
  //raftTop = translateZ(anchoSuperficie + raftHeight, raftTop);

  let effect = union( magnetHole, raftBottom);
  //effect = rotate([Math.PI / 2, 0, -Math.PI / 2], effect);
  //effect = translate(
  //  [0, 0*outerRadius + 0.4 * 4 + raftHeight, outerRadius + 0.4 * 4],
  //  effect
  //);

  return effect;
}

function createArrow(radius, height) {
  const points = [];

  let angle = (Math.PI / 3) * 0; // 60 degrees for each corner
  let x = 0;
  let y = 0;
  points.push([x, y]);

  angle = (Math.PI / 3) * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 2; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 3;
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 4;
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 5;
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);
  points.push([x, y]);

  return points;
}

function createMagnetHole() {
  let raftUnion = cuboid({
    size: [
      anchoSuperficie,
      TotalHeight,
      totalWidth,
    ],
  });

  let magnetEntrance = cuboid({
    size: [magnetWidth, magnetHeight, magnetWidth],
    center: [0, 0,magnetWidth / 1.32],
  });

  //Make a second hole to be able to take out the magenet
  let magnetExtractor = cuboid({
    size: [magnetWidth / 3, magnetWidth / 3, magnetHeight],
    center: [0, 0,-magnetWidth / 2],
  });

  let magnet = cylinder({
    height: magnetHeight,
    radius: magnetWidth / 2,
    segments: 100,
  });

  magnet = rotate([Math.PI / 2, Math.PI / 2, 0], magnet);
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

  /*
  let magnetEntrance = cuboid({
    center: [0, -magnetHeight / 2, magnetWidth / 1.32],
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

  */
  let magnetEntrance = createMagnetHole();

  let raftBottom = createRaft(numero, texto);
  raftBottom = rotate([/*Math.PI / 100*/0, -Math.PI/2, 0], raftBottom);
  raftBottom = translate([-anchoSuperficie/2, 0, 0], raftBottom);

  let finalShape = union(raftTop, raftUnion, raftBottom);
  //finalShape = rotate([0, -(Math.PI * 2) / 4, 0], finalShape);
  //finalShape = translate([-anchoSuperficie / 2, 20, outerRadius], finalShape);

  return [magnetEntrance,raftBottom];
}

function createHexagonRaft(radius, width, center) {
  const points = [];
  for (let i = 0; i <= 2; i++) {
    const angle = (Math.PI / 2) * i; // 90? degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) + center*width/2;
    points.push([x, y]);
  }
  for (let i = 2; i <= 4; i++) {
    const angle = (Math.PI / 2) * i; // 90? degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) - center*width/2 - width*(!center);
    points.push([x, y]);
  }
  return points;
}

function createHexagonUnion(radius) {
  const points = [];

  let angle = Math.PI * 2; // 60 degrees for each corner
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle) + radius/2;
  points.push([x, y]);

  angle = Math.PI * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) + radius/2;
  points.push([x, y]);

  angle = Math.PI * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) - radius/2;
  points.push([x, y]);

  angle = Math.PI * 2;
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) - radius/2;
  points.push([x, y]);

  return points;
}

function createRaft(numero, text) {
  // Create outer hexagon
  const outerHexagon = polygon({
    points: createHexagonRaft(outerRadius, outerRadius, 1),
  });

  // Create inner hexagon by reducing the outer radius by the wall thickness
  const innerHexagon = polygon({
    points: createHexagonRaft(outerRadius - squareThickness, outerRadius,1),
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
      points: createHexagonRaft(outerRadius, textLength + outerRadius,0),
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
