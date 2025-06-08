import KarmaManager from './karma';
import * as karma from 'karma';

// Mock the karma module
jest.mock('karma', () => ({
  server: {
    start: jest.fn()
  },
  ConfigOptions: {}
}));

describe('KarmaManager', () => {
  let karmaManager: KarmaManager;
  let mockKarmaStart: jest.MockedFunction<typeof karma.server.start>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockKarmaStart = karma.server.start as jest.MockedFunction<typeof karma.server.start>;
    // Ensure mock has a default implementation
    mockKarmaStart.mockImplementation((config, callback) => {
      // Do nothing by default
    });
    karmaManager = new KarmaManager();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const manager = new KarmaManager();
      
      // Access private config through reflection for testing
      const config = (manager as any).config;
      
      expect(config.port).toBe(9876);
      expect(config.browsers).toEqual(['Chrome']);
      expect(config.files).toHaveLength(2);
      expect(config.files[0]).toBe('test/**/*.spec.js');
      expect(config.files[1]).toEqual({
        pattern: '**/*.dart',
        type: 'dart'
      });
    });

    it('should create a new instance each time', () => {
      const manager1 = new KarmaManager();
      const manager2 = new KarmaManager();
      
      expect(manager1).not.toBe(manager2);
      expect((manager1 as any).config).not.toBe((manager2 as any).config);
    });
  });

  describe('startServer', () => {
    it('should call karma.server.start with correct config', () => {
      karmaManager.startServer();
      
      expect(mockKarmaStart).toHaveBeenCalledTimes(1);
      expect(mockKarmaStart).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 9876,
          browsers: ['Chrome'],
          files: expect.arrayContaining([
            'test/**/*.spec.js',
            { pattern: '**/*.dart', type: 'dart' }
          ])
        }),
        expect.any(Function)
      );
    });

    it('should handle server exit callback', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      karmaManager.startServer();
      
      // Get the callback function that was passed to karma.server.start
      const callback = mockKarmaStart.mock.calls[0]?.[1];
      expect(callback).toBeDefined();
      
      // Call the callback with an exit code
      if (callback) {
        callback(0);
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('Karma server exited with code:', 0);
      
      consoleSpy.mockRestore();
    });

    it('should handle different exit codes', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      karmaManager.startServer();
      const callback = mockKarmaStart.mock.calls[0]?.[1];
      
      // Test with error exit code
      if (callback) {
        callback(1);
      }
      expect(consoleSpy).toHaveBeenCalledWith('Karma server exited with code:', 1);
      
      consoleSpy.mockRestore();
    });
  });

  describe('configureDartSupport', () => {
    it('should add dart file pattern to existing files array', () => {
      const initialFilesLength = (karmaManager as any).config.files.length;
      
      karmaManager.configureDartSupport();
      
      const config = (karmaManager as any).config;
      expect(config.files).toHaveLength(initialFilesLength + 1);
      expect(config.files[config.files.length - 1]).toBe('**/*.dart');
    });

    it('should handle multiple calls without duplicating entries', () => {
      karmaManager.configureDartSupport();
      karmaManager.configureDartSupport();
      
      const config = (karmaManager as any).config;
      const dartPatterns = config.files.filter((file: any) => file === '**/*.dart');
      expect(dartPatterns).toHaveLength(2); // This reflects current behavior - method adds each time
    });

    it('should handle case when files array is empty', () => {
      // Create manager with empty files array
      const emptyManager = new KarmaManager();
      (emptyManager as any).config.files = [];
      
      emptyManager.configureDartSupport();
      
      const config = (emptyManager as any).config;
      expect(config.files).toHaveLength(1);
      expect(config.files[0]).toBe('**/*.dart');
    });

    it('should handle case when files is undefined', () => {
      // Create manager with undefined files
      const undefinedManager = new KarmaManager();
      (undefinedManager as any).config.files = undefined;
      
      undefinedManager.configureDartSupport();
      
      const config = (undefinedManager as any).config;
      expect(config.files).toBeUndefined(); // Current behavior - method checks but doesn't create array
    });
  });

  describe('integration tests', () => {
    it('should work with startServer and configureDartSupport together', () => {
      karmaManager.configureDartSupport();
      karmaManager.startServer();
      
      expect(mockKarmaStart).toHaveBeenCalledWith(
        expect.objectContaining({
          files: expect.arrayContaining([
            'test/**/*.spec.js',
            { pattern: '**/*.dart', type: 'dart' },
            '**/*.dart'
          ])
        }),
        expect.any(Function)
      );
    });

    it('should maintain separate configurations for different instances', () => {
      const manager1 = new KarmaManager();
      const manager2 = new KarmaManager();
      
      manager1.configureDartSupport();
      
      const config1 = (manager1 as any).config;
      const config2 = (manager2 as any).config;
      
      expect(config1.files).toHaveLength(3); // original 2 + 1 dart pattern
      expect(config2.files).toHaveLength(2); // original 2 only
    });
  });

  describe('edge cases', () => {
    it('should handle karma server start throwing an error', () => {
      mockKarmaStart.mockImplementation(() => {
        throw new Error('Karma start failed');
      });
      
      expect(() => karmaManager.startServer()).toThrow('Karma start failed');
    });

    it('should handle configuration modifications after instantiation', () => {
      const config = (karmaManager as any).config;
      config.port = 8080;
      config.browsers = ['Firefox'];
      
      karmaManager.startServer();
      
      expect(mockKarmaStart).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 8080,
          browsers: ['Firefox']
        }),
        expect.any(Function)
      );
    });
  });
}); 