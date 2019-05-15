const withSass = require("@zeit/next-sass");
const withImages = require("next-images");

const { parsed: localEnv } = require("dotenv").config();
const webpack = require("webpack");

module.exports = withSass(
  withImages({
    // webpack(config) {
    //   config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    //
    //   return config;
    // }
    env: {
      TEST: process.env.PROXY_URL
    }
  })
);

// require("dotenv").config();
// const withSass = require("@zeit/next-sass");
// const withImages = require("next-images");
// const path = require("path");
// const Dotenv = require("dotenv-webpack");
//
// module.exports = withSass(
//   withImages({
//     webpack: config => {
//       config.plugins = config.plugins || [];
//
//       config.plugins = [
//         ...config.plugins,
//
//         // Read the .env file
//         new Dotenv({
//           path: path.join(__dirname, ".env"),
//           systemvars: true
//         })
//       ];
//
//       return config;
//     }
//   })
// );
