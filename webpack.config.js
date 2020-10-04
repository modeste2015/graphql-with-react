/**
@Author: Heritier Kinke
@Email: modesteheritier@gmail.com
*/

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.js'
  },
  module:{
    rules:[
        {
            test:/\.(js|jsx)/, 
            use: {
                loader:'babel-loader',
                options:{
                    presets:['@babel/preset-env','@babel/preset-react']
                }
            },
            exclude:/node_modules/
        }
    ]
  }
};