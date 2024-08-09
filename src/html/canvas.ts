import { WebGL } from "../webgl";

export type Canvas = HTMLCanvasElement;

/** Retrieves and verifies the canvas with id `canvas-${idPart}` */
export const getCanvas = (idPart: string): Canvas => {
	const id = `canvas-${idPart}`;
	const canvas = document.getElementById(id);
	if (canvas === null) {
		throw new Error(`Could not find HTML element with ID: "${id}"`);
	}
	if (canvas instanceof HTMLCanvasElement) {
		return canvas;
	}
	throw new Error(`Element with ID "${id} not a canvas`);
};

/** Gets the WebGL2 context if available, then tries the WebGL context */
export const getWebGLContext = (canvas: Canvas): WebGL => {
	const gl = canvas.getContext("webgl2");
	if (!gl) {
		throw new Error("Could not get a WebGL2 context");
	}
	return gl;
};
