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

const nozleDiameter = 0.4;
const layerHeight = 0.2;

const texto = "Enemigo";
const numero = "2";

const anchoSuperficie = 18; //grosor de la madera/carton

let magnetWidth = 10; //Tamaño del iman diametro
let magnetHeight = 3+3; //Grosor del iman

magnetWidth += 1.4;  //añadimons tolerancias de seguridad
magnetHeight += 0.4; //añadimons tolerancias de seguridad

const totalWidth = magnetWidth  + 2 * nozleDiameter * 2; //11.4 + 1.6 = 13
const TotalHeight = magnetHeight + 2 * layerHeight * 4;  //3.4+0.8 = 4.2

//const outerRadius = totalWidth/2; // Outer radius of the hexagon
const raftHeight = 1.2; // Height of the extrusion

const squareThickness = 1.5; // Thickness of the hexagon's wall
const textBold = 0.4;
const textWidth = totalWidth/2 / 1.5;
const textHeight = 0.5;

module.exports = { main };

function main() {
  const enemigo = iniciativa();

  let veneno = efecto();
  veneno = translate([0,-TotalHeight-5,0],veneno);
  
  return union(veneno,enemigo);
}

// efectos
function efecto() {

  let magnetHole = createMagnetHole(magnetWidth,magnetHeight,totalWidth,TotalHeight,anchoSuperficie-raftHeight/2);

  const cube = cuboid({size: [anchoSuperficie+raftHeight/2,TotalHeight, totalWidth],
                      center: [0,-TotalHeight,0]
                      });
  
  let raftTop = createArrow(totalWidth/2, TotalHeight,raftHeight+raftHeight/2);
  raftTop = rotate([Math.PI / 2, 0,Math.PI / 2], raftTop);
  raftTop = translate([anchoSuperficie/2 + raftHeight/2,TotalHeight/2,0], raftTop);
  
  let raftBottom = createArrow(totalWidth/2, TotalHeight,raftHeight+raftHeight/2);
  raftBottom = rotate([Math.PI / 2, 0,Math.PI / 2], raftBottom);
  raftBottom = translate([-anchoSuperficie/2 - raftHeight/2,TotalHeight/2,0], raftBottom);

  let effect = union( magnetHole, raftBottom,raftTop);
  effect = subtract(effect,cube)
  effect = colorize([0.5,0,0,0.95],effect)
  return [effect];
}

function createArrow(radius,width, height) {
  const points = [];

  radius /= Math.cos(Math.PI / 6);
  width = width-radius;
  width /= 2;  

  let angle = (Math.PI / 3) * 0; // 60 degrees for each corner
  let x = 0 + width;
  let y = 0;
  points.push([x, y]);

  angle = (Math.PI / 3) * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle) + width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 2; // 60 degrees for each corner
  x = radius * Math.cos(angle)- width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 3;
  x = radius * Math.cos(angle)- width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 4;
  x = radius * Math.cos(angle)- width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 5;
  x = radius * Math.cos(angle)+ width;
  y = radius * Math.sin(angle);
  points.push([x, y]);


  let arrow = extrudeLinear(
    { height: height },
    polygon({
      points: points,
    })
  );

  arrow = translate([-radius/2-width,0,-height/2], arrow);

  return arrow;
}

function createMagnetHole(magnetWidth,magnetHeight,totalWidth,TotalHeight,anchoSuperficie) {
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
    size: [magnetWidth / 4, magnetWidth / 4, magnetHeight],
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
  let raftTop = createRaft(numero, texto);
  raftTop = rotate([Math.PI / 2,0 , Math.PI / 2], raftTop);
  raftTop = translate([anchoSuperficie/2,0 , 0], raftTop);

  let raftBottom = createRaft(numero, texto);
  raftBottom = rotate([-Math.PI / 2,0 , Math.PI / 2], raftBottom);
  raftBottom = translate([-anchoSuperficie/2,0 , 0], raftBottom);

  let magnetEntrance = createMagnetHole(magnetWidth,magnetHeight,totalWidth,TotalHeight, anchoSuperficie);

  const cube = cuboid({size: [anchoSuperficie+raftHeight/2,TotalHeight, totalWidth],
                      center: [0,-TotalHeight,0]
                      });
  let shape = union(magnetEntrance,raftTop,raftBottom);
  shape = subtract(shape,cube);

  return [shape];
}

function createHexagon(radius, width, height) {
  const points = [];


  radius /= Math.cos(Math.PI / 6);
  width = width-radius;
  width /= 2;  


  let angle = (Math.PI / 3) * 0; // 60 degrees for each corner
  let x = radius * Math.cos(angle) + width;
  let y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle) + width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 2; // 60 degrees for each corner
  x = radius * Math.cos(angle) - width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 3;
  x = radius * Math.cos(angle) - width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 4;
  x = radius * Math.cos(angle) - width;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 5;
  x = radius * Math.cos(angle) + width;
  y = radius * Math.sin(angle);
  points.push([x, y]);


  let hexagon = extrudeLinear(
    { height: height },
    polygon({
      points: points
    }),
  );
  
  return hexagon;
}

function createRaft(numero, text) {


  //--------------------------------------- Text -----------------------------

  let textName = drawText(texto, textWidth);
  textName = extrudeLinear({ height: textHeight }, textName);
  textName = colorize([1,0,0],textName);
  //textName = rotate([0, 0, -(Math.PI * 2) / 4], textName);
  textName = translate(
    [textWidth*2, -totalWidth/2 / 2, raftHeight],
    textName
  );

  // Measure the bounding box of the text to dynamically adjust raft size
  const textBoundingBox = measureBoundingBox(union(textName));
  const textLength = textBoundingBox[1][0] - textBoundingBox[0][0]; // Height/Length of the text

  
  let textNumber = drawText(numero, textWidth);
  textNumber = extrudeLinear({ height: textHeight }, textNumber);
  const textNumberBoundingBox = measureBoundingBox(union(textNumber));
  const textNumberLength = textNumberBoundingBox[1][1] - textNumberBoundingBox[0][1]; // Height/Length of the text
  textNumber = rotate([0, 0, (Math.PI * 2) / 4], textNumber)
  textNumber = translate(
    [textNumberLength / 2, -3.3, raftHeight],
    textNumber
  );

  textNumber = colorize([1,0,0],textNumber);


  //--------  Base Raft ----- Shapes, no text -----

  let outerHexagon = createHexagon(totalWidth/2, TotalHeight, textHeight);
  let innerHexagon = createHexagon(totalWidth/2 - squareThickness, TotalHeight-squareThickness, textHeight);

  // Subtract inner hexagon from outer hexagon to create the wall
  let hexagonWithWall = subtract(outerHexagon, innerHexagon);
  hexagonWithWall = translate([0,0,raftHeight],hexagonWithWall);


  let raft = createHexagon(totalWidth/2, textLength + totalWidth/2+TotalHeight, raftHeight);
  raft = translate([(textLength+ totalWidth/2)/2,0,0],raft);
  //const ret = union(hexagonWithWall, textNumber, raft);
  
  return [textName,hexagonWithWall,raft,textNumber];
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
