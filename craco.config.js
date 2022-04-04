module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (webpackConfig.resolve) {
        webpackConfig.resolve.fallback = {
          crypto: false,
        };
      }

      return webpackConfig;
    },
  },
}
