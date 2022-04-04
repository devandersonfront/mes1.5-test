const withImages = require('next-images')

const path = require('path')

const withPlugins = require('next-compose-plugins')

const withTM = require("next-transpile-modules")(["shared", "basic", "mes" , 'react-data-grid', 'styled-components', '@mui/styles']);

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
