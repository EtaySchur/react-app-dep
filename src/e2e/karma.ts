import * as karma from 'karma';

class KarmaManager {
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

  startServer(): void {
    new karma.KarmaServer(this.config, (exitCode: number) => {
      console.log('Karma server exited with code:', exitCode);
    }).start();
  }

  configureDartSupport(): void {
    if (this.config.files) {
      this.config.files.push('**/*.dart');
    }
  }
}

const example = new KarmaManager();

example.startServer(); 
example.configureDartSupport();

export default KarmaManager; 