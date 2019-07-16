const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    'index.bundle': [customPath, path.join(__dirname, '../chrome/extension/index')],
    'background.bundle': [customPath, path.join(__dirname, '../chrome/extension/background')],
    'inject.bundle': [customPath, path.join(__dirname, '../chrome/extension/inject')],
    // 企业信息的脚本
    'injectInfo.bundle': [customPath, path.join(__dirname, '../chrome/extension/inject/injectInfo')],
    // 注入到页面的脚本
    'content/content-script.bundle': [path.join(__dirname, '../chrome/assets/content/content-script')],
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: false
        }
      }),
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react-optimize']
        }
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer]
            }
          }
        ]
      },
      // 处理普通的less文件
      {
        test: /\.(less)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,   // 新增对css modules的支持
            },
          },
          {
            loader: 'less-loader', options: {
              importLoaders: 1,
              javascriptEnabled: true,
            }
          },
        ],
      },
      // 处理ant的less文件
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader', options: {
              modifyVars: theme,
              javascriptEnabled: true,
            }
          },
        ],
      }
    ]
  }
};
