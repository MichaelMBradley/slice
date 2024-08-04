import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
	plugins: [wasmPack("./logic"), glsl({ compress: true })],
	clearScreen: false,
	base: "",
});
