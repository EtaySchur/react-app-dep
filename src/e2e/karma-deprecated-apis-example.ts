import * as karma from 'karma';

class DeprecatedKarmaExample {
  private config: karma.ConfigOptions;

  constructor() {
    this.config = {
      port: 9876,
      browsers: ['Chrome'],
      files: [
        'test/**/*.spec.js',
        {
          pattern: '**/*.dart',
          type: 'dart'
        }
      ]
    };
  }

  startServerOldWay(): void {
    // This worked in Karma 5.x but fails in 6.x
    karma.server.start(this.config, (exitCode: number) => {
      console.log('Karma server exited with code:', exitCode);
    });
  }

  startServerNewWay(): void {
    const server = new karma.Server(this.config, (exitCode: number) => {
      console.log('Karma server exited with code:', exitCode);
    });
    server.start();
  }

  configureDartSupport(): void {
    if (this.config.files) {
      this.config.files.push('**/*.dart');
    }
  }
}

const deprecatedConfig = {
  customFileHandlers: [],
  customScriptTypes: [],
  files: [
    'src/**/*.js',
    'src/**/*.dart' 
  ]
};

const example = new DeprecatedKarmaExample();

example.startServerOldWay(); 
example.startServerNewWay();
example.configureDartSupport();

export default DeprecatedKarmaExample; 