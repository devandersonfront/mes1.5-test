const withImages = require('next-images')

const path = require('path')

const withPlugins = require('next-compose-plugins')
const withTM = require("next-transpile-modules")(["shared", "basic", "mes" , 'react-data-grid', 'styled-components', '@mui/styles']);
const withPolyfill = require('next-with-polyfill');

module.exports = withPlugins(
    [
      withPolyfill([
        './node_modules/core-js/stable',
        './node_modules/regenerator-runtime/runtime',
      ]),
        [withImages],
        [withTM]
    ],
    {
        sassOptions: {
            includePaths: [path.join(__dirname, 'styles')],
        },
        images: {
            disableStaticImages: true
        },
    },
)
