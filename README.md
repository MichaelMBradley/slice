# Slice

Trying to figure out a blog post about messing around with rendering higher-dimensional shapes.

## Separation of languages

Anything performance-critical is done in Rust and compiled to WebAssembly.
Everything else is done in TypeScript for better ergonomics.

## Vite

`vite dev` has trouble serving the WASM, so for now the setup is to use `vite build` and `vite preview`.
Not ideal but shouldn't be too slow given the size of the app.

## Rust

From what I understand, `panic!()` causes huge size bloat, but I still want to have error handling.
I'm still fairly new to rust, but for now I'm putting them all behind `#[cfg(feature = "console_error_panic_hook")]` with the understanding that I should be able to disable this feature in later builds when I'm confident my code is bug-free and reduce my file sizes.
