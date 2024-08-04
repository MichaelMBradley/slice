import vertSource from "./vert.vs?raw";
import fragSource from "./frag.fs?raw";

import { hypercube_array_length, initialize_hypercube } from "logic";

import { getCanvas, getWebGLContext } from "../html/canvas";
import { compileShaderProgram } from "../webgl/program";
import { BaseRenderState, ContinuousRenderState, startContinuousRender } from "../webgl/renderer";

const getVertices = (dimensions: number): Float32Array => {
	let vertices = new Float32Array(hypercube_array_length(dimensions));
	initialize_hypercube(dimensions, vertices);
	return vertices;
};

type Colour = [number, number, number];
type PrimaryColour = "Dark" | "Light";
type ColourScheme = {
	[colour in PrimaryColour]: Colour;
};

type HeaderState = ContinuousRenderState<BaseRenderState> & {
	time: number;
	lines: PrimaryColour;
	readonly scheme: ColourScheme;
};

const drawFunc = (state: HeaderState) => {
	const gl = state.gl;
	state.time += 1 / state.fps;

	gl.clear(gl.COLOR_BUFFER_BIT);
};

export const animateHeader = (fps: number): void => {
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

	const vertices = getVertices(12);
	console.log(vertices);

	startContinuousRender(drawFunc, {
		gl,
		fps,
		scheme: { Dark: [0, 0, 0], Light: [1, 1, 1] },
		time: 0,
		lines: "Light",
	});
};
