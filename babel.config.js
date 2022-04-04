module.exports = function babelConfig(api) {
    api.cache.forever();
    return {
        babelrcRoots: [
            // Keep the root as a root
            '.',
            // Also consider monorepo packages "root" and load their .babelrc files.
            './packages/*',
        ],
        presets: [
            [
                '@babel/env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    targets: {
                        browsers: ['> 1%'],
                    },
                },
            ],
            '@babel/typescript',
            '@babel/react',
            'next/babel'
        ],
        plugins: [
            'babel-plugin-styled-components',
            {
                ssr:true,
                fileName: true,
                displayName: true,
                pure: true
            },
            '@babel/syntax-dynamic-import',
            '@babel/plugin-proposal-object-rest-spread',
        ],
        env: {
            test: {
                presets: [
                    [
                        '@babel/env',
                        {
                            useBuiltIns: 'usage',
                            targets: {
                                browsers: ['> 1%'],
                            },
                        },
                    ],
                    '@babel/typescript',
                    '@babel/react',
                ],
            },
        },
    };
};
