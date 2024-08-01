import init, { rust_greet, rust_init } from "logic";

import vertSource from "/public/vert.vs?raw";
import fragSource from "/public/frag.fs?raw";

// Start initializing immediately
const initialized = init();

const main = () => {
	rust_init();
	rust_greet();

	const canvas = document.getElementById("canvas-header") as HTMLCanvasElement | null;
	if (!canvas) {
		return console.log("Could not find header canvas");
	}
	const gl2 = canvas.getContext("webgl2");
	if (!gl2) {
		return console.log("Could not get WebGL2 context");
	}

	const vertexShader = gl2.createShader(gl2.VERTEX_SHADER);
	if (!vertexShader) {
		return console.log("Could not create vertex shader");
	}
	gl2.shaderSource(vertexShader, vertSource);
	gl2.compileShader(vertexShader);

	const fragShader = gl2.createShader(gl2.FRAGMENT_SHADER);
	if (!fragShader) {
		return console.log("Could not create fragment shader");
	}
	gl2.shaderSource(fragShader, fragSource);
	gl2.compileShader(fragShader);

	const shaderProgram = gl2.createProgram();
	if (!shaderProgram) {
		return console.log("Could not create shader program");
	}
	gl2.attachShader(shaderProgram, vertexShader);
	gl2.attachShader(shaderProgram, fragShader);
	gl2.linkProgram(shaderProgram);
	gl2.useProgram(shaderProgram);

	gl2.viewport(0, 0, canvas.width, canvas.height);
	gl2.clearColor(0, 0, 0, 1);
	gl2.clear(gl2.COLOR_BUFFER_BIT);
};

// As soon as the page load is done and initialization is complete, run the main function
document.addEventListener("DOMContentLoaded", () => {
	Promise.all([initialized]).then(() => main());
});
