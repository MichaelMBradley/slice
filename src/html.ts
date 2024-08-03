import { WebGL, Canvas } from "./types";

/** Retrieves and verifies the canvas with id `canvas-${idPart}` */
export const getCanvas = (idPart: string): Canvas | null => {
	const id = `canvas-${idPart}`;
	const canvas = document.getElementById(id);
	if (canvas === null) {
		console.error(`Could not find HTML element with ID: "${id}"`);
		return null;
	}
	if (canvas instanceof HTMLCanvasElement) {
		return canvas;
	}
	console.error(`Element with ID "${id} not a canvas`);
	return null;
};

/** Gets the WebGL2 context if available, then tries the WebGL context */
export const getWebGLContext = (canvas: Canvas): WebGL | null => {
	// TODO: Is this really necessary? Do I need WebGL2?
	return canvas.getContext("webgl2") ?? canvas.getContext("webgl");
};
