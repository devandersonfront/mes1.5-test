const withImages = require('next-images')

const withCSS = require('@zeit/next-css')

const withTM = require("next-transpile-modules")(["shared", "basic", "mes"]);

module.exports = withCSS(withImages(withTM({
    // webpack5: false,
})));
