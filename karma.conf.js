module.exports = function(config) {
  config.set({
    // Base path for resolving all patterns (eg. files, exclude)
    basePath: '',

    // Frameworks to use
    frameworks: ['jasmine'],

    // List of files / patterns to load in the browser
    files: [
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
      'src/**/*.test.ts', 
      'src/**/*.test.tsx'
    ],

    // List of files / patterns to exclude
    exclude: [
      'src/e2e/**/*'
    ],

    // Preprocess matching files before serving them to the browser
    preprocessors: {
      'src/**/*.ts': ['webpack', 'sourcemap'],
      'src/**/*.tsx': ['webpack', 'sourcemap']
    },

    // Webpack configuration
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript'
                  ]
                }
              }
            ],
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },
      devtool: 'inline-source-map'
    },

    // Test results reporter to use
    reporters: ['progress'],

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    browsers: ['Chrome'],

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // How many browser will be started simultaneously
    concurrency: Infinity,

    // Client configuration
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    }
  });
}; 