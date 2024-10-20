const jscad = require("@jscad/modeling");
const { subtract, union } = jscad.booleans;
const { polygon } = jscad.primitives;
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

function main() {
  const outerRadius = 10; // Outer radius of the hexagon
  const wallThickness = 0.8; // Thickness of the hexagon's wall
  const height = 0.2; // Height of the extrusion

  const raftHeight = 0.8;

  const textBold = 0.4;
  const textHeight = 5;

  const anchoSuperficie = 18;

  // Create outer hexagon
  const outerHexagon = polygon({
    points: createHexagon(outerRadius),
  });

  // Create inner hexagon by reducing the outer radius by the wall thickness
  const innerHexagon = polygon({
    points: createHexagon(outerRadius - wallThickness),
  });

  // Subtract inner hexagon from outer hexagon to create the wall
  let hexagonWithWall = subtract(outerHexagon, innerHexagon);
  hexagonWithWall = extrudeLinear({ height: height }, hexagonWithWall);
  hexagonWithWall = translate([0, 0, raftHeight], hexagonWithWall);

  //--------------------------------------- Text -----------------------------
  const name = vectorText(
    { height: textHeight, align: "right", lineSpacing: 2 },
    "boss"
  );

  const segmentToPath = (segment) => {
    return expand(
      { delta: textBold, corners: "round" },
      path2.fromPoints({ close: true }, segment)
    );
  };

  let textName = name.map((segment) => segmentToPath(segment));
  textName = extrudeLinear({ height: height }, textName);
  textName = rotate([0, 0, -(Math.PI * 2) / 4], textName);
  textName = translate([-textHeight / 1.5, -outerRadius, raftHeight], textName);

  // Measure the bounding box of the text to dynamically adjust raft size
  const textBoundingBox = measureBoundingBox(union(textName));
  const textLength = textBoundingBox[1][1] - textBoundingBox[0][1] + 10; // Height/Length of the text

  const number = vectorText({ height: textHeight }, "9");
  let textNumber = number.map((segment) => segmentToPath(segment));
  textNumber = extrudeLinear({ height: height }, textNumber);
  const textNumberBoundingBox = measureBoundingBox(union(textNumber));
  const textNumberLength =
    textNumberBoundingBox[1][0] - textNumberBoundingBox[0][1]; // Height/Length of the text
  console.log(textNumberLength);
  //textNumber = rotate([0, 0, -(Math.PI * 2) / 4], textNumber)
  textNumber = translate(
    [-textNumberLength / 2, -textHeight / 1.5, raftHeight],
    textNumber
  );

  let bigHexagon = polygon({
    points: createHexagon(outerRadius),
  });

  const raft = extrudeLinear(
    { height: raftHeight },
    polygon({
      points: createHexagonRaft(outerRadius, textLength),
    })
  );

  const raftUnion = extrudeLinear(
    { height: -anchoSuperficie },
    polygon({
      points: createHexagonUnion(outerRadius),
    })
  );

  const raftBottom = translate(
    [0, 0, -anchoSuperficie - raftHeight],
    extrudeLinear(
      { height: raftHeight },
      polygon({
        points: createHexagonRaft(outerRadius, textLength),
      })
    )
  );

  let finalShape = union(
    colorize([0.6, 0, 0], [hexagonWithWall, textName, textNumber]),
    colorize([1, 1, 1], [raft, raftUnion, raftBottom])
  );
  finalShape = rotate([0, -(Math.PI * 2) / 4, 0], finalShape);
  finalShape = translate([0, 0, outerRadius], finalShape);

  return [
    finalShape,
    //colorize([0.6, 0, 0], [hexagonWithWall, textName, textNumber]),
    //colorize([1, 1, 1], [raft,raftUnion,raftBottom]),
  ];
}

// Helper function to create hexagon points
function createHexagon(radius) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

function createHexagonRaft(radius, width) {
  const points = [];
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  for (let i = 3; i < 7; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) - width;
    points.push([x, y]);
  }
  return points;
}

function createHexagonUnion(radius) {
  const points = [];
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees for each corner
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  let angle = (Math.PI / 3) * 3; // 60 degrees for each corner
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle) - radius;
  points.push([x, y]);

  angle = (Math.PI / 3) * 6; // 60 degrees for each corner
  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle) - radius;
  points.push([x, y]);

  return points;
}

module.exports = { main };
