// const withSass = require("@zeit/next-sass");
// const withImages = require("next-images");
//
// const { parsed: localEnv } = require("dotenv").config();
// const webpack = require("webpack");
//
// module.exports = withSass(
//   withImages({
//     webpack(config) {
//       config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
//
//       return config;
//     }
//   })
// );

require("dotenv").config();
const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = withSass(withImages());
