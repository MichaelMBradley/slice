import vertSource from "./vert.vs";
import fragSource from "./frag.fs";

import { hypercube_array_length, initialize_hypercube, num_hypercube_vertices } from "../logic";

import { getCanvas, getWebGLContext } from "../html/canvas";
import { compileShaderProgram } from "../webgl/program";
import { ContinuousRenderState, startContinuousRender } from "../webgl/renderer";
import { getUniform, setUniform1f, setUniform3f, setUniform4fv } from "../webgl/uniform";
import { createArrayBuffer } from "../webgl/buffer";
import { flushGLError } from "../webgl/error";

const getVertices = (dimensions: number): Float32Array => {
	const vertices = new Float32Array(hypercube_array_length(dimensions));
	initialize_hypercube(dimensions, vertices);
	return vertices;
};

type Colour = [number, number, number];
type PrimaryColour = "Dark" | "Light";
type ColourScheme = {
	[colour in PrimaryColour]: Colour;
};

const otherColour = (colour: PrimaryColour): PrimaryColour => {
	return colour === "Dark" ? "Light" : "Dark";
};

interface HeaderState extends ContinuousRenderState {
	time: number;
	timeLoc: WebGLUniformLocation;
	readonly maxTime: number;
	lines: PrimaryColour;
	readonly scheme: ColourScheme;
}

const drawFunc = (state: HeaderState) => {
	const { gl, program } = state;
	if (state.time > state.maxTime) {
		state.time = 0;
		state.lines = otherColour(state.lines);
		return;
	} else if (state.time === 0) {
		setUniform3f(gl, program, "colour", ...state.scheme[state.lines]);
		gl.clearColor(...state.scheme[otherColour(state.lines)], 1);
	}
	state.time += 1 / state.fps;
	setUniform1f(gl, program, "time", state.time);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, num_hypercube_vertices(12));
};

export const animateHeader = (fps: number): void => {
	const canvas = getCanvas("header");
	const gl = getWebGLContext(canvas);
	const program = compileShaderProgram(gl, vertSource, fragSource);

	gl.useProgram(program);

	setUniform4fv(gl, program, "lerpOffset", new Float32Array([3, 6, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20]));
	setUniform4fv(gl, program, "lerpDuration", new Float32Array([2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]));

	gl.viewport(0, 0, canvas.width, canvas.height);

	const buffer = createArrayBuffer(gl, getVertices(12));
	const array = gl.createVertexArray();
	if (!array) {
		throw new Error("Failed to create a vertex array");
	}
	gl.bindVertexArray(array);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	for (let i = 0; i < 3; ++i) {
		gl.enableVertexAttribArray(i);
		gl.vertexAttribPointer(i, 4, gl.FLOAT, true, 12, i * 4);
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	// gl.bindVertexArray(null);
	flushGLError(gl);

	startContinuousRender(drawFunc, {
		gl,
		program,
		fps,
		time: 0,
		timeLoc: getUniform(gl, program, "time"),
		maxTime: 25,
		lines: "Light",
		scheme: { Dark: [0, 0, 0], Light: [1, 1, 1] },
	});
};
