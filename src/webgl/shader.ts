import { WebGL } from ".";
import { clearGLError, flushGLError } from "./error";

/** Creates a shader object using the given source code */
const compileShader = (gl: WebGL, type: GLenum, source: string): WebGLShader | null => {
	clearGLError(gl);

	const shader = gl.createShader(type);
	if (!shader) {
		flushGLError(gl);
		return null;
	}

	gl.shaderSource(shader, source);
	if (flushGLError(gl)) {
		gl.deleteShader(shader);
		return null;
	}

	gl.compileShader(shader);
	if (flushGLError(gl)) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
};

/** Creates a vertex shader object using the given source code */
export const compileVertexShader = (gl: WebGL, source: string): WebGLShader | null => {
	return compileShader(gl, gl.VERTEX_SHADER, source);
};

/** Creates a fragment shader object using the given source code */
export const compileFragmentShader = (gl: WebGL, source: string): WebGLShader | null => {
	return compileShader(gl, gl.FRAGMENT_SHADER, source);
};
