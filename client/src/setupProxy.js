const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/live/*",
    createProxyMiddleware({
      target: "http://server:8888",
      changeOrigin: true,
    })
  );
};
