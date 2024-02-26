import webpack = require("webpack");
import HtmlWebpackPlugin = require("html-webpack-plugin");
export let entry: string;
export let devtool: string;
export namespace devServer {
    let _static: string;
    export { _static as static };
}
export namespace optimization {
    let runtimeChunk: string;
}
export namespace output {
    let hashFunction: string;
    let path: string;
    let filename: string;
    let sourceMapFilename: string;
}
export namespace module {
    let rules: ({
        test: RegExp;
        exclude: RegExp;
        loader: string;
        use?: undefined;
    } | {
        test: RegExp;
        use: string[];
        exclude?: undefined;
        loader?: undefined;
    })[];
}
export let plugins: (webpack.DefinePlugin | HtmlWebpackPlugin)[];
export namespace resolve {
    namespace fallback {
        let buffer: string;
        let crypto: string;
        let stream: string;
    }
}
