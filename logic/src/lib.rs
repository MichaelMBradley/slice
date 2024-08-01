mod utils;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn rust_greet() {
    log("Rust initialized");
}

#[wasm_bindgen]
pub fn rust_init() {
    set_panic_hook();
}
