import { WebGL } from ".";

type ExtendFunction<F extends (...old: any) => unknown, P extends [...new: any], R = void> = (
	...combined: [...Parameters<F>, ...P]
) => R;

type UniformInfoQuery<R = void> = (gl: WebGL, program: WebGLProgram, name: string) => R;
type ExtendUniformInfoQuery<P extends [...new: any], R = void> = ExtendFunction<UniformInfoQuery, P, R>;

type Uniform1fSetter = ExtendUniformInfoQuery<[data: number]>;
type Uniform3fSetter = ExtendUniformInfoQuery<[x: number, y: number, z: number]>;
type UniformFloatVectorSetter = ExtendUniformInfoQuery<[data: Float32Array]>;

export const getUniform: UniformInfoQuery<WebGLUniformLocation> = (gl, program, name) => {
	const location = gl.getUniformLocation(program, name);
	if (!location) {
		throw new Error(`Could not get the location of uniform "${name}"`);
	}
	return location;
};

export const setUniform1f: Uniform1fSetter = (gl, program, name, data) => {
	gl.uniform1f(getUniform(gl, program, name), data);
};

export const setUniform3f: Uniform3fSetter = (gl, program, name, x, y, z) => {
	gl.uniform3f(getUniform(gl, program, name), x, y, z);
};

export const setUniform4fv: UniformFloatVectorSetter = (gl, program, name, data) => {
	gl.uniform4fv(getUniform(gl, program, name), data);
};
