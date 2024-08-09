import { WebGL } from ".";
import { clearGLError, flushGLError } from "./error";

const createBuffer = (gl: WebGL, type: GLenum, data: Float32Array): WebGLBuffer => {
	const buffer = gl.createBuffer();
	if (!buffer) {
		throw new Error("Could not allocate buffer");
	}
	clearGLError(gl);
	gl.bindBuffer(type, buffer);
	gl.bufferData(type, data, gl.STATIC_DRAW);
	gl.bindBuffer(type, null);
	if (flushGLError(gl)) {
		gl.deleteBuffer(buffer);
		throw new Error("Could not set up buffer");
	}
	return buffer;
};

export const createArrayBuffer = (gl: WebGL, data: Float32Array): WebGLBuffer => {
	return createBuffer(gl, gl.ARRAY_BUFFER, data);
};
