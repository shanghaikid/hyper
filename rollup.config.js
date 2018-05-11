import resolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss';

let scssOptions = {
	output: 'style.css',
};

export default {
	input: 'src/index.js',
	output: {
		file: 'app.js',
		format: 'iife'
	},
	//sourceMap: 'inline',
	plugins: [ 
		resolve(),
		scss(scssOptions)
	],
	watch: {
		exclude: 'node_modules/**'
	}
}
