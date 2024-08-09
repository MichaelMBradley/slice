import { rust_init } from "./logic";
import { animateHeader } from "./header/header";

const main = (): void => {
	// Run any Rust (WASM) initialization, like attaching the panic!() handler
	rust_init();

	animateHeader(60);
};

// As soon as the page load is done and initialization is complete, run the main function
main();
