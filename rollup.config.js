export default [
  {
    input: "dist/esm/index.js",
    output: [
      {
        file: `dist/cjs/index.cjs`,
        format: "cjs",
        sourcemap: true,
      },
    ],
    external: ["mixme", "ssh2", "node:fs/promises", "node:path"],
  },
];
