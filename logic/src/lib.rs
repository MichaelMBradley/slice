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
    if dim == 0 {
        #[cfg(feature = "console_error_panic_hook")]
        panic!("Cannot have 0-dimensional hypercube");
        #[allow(unreachable_code)]
        0
    } else if dim >= size_of::<usize>() * 8 {
        #[cfg(feature = "console_error_panic_hook")]
        panic!(
            "{} is too many dimensions to index vertices of a hypercube",
            dim
        );
        #[allow(unreachable_code)]
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

    if usize::MAX / dim < vertices {
        #[cfg(feature = "console_error_panic_hook")]
        panic!(
            "{} is too may dimensions to index all vertex fields of a hypercube",
            dim
        );
        #[allow(unreachable_code)]
        0
    } else {
        // Each vertex needs 1 float for every axis (dimension)
        dim * vertices
    }
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

    if arr.len() != hypercube_array_length(dim) {
        #[cfg(feature = "console_error_panic_hook")]
        panic!(
            "Hypercube has {} instead of {} elements",
            arr.len(),
            dim * vertices
        );
        #[allow(unreachable_code)]
        return;
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
                #[allow(unreachable_code)]
                return;
            }
        }
    }
}

/// Rotate a point around every axis in a set order
///
/// ## Arguments
///
/// * `amount` - The amount to rotate about each axis.
/// * `arr` - Point to rotate.
#[wasm_bindgen]
pub fn rotate_about_each_axis(amount: f32, arr: &mut [f32]) {
    #[cfg(feature = "console_error_panic_hook")]
    if arr.len() < 2 {
        panic!(
            "Point must have at least 2 dimensions to rotate (had {})",
            arr.len()
        );
    }
    rotate_about_each_axis_implementation(amount.cos(), amount.sin(), arr)
}

pub fn rotate_about_each_axis_implementation(cos: f32, sin: f32, arr: &mut [f32]) {
    for i in 0..(arr.len() - 1) {
        for j in (i + 1)..arr.len() {
            if let Some(x) = arr.get(i) {
                if let Some(y) = arr.get(j) {
                    let rot = (cos * x - sin * y, sin * x + cos * y);
                } else {
                    #[cfg(feature = "console_error_panic_hook")]
                    panic!("Somehow failed to get array index {} of {}", j, arr.len());
                    #[allow(unreachable_code)]
                    return;
                }
            } else {
                #[cfg(feature = "console_error_panic_hook")]
                panic!("Somehow failed to get array index {} of {}", i, arr.len());
                #[allow(unreachable_code)]
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
