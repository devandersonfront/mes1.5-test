const withImages = require('next-images')

const path = require('path')

const withPlugins = require('next-compose-plugins')

const withTM = require("next-transpile-modules")(["shared", "basic", "mes" , 'react-data-grid']);

module.exports = withPlugins(
    [
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