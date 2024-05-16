import { resolve } from "path";

export default {
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        watchlist: resolve(__dirname, "watchlist/index.html"),
      },
    },
    target: "esnext",
  },
};
