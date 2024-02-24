const hmr = {
  meta: {
    hot: {
      accept: () => {
        // Replace old module with new one
        // Out with the old, in with the new
        // 1. (cb: Function) => ... self-accept changes
        // 2. (deps: string[]) => ... accept changes from imported (child?) modules
      },
      dispose: () => {
        ///
        // Clear up for `accept`
        // Reset some global,
        // Remove old stylesheets, etc.
      },
      prune: () => {
        /// module is completed not used anymore
        /// perhaps some conditional module is removed in some fashion
        /// eg: css file for component that is not rendered anymore
        
      },
      invalidate: () => {
        /// Something is wrong and we cannot HMR
        /// "reset switch"
      },
    },
  },
};
