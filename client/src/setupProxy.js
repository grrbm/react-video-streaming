const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "https://loud-now.cyou:8888",
    createProxyMiddleware({
      target: "http://server:8888",
      changeOrigin: true,
    })
  );
};
