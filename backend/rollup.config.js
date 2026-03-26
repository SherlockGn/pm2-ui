import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'index.js',
    output: {
        format: 'es',
        file: '../dist/server.js'
    },
    plugins: [
        resolve(),
        commonjs({
            dynamicRequireTargets: ['node_modules/bcryptjs/*.js']
        })
    ]
}
