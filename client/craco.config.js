// craco.config.js
const path = require("path");
const fs = require("fs");
const { whenDev } = require("@craco/craco");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  devServer: whenDev(() => ({
    // https: true,
    // key: fs.readFileSync(path.resolve("./src/certificates/abels-key.pem")),
    // cert: fs.readFileSync(path.resolve("./src/certificates/abels-cert.pem")),
  })),
};
