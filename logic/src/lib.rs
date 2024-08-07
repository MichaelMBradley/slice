mod utils;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

/// A hypercube is the continuation of point -> line -> square -> cube -> (higher dimensional hypercube).
///
/// ## Arguments
///
/// * `dim` - The number of dimensions of the hypercube.
///
/// ## Returns
///
/// The number of vertices in such a hypercube.
#[wasm_bindgen]
pub fn num_hypercube_vertices(dim: usize) -> usize {
    #[cfg(feature = "console_error_panic_hook")]
    if dim >= size_of::<usize>() * 8 {
        panic!(
            "{} is too many dimensions to index vertices of a hypercube",
            dim
        );
    }
    #[cfg(feature = "console_error_panic_hook")]
    if dim == 0 {
        panic!("Cannot have 0-dimensional hypercube");
    }
    if dim == 0 {
        0
    } else {
        1 << (dim - 1)
    }
}

/// Assuming a hypercube represented as a 1-dimensional array where the axes of each vertex are packed together.
///
/// ## Arguments
///
/// * `dim` - The number of dimensions of the hypercube.
///
/// ## Returns
///
/// The length of an array needed to hold 1 float for every axis in every vertex of the hypercube.
#[wasm_bindgen]
pub fn hypercube_array_length(dim: usize) -> usize {
    let vertices = num_hypercube_vertices(dim);

    #[cfg(feature = "console_error_panic_hook")]
    if usize::MAX / dim < vertices {
        panic!(
            "{} is too may dimensions to index all vertex fields of a hypercube",
            dim
        );
    }

    // Each vertex needs 1 float for every axis (dimension)
    dim * vertices
}

/// Initialize the vertices of a `dim`-dimensional hypercube with the values along all axes set to `0` or `1`.
/// Apparently memory allocation in WASM increases file size, so do the allocation in Typescript and then send it here for initialization.
///
/// ## Arguments
///
/// * `dim` - The number of dimensions in the hypercube.
/// * `arr` - Vertex array to mutate. Must be of the length returned from `hypercube_array_length()`.
#[wasm_bindgen]
pub fn initialize_hypercube(dim: usize, arr: &mut [f32]) {
    let vertices = num_hypercube_vertices(dim);

    #[cfg(feature = "console_error_panic_hook")]
    if arr.len() != hypercube_array_length(dim) {
        panic!(
            "Hypercube has {} instead of {} elements",
            arr.len(),
            dim * vertices
        );
    }

    for vert_index in 0..vertices {
        let arr_index = vert_index * dim;
        // Turn the axes of the vertex into a binary representation of the index
        for offset in 0..dim {
            if let Some(element) = arr.get_mut(arr_index + offset) {
                *element = if (vert_index & (1 << offset)) != 0 {
                    1.
                } else {
                    0.
                }
            } else {
                #[cfg(feature = "console_error_panic_hook")]
                panic!(
                    "Array was somehow missing element at index {}",
                    arr_index + offset
                );
                return;
            }
        }
    }
}

/// Does one-time initialization for the WASM code
#[wasm_bindgen]
pub fn rust_init() {
    set_panic_hook();
}
