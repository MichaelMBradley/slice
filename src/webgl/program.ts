import { WebGL } from ".";
import { compileFragmentShader, compileVertexShader } from "./shader";
import { clearGLError, flushGLError } from "./error";

/** Creates a shader program using a vertex and fragment shader */
export const compileShaderProgram = (gl: WebGL, vertSource: string, fragSource: string): WebGLProgram => {
	// I considered making a more generic function that accepted a list of shader types and sources to
	// compile together, but WebGL only supports vertex and fragment shaders so there's no point
	clearGLError(gl);

	// Gonna make an executive decision to just not error check `gl.deleteShader()`
	// Error checking is verbose enough as-is and I don't really care if those calls fail anyways
	const program = gl.createProgram();
	if (program) {
		const vertShader = compileVertexShader(gl, vertSource);
		if (vertShader) {
			gl.attachShader(program, vertShader);
			if (!flushGLError(gl)) {
				const fragShader = compileFragmentShader(gl, fragSource);
				if (fragShader) {
					gl.attachShader(program, fragShader);
					if (!flushGLError(gl)) {
						gl.linkProgram(program);
						if (!flushGLError(gl)) {
							// Don't need the shader objects after the program has been linked
							gl.deleteShader(vertShader);
							gl.deleteShader(fragShader);
							return program;
						}
					}
					gl.deleteShader(fragShader);
				} else {
					flushGLError(gl);
				}
			}
			gl.deleteShader(vertShader);
		} else {
			flushGLError(gl);
		}
		gl.deleteProgram(program);
	} else {
		flushGLError(gl);
	}
	throw new Error("Could not compile shader program");
};
