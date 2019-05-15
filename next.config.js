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
    webpack(config) {
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
      config.node = { fs: "empty" };
      config.plugins = config.plugins || [];

      config.plugins = [...config.plugins];

      return config;
    },
    env: {
      proxyURL: process.env.proxyURL,
      openWeatherMapAPI: process.env.openWeatherMapAPI,
      openWeatherMapAPIKey: process.env.openWeatherMapAPIKey,
      cryptoCompareAPI: process.env.cryptoCompareAPI,
      cryptoCompareAPIKey: process.env.cryptoCompareAPIKey,
      newsAPI: process.env.newsAPI,
      newsAPIKey: process.env.newsAPIKey,
      cryptoPanicAPI: process.env.cryptoPanicAPI,
      cryptoPanicAPIKey: process.env.cryptoPanicAPIKey,
      db: process.env.db,
      mongoURI: process.env.mongoURI
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
