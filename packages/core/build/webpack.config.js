const path = require('path')
const tsTransformPaths = require('@zerollup/ts-transform-paths')

const base = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
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
      '@typings': path.resolve(__dirname, '../', '../', '@typings'),
    },
    modules: [
      path.resolve(__dirname, '../', 'node_modules'),
      path.resolve(__dirname, '../', '../', '../', 'node_modules')
    ]
  }
}

const umd = {
  ...base,
  entry: {
    index: path.resolve(__dirname, '../', 'src', 'index.ts')
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist', 'umd'),
    filename: '[name].js',
    library: {
      type: 'umd',
      name: 'Codraft'
    },
    publicPath: '/dist/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../', 'public')
    },
    port: 8081,
  }
}

const esm = {
  ...base,
  experiments: {
    outputModule: true
  },
  entry: {
    index: path.resolve(__dirname, '../', 'src', 'index.ts')
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist', 'esm'),
    filename: '[name].js',
    library: {
      type: 'module'
    },
    publicPath: '/dist/',
  }
}

module.exports = [
  umd,
  esm
]