const karma = require('karma');

class KarmaManager {
  private config: any; 
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
    karma.server.start(this.config, (exitCode: number) => {
      console.log('Karma server exited with code:', exitCode);
    });
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