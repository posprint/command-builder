const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production', // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: './index', // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, 'dist'), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: 'bundle.js', // string
    // the filename template for entry chunks
    // the url to the output directory resolved relative to the HTML page
    library: 'command-builder', // string,
    // the name of the exported library
    libraryTarget: 'umd', // universal module definition
    // the type of the exported library
    /* Advanced output configuration (click to show) */
    /* Expert output configuration (on own risk) */
    globalObject: 'this'
  },
  context: __dirname, // string (absolute path!)
  stats: 'errors-only',
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
}
