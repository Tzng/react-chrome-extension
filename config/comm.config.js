// 公共的配置
const path = require('path');
const autoprefixer = require('autoprefixer');

// 主题
const theme = {
  // 定义基本的颜色
  "@brand-primary": "#74ab6a",
  "@font-size-base": "0.8rem"
};

module.exports = {
  mode: 'development',
  // '*' allows to use: import A from 'file.ext'
  // '.js' allows to use: import B from 'script' (This will import script.js)
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          // Note: don't use sourceMap for content/page's CSS. it will cause CSP error.
          // if you want sourceMap apply to popup or window, have separated js file instead of using devCommon
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|svg|pdf|ico)$/,
        use: [
          {
            // import 'imageFile' will be inlined into script with base64encoded.
            loader: 'url-loader',
          },
        ]
      },
      // 处理普通的css和less文件
      {
        test: /\.(less)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer]
            }
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
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer]
            }
          },
          {
            loader: 'less-loader', options: {
              modifyVars: theme,
              javascriptEnabled: true,
            }
          },
        ],
      }
    ]
  },
};
