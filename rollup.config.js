import resolve from "rollup-plugin-node-resolve";
import scss from "rollup-plugin-scss";

let scssOptions = {
    output: "build/style.css"
};

export default {
    input: "src/index.js",
    output: {
        file: "build/app.js",
        format: "iife",
        sourcemap: "inline"
    },
    plugins: [resolve(), scss(scssOptions)],
    watch: {
        chokidar: false,
        clearScreen: false,
        exclude: "node_modules/**"
    }
};
