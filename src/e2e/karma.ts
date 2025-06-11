import * as karma from 'karma';

class KarmaManager {
  private config: ConfigOptions;

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

  async startServer(): Promise<void> {
    const server = new Server(this.config);
    await server.start();
    server.on('exit', (exitCode: number) => {
      console.log('Karma server exited with code:', exitCode);
    });
  }

  configureDartSupport(): void {
    if (!this.config.files) {
      this.config.files = [];
    }
    this.config.files.push('**/*.dart');
  }
}

const example = new KarmaManager();

example.startServer(); 
example.configureDartSupport();

export default KarmaManager; 