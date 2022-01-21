const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    Codraft: path.resolve(__dirname, '../', 'src', 'index.ts')
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
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
            options: {}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../', 'src'),
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