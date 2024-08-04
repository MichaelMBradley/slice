import vertSource from "./vert.vs?raw";
import fragSource from "./frag.fs?raw";

import { getCanvas, getWebGLContext } from "../html";
import { hypercube_array_length, initialize_hypercube } from "logic";
import { compileShaderProgram } from "../program";

const getVertices = (dimensions: number): Float32Array => {
	let vertices = new Float32Array(hypercube_array_length(dimensions));
	initialize_hypercube(dimensions, vertices);
	return vertices;
};

export const animateHeader = (): void => {
	const canvas = getCanvas("header");
	if (!canvas) {
		return console.error("Could not find the header canvas");
	}

	const gl = getWebGLContext(canvas);
	if (!gl) {
		return console.error("Could not get a WebGL context");
	}

	const shaderProgram = compileShaderProgram(gl, vertSource, fragSource);
	if (!shaderProgram) {
		return console.error("Could not create a shader program");
	}
	gl.useProgram(shaderProgram);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	console.log(getVertices(12));
};
