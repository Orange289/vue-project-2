var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const env = process.env.NODE_ENV;
const PATHS = {
  src: path.join(__dirname, './src'), //absolute path to RepoDir/src
  dist: path.join(__dirname, './dist') //absolute path to RepoDir/dist
};

module.exports = {
  entry: {
    main: PATHS.src + '/main.js',
  },
  mode: env,
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename:
      env !== 'production' ? 'assets/js/build.[hash].js' : 'assets/js/build.[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      // Must be specified for HtmlWebpackPlugin to work correctly.
      // See: https://github.com/jantimon/html-webpack-plugin/issues/882
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*']),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[chunkhash].css',
      chunkFilename: 'assets/css/[id].[chunkhash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: PATHS.src + '/assets/images',
        to: './assets/images'
      },
      {
        from: PATHS.src + '/assets/icons',
        to: './assets/icons'
      }
    ]),
    new SVGSpritemapPlugin(PATHS.src + '/assets/icons/**/*.svg', {
      output: {
        filename: './assets/sprite.svg'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                scss: [
                  env !== 'production'
                    ? 'vue-style-loader'
                    : MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader',
                  {
                    loader: 'sass-resources-loader',
                    options: {
                      resources: PATHS.src + '/assets/scss/main.scss'
                    }
                  }
                ]
              }
              // other vue-loader options go here
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.scss$/,
        use: [
          env !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: PATHS.src + '/assets/scss/main.scss'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          env !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: PATHS.dist + '/assets/images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: PATHS.dist + '/assets/video/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.svg$/,
        use: [{ loader: 'html-loader' }]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json'],
    modules: ['./src/', 'node_modules']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (env === 'production') {
  module.exports.devtool = false;
  (module.exports.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
          }
        }
      })
    ],
    splitChunks: {
      name: false
    }
  }),
    (module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new HtmlWebpackPlugin({
        title: 'PRODUCTION prerender-spa-plugin',
        template: 'index.html',
        filename: PATHS.dist + '/index.html',
        favicon: 'favicon.ico'
      }),
      new PrerenderSPAPlugin({
        staticDir: PATHS.dist,
        routes: [
          '/',
          '/signin',
          '/clientsarea',
          '/clientsarea/payments-result',
          '/crm',
          '/multiservice-rent'
        ],

        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true
        },
      })
    ]));
} else {
  // NODE_ENV === 'development'
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'DEVELOPMENT prerender-spa-plugin',
      template: 'index.html',
      filename: 'index.html',
      favicon: 'favicon.ico'
    })
  ]);
}
