// src/scripts/renderer.js
import { prepareRender } from "@jscad/regl-renderer/src/rendering/render.js";
import { geometries } from "@jscad/modeling";
import { cube } from "@jscad/modeling/src/primitives";

document.addEventListener("DOMContentLoaded", function () {
  // Access the canvas element
  const canvas = document.getElementById("renderCanvas");

  // Set up the renderer with the canvas element
  const renderer = prepareRender({
    glOptions: { canvas },
  });

  // Define your geometries (e.g., a cube)
  const cubeGeometry = cube({ size: 10 });

  // Set up the rendering data
  const renderOptions = {
    entities: [
      {
        geometry: cubeGeometry,
        color: [1, 0, 0, 1], // RGBA color
      },
    ],
    camera: {
      position: [25, 25, 25], // Camera position
      target: [0, 0, 0], // Target point
      up: [0, 0, 1], // Up direction
    },
  };

  // Render the geometry once
  prepareRender(renderOptions);
});
