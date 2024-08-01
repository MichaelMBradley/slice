import init, { greet, rust_init } from "logic";

// Start initializing immediately
const initialized = init();

const main = () => {
	rust_init();
	greet();
};

// As soon as the page load is done and initialization is complete, run the main function
document.addEventListener("DOMContentLoaded", () => {
	Promise.all([initialized]).then(() => main());
});
