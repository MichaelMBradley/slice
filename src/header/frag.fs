#version 300 es

precision lowp float;

uniform vec3 colour;

layout(location = 0) out vec4 fragColour;

void main() {
	fragColour = vec4(colour, 1);
}
