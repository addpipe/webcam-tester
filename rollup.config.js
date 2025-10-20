import terser from "@rollup/plugin-terser";

export default [
  // UMD build (for browsers via CDN)
  {
    input: "src/webcam-tester.js",
    output: {
      file: "dist/webcam-tester.js",
      format: "umd",
      name: "MediaDeviceTester",
      exports: "named",
    },
  },
  // UMD minified build
  {
    input: "src/webcam-tester.js",
    output: {
      file: "dist/webcam-tester.min.js",
      format: "umd",
      name: "MediaDeviceTester",
      exports: "named",
      sourcemap: true,
    },
    plugins: [terser()],
  },
  // ES Module build (for modern bundlers)
  {
    input: "src/webcam-tester.js",
    output: {
      file: "dist/webcam-tester.esm.js",
      format: "es",
      exports: "named",
    },
  },
  // CommonJS build (for Node.js)
  {
    input: "src/webcam-tester.js",
    output: {
      file: "dist/webcam-tester.cjs.js",
      format: "cjs",
      exports: "named",
    },
  },
];
