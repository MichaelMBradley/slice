import { WebGL } from "./types";

/** Returns a string representation of a GL error */
const stringifyGLError = (code: GLenum): string => {
	// For backwards compatibility the codes for WebGL and WebGL2 will realistically all be the same
	// No harm in being thorough though, and will also hopefully be a compiler error if there are any conflicts
	switch (code) {
		case WebGL2RenderingContext.NO_ERROR:
		case WebGLRenderingContext.NO_ERROR:
			return "No error";
		case WebGL2RenderingContext.INVALID_ENUM:
		case WebGLRenderingContext.INVALID_ENUM:
			return "Invalid enum";
		case WebGL2RenderingContext.INVALID_VALUE:
		case WebGLRenderingContext.INVALID_VALUE:
			return "Invalid value";
		case WebGL2RenderingContext.INVALID_OPERATION:
		case WebGLRenderingContext.INVALID_OPERATION:
			return "Invalid operation";
		case WebGL2RenderingContext.INVALID_FRAMEBUFFER_OPERATION:
		case WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION:
			return "Invalid framebuffer operation";
		case WebGL2RenderingContext.OUT_OF_MEMORY:
		case WebGLRenderingContext.OUT_OF_MEMORY:
			return "Out of memory";
		case WebGL2RenderingContext.CONTEXT_LOST_WEBGL:
		case WebGLRenderingContext.CONTEXT_LOST_WEBGL:
			return "Lost the WebGL context";
		// The above are all the codes that can be returned, according to:
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
		default:
			return `WebGL error code "${code}" not recognized`;
	}
};

/** Logs and returns whether there was an active WebGL error */
export const flushGLError = (gl: WebGL): boolean => {
	const error = gl.getError();
	// No error is 0 (falsy)
	if (error) {
		console.error(`WebGL error: ${stringifyGLError(error)}`);
		return true;
	}
	return false;
};

/** Removes the current WebGL error */
export const clearGLError = (gl: WebGL): void => {
	const error = gl.getError();
	// No error is 0 (falsy)
	if (error) {
		console.error(`Unhandled WebGL error: ${stringifyGLError(error)}`);
	}
};
