const path = require('path')
const tsTransformPaths = require('@zerollup/ts-transform-paths')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    index: path.resolve(__dirname, '../', 'src', 'index.ts')
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist', 'core', 'src'),
    filename: '[name].js',
    library: 'Codraft',
    libraryTarget: 'umd',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program) => {
                const transformer = tsTransformPaths(program)
                return {
                  afterDeclarations: [transformer.afterDeclarations]
                }
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../', 'src'),
      '@typings': path.resolve(__dirname, '../', '../', '@typings')
    },
    modules: [
      path.resolve(__dirname, '../', 'node_modules'),
      path.resolve(__dirname, '../', '../', '../', 'node_modules')
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../', 'public')
    },
    port: 8081,
  }
}