const path = require('path')
const WebpackShellPlugin = require('webpack-shell-plugin')

module.exports = {
    name: 'Your prject build',
    target: 'web',
    entry: {
        'your.bundle.js': './your_entry_js_bundle.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './dist/',
        filename: '[name]', // for multiple entry points
        chunkFilename: '[name].js', // for chunks
    },
    devtool: 'source-map',
    externals: [],
    module: { /* your module loaders */},
    resolve: { /* your resolve config */},
    plugins: [
      new WebpackShellPlugin({
          onBuildStart: ['node ./src/prebuild.js'],
      })
    ],
}
