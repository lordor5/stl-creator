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

//import customFont from "../../vector/CustomFont.js";

const texto = "Enemy";
const numero = "2";
const outerRadius = 5; // Outer radius of the hexagon
// Height of the extrusion
const raftHeight = 1.2;

const squareThickness = 2; // Thickness of the hexagon's wall
const textBold = 0.7;
const textWidth = outerRadius / 1.2;
const textHeight = 0.5;

const anchoSuperficie = 18;

const magnetWidth = 10 + 1.4;
const magnetHeight = 3 + 0.4;

function main() {
  //const raftTop = createRaft(numero, texto);

  let raftBottom = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(outerRadius, outerRadius),
    })
  );

  let raftTop = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createArrow(magnetWidth / 2, outerRadius),
    })
  );

  let raftUnion = createCubeCentered(outerRadius);

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
    [-anchoSuperficie / 2, outerRadius - magnetHeight],
    magnet
  );
  magnet = rotate([0, Math.PI / 2, 0], magnet);

  raftUnion = subtract(raftUnion, magnet);
  raftUnion = translate([0, 0, raftHeight], raftUnion);
  raftUnion = rotate([0, 0, Math.PI / 2], raftUnion);

  return [raftBottom, raftTop, raftUnion];
}

function createArrow(radius, height) {
  const points = [];

  let angle = (Math.PI / 3) * 0; // 60 degrees for each corner
  let x = height / 2;
  let y = 0;
  points.push([x, y]);

  angle = (Math.PI / 3) * 1; // 60 degrees for each corner
  x = radius * Math.cos(angle) + height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 2; // 60 degrees for each corner
  x = radius * Math.cos(angle) - height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 3;
  x = radius * Math.cos(angle) - height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 4;
  x = radius * Math.cos(angle) - height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  angle = (Math.PI / 3) * 5;
  x = radius * Math.cos(angle) + height / 2;
  y = radius * Math.sin(angle);
  points.push([x, y]);

  return points;
}

function createCubeCentered(radius) {
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

  let cube = extrudeLinear(
    { height: anchoSuperficie },
    polygon({
      points: points,
    })
  );

  cube = translate([0, radius / 2, 0], cube);

  return cube;
}

module.exports = { main };
