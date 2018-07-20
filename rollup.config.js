import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import scss from 'rollup-plugin-scss';

let scssOptions = {
    output: "style.css"
};

export default {
    input: 'src/index.js',
    output: {
        file: 'app.js',
        format: 'iife'
    },
    //sourceMap: 'inline',
    plugins: [ 
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        resolve(),
        scss(scssOptions)
    ],
    watch: {
        exclude: 'node_modules/**'
    }
}
