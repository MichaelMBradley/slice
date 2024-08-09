#version 300 es

precision lowp float;

uniform float time;

// Three `vec4`s together make one `vec12`
uniform vec4[3] lerpOffset;
uniform vec4[3] lerpDuration;

// Aparently vertex input arrays and input structs aren't supported in OpenGL ES, so we have to resort to badly-named variables
layout(location = 0) in vec4 v0;
layout(location = 1) in vec4 v1;
layout(location = 2) in vec4 v2;

vec4 timedLerp(const vec4 vec, const vec4 offset, const vec4 duration) {
	return vec * smoothstep(vec4(0), vec4(1), (vec4(time) - offset) / duration);
}

void main() {
	vec4[3] lerped = vec4[](
		timedLerp(v0, lerpOffset[0], lerpDuration[0]),
		timedLerp(v1, lerpOffset[1], lerpDuration[1]),
		timedLerp(v2, lerpOffset[2], lerpDuration[2])
	);
	// TODO: All upper points move on lerped[1].x, might be setup wrong
	gl_Position = vec4(lerped[0].x + lerped[0].z / 2. + lerped[0].w / 5. - lerped[1].x / 8., lerped[0].y + lerped[0].z / 2. - lerped[0].w / 5. - lerped[1].x / 8., 0., 10) / 10.;
}
