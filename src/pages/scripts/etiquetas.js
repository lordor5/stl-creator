const jscad = require("@jscad/modeling");
// https://makerworld.com/es/models/687365#profileId-630897
// OpenJSCAD V2 version
const { cuboid } = require("@jscad/modeling").primitives;
const { translate, rotate } = require("@jscad/modeling").transforms;
const { subtract, union } = require("@jscad/modeling").booleans;

function main(params) {
  const drawerThickness = params.drawerThickness;

  // Label dimensions
  const labelWidth = params.width; // Width of the label in mm
  const labelHeight = params.height; // Height of the label slot (can be adjusted)
  const labelThickness = 1; // Thickness of the label slot (to allow easy sliding of paper or plastic)

  // Holder dimensions
  const holderThickness = 2; // Thickness of the walls of the holder
  const holderHeight = labelHeight + holderThickness * 2; // Height of the holder (how far it will extend from the drawer edge)

  // Create the base holder
  const drawer = translate(
    [
      0,
      drawerThickness / 2 + holderThickness,
      holderHeight / 2 - holderThickness / 2,
    ],
    cuboid({
      size: [labelWidth + holderThickness, drawerThickness + 0.4, holderHeight],
    })
  );

  // Create the base holder
  const label = translate(
    [0, labelThickness / 2, labelHeight / 2 + holderThickness],
    cuboid({ size: [labelWidth, labelThickness, labelHeight] })
  );
  const labelFront = translate(
    [0, -labelThickness / 2, labelHeight / 2 + holderThickness],
    cuboid({ size: [labelWidth - 2, labelThickness, labelHeight - 2] })
  );

  const labelSice = union(label, labelFront);

  let labelHolder = translate(
    [
      holderThickness / 2,
      drawerThickness / 2 + holderThickness / 2,
      holderHeight / 2,
    ],
    cuboid({
      size: [labelWidth, drawerThickness + holderThickness * 2, holderHeight],
    })
  );

  // Subtract the label slot and the drawer slot from the holder
  labelHolder = subtract(labelHolder, drawer, labelSice);
  labelHolder = translate(
    [0, 0, labelWidth / 2 + holderThickness / 2],
    rotate([0, (Math.PI * 2) / 4, 0], labelHolder)
  );

  return labelHolder;
}

function getParameterDefinitions() {
  return [
    { name: "width", type: "slider", initial: 30, caption: "Label Width" },
    { name: "height", type: "slider", initial: 10, caption: "Label Height" },
    {
      name: "drawerThickness",
      type: "slider",
      initial: 16,
      caption: "Drawer Thickness",
    },
  ];
}

module.exports = { main, getParameterDefinitions };
