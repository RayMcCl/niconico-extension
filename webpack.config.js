'use strict'
const webpack = require('webpack')
const path = require('path')

/* Modules */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

/* Resources */
const MANIFEST = require('./config/manifest.json');
const PACKAGE = require('./package.json');
const OUTPUT = 'dist';

/* Utilities */
const vueLoaderConfig = require('./build/vue-loader.conf');

/* Globals */
const APP_DIR = path.resolve(__dirname, 'src/');
const utils = require('./build/utils');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// const HOST = process.env.HOST
// const PORT = process.env.PORT && Number(process.env.PORT)



// const devWebpackConfig = merge(baseWebpackConfig, {
//   module: {
//     rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       'process.env': require('../config/dev.env')
//     }),
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
//     new webpack.NoEmitOnErrorsPlugin(),
//     // https://github.com/ampedandwired/html-webpack-plugin
//     new HtmlWebpackPlugin({
//       filename: 'index.html',
//       template: 'index.html',
//       inject: true
//     }),
//     // copy custom static assets
//     new CopyWebpackPlugin([
//       {
//         from: path.resolve(__dirname, '../static'),
//         to: config.dev.assetsSubDirectory,
//         ignore: ['.*']
//       }
//     ])
//   ]
// })

/* --- Plugins --- */
// const HtmlWebpackPluginDevtoolRootConfig = new HtmlWebpackPlugin({
//   template: './src/devtool/root.html',
//   filename: 'devtool_root.html',
//   inject: 'body',
//   chunks: ['devtool_root']
// });

// const HtmlWebpackPluginDevtoolConfig = new HtmlWebpackPlugin({
//     template: './src/devtool/index.html',
//     filename: 'devtool.html',
//     inject: 'body',
//     chunks: ['devtool', 'global_commons']
// });

// const HtmlWebpackPluginExtConfig = new HtmlWebpackPlugin({
//     template: './src/ext/popup.html',
//     filename: 'popup.html',
//     inject: 'body',
//     chunks: ['popup', 'global_commons']
// });

// const HtmlWebpackPluginOptionsConfig = new HtmlWebpackPlugin({
//     template: './src/options/index.html',
//     filename: 'options.html',
//     inject: 'body',
//     chunks: ['options', 'global_commons']
// });

const SourceMapPlugin = new webpack.SourceMapDevToolPlugin({
    filename: 'source.js.map'
});
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [
  /* --- Utility --- */
  new CleanWebpackPlugin(OUTPUT),
  new BundleAnalyzerPlugin(),

  /* --- Standard --- */
  // HtmlWebpackPluginExtConfig,
  // HtmlWebpackPluginDevtoolRootConfig,
  // HtmlWebpackPluginDevtoolConfig,
  // HtmlWebpackPluginOptionsConfig,
  // new CommonsChunkPlugin({
  //     name: "global_commons",
  //     chunks: ['devtool', 'popup', 'options'],
  //     filename: "global_commons.js",
  //     minChunks: 2
  // }),
  /* --- Optimization --- */
  // new CommonsChunkPlugin({
  //     name: "content_commons",
  //     chunks: ['content_start'],
  //     filename: "content_commons.js",
  //     minChunks: 2
  // })
];

module.exports = env => {
  const BUILD_TYPE = env.build;

  let manifestName = '';

  if (BUILD_TYPE === 'prod') {
    manifestName = MANIFEST.name;
  } else if(BUILD_TYPE === 'dev'){
    manifestName = MANIFEST.name + ' - Development Build';
  }

  plugins.push(new CopyWebpackPlugin([
    {
        from: './config/manifest.json',
        to: 'manifest.json',
        transform: function (content, absolutePath, relativePath) {
            var data = JSON.parse(content.toString());
            data.version = PACKAGE.version;

            if (BUILD_TYPE === 'dev') {
                data.name = manifestName;
            }

            return new Buffer(JSON.stringify(data, null, 4));
        }
    },
    {
        from: APP_DIR + (BUILD_TYPE === 'prod' ? '/assets/img/*.png' : '/assets/img/dev/*.png'),
        flatten: true,
        to: 'img'
    },
    {
        from: APP_DIR + '/resources/img/logo.svg',
        to: 'img'
    }
  ]));

  return {
    entry: {
      //devtool: APP_DIR + '/devtool/index.js',
      //options: APP_DIR + '/options/index.js',
      //devtool_root: APP_DIR + '/devtool/root.js',
      popup: APP_DIR + '/background/background.js',
      background: APP_DIR + '/background/background.js',
      content_start: APP_DIR + '/content/content.js',
      //content_end: APP_DIR + '/ext/content_end.js'
    },
    output: {
      path: path.join(__dirname, OUTPUT),
      filename: '[name].js',
      publicPath: ''
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader"
          }, {
              loader: "css-loader"
          }, {
              loader: "sass-loader"
          }]
        }
      ]
    }
  }
  
};

// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//         compilationSuccessInfo: {
//           messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//         },
//         onErrors: config.dev.notifyOnErrors
//         ? utils.createNotifierCallback()
//         : undefined
//       }))

//       resolve(devWebpackConfig)
//     }
//   })
// })
