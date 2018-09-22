const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "examples/src/index.html"),
    filename: "./index.html"
});
module.exports = {
    entry: path.join(__dirname, "examples/src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
              test: /\.tsx?$/,
              loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css"]
    },
    devServer: {
        port: 3001
    }
};