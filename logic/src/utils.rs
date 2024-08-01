pub fn set_panic_hook() {
    // TODO: Make sure this gets disabled on release builds
    // TODO: Also ideally just write code that never panics
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
