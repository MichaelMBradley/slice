import init_wasm, { rust_init } from "logic";
import { animateHeader } from "./header/header";

// Start initializing WASM streaming immediately
const initialized = init_wasm();

const main = (): void => {
	// Run any Rust (WASM) initialization, like attaching the panic!() handler
	rust_init();

	animateHeader(60);
};

// As soon as the page load is done and initialization is complete, run the main function
document.addEventListener("DOMContentLoaded", () => {
	Promise.all([initialized])
		.then(() => {
			main();
		})
		.catch((rejected: unknown) => {
			console.error(rejected);
		});
});
