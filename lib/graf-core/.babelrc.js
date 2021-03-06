module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-flow",
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ]
}
