import { AxiosProgressEvent } from 'axios';
import {
  mockProgressEvent,
  createTestProgressEvent,
  CustomProgressEvent,
  processProgress,
  fakeProgress,
  logProgress,
  progressHistory,
  extendedProgress,
  simulateProgress,
  processEvent
} from '../api-service';

describe('api-service', () => {
  describe('mockProgressEvent', () => {
    it('should have correct properties', () => {
      expect(mockProgressEvent).toMatchObject({
        loaded: 1024,
        total: 2048,
        progress: 0.5,
        bytes: 1024,
        rate: 1000,
        estimated: 1,
        upload: false,
        download: true,
        event: undefined
      });
    });
  });

  describe('createTestProgressEvent', () => {
    it('should create progress event with correct properties', () => {
      const loaded = 512;
      const total = 1024;
      const event = createTestProgressEvent(loaded, total);

      expect(event).toMatchObject({
        loaded: 512,
        total: 1024,
        progress: 0.5,
        bytes: 512,
        rate: 1000,
        estimated: (total - loaded) / 1000,
        upload: false,
        download: true,
        event: undefined
      });
    });

    it('should calculate progress correctly', () => {
      const event = createTestProgressEvent(250, 1000);
      expect(event.progress).toBe(0.25);
    });

    it('should calculate estimated time correctly', () => {
      const event = createTestProgressEvent(300, 800);
      expect(event.estimated).toBe((800 - 300) / 1000);
    });
  });

  describe('CustomProgressEvent', () => {
    it('should create instance with loaded and total', () => {
      const loaded = 100;
      const total = 200;
      const event = new CustomProgressEvent(loaded, total);

      expect(event.loaded).toBe(loaded);
      expect(event.total).toBe(total);
      expect(event.progress).toBe(0.5);
      expect(event.bytes).toBe(loaded);
    });

    it('should create instance with only loaded', () => {
      const loaded = 50;
      const event = new CustomProgressEvent(loaded);

      expect(event.loaded).toBe(loaded);
      expect(event.total).toBeUndefined();
      expect(event.progress).toBeUndefined();
      expect(event.bytes).toBe(loaded);
    });

    it('should calculate progress correctly when total is provided', () => {
      const event = new CustomProgressEvent(75, 300);
      expect(event.progress).toBe(0.25);
    });

    it('should set progress to undefined when total is not provided', () => {
      const event = new CustomProgressEvent(100);
      expect(event.progress).toBeUndefined();
    });
  });

  describe('processProgress', () => {
    it('should calculate percentage correctly when total is provided', () => {
      const progressEvent: AxiosProgressEvent = {
        loaded: 25,
        total: 100,
        progress: 0.25,
        bytes: 25,
        rate: 1000,
        estimated: 0.75,
        upload: false,
        download: true,
        event: undefined
      };

      const percentage = processProgress(progressEvent);
      expect(percentage).toBe(25);
    });

    it('should return 0 when total is undefined', () => {
      const progressEvent: AxiosProgressEvent = {
        loaded: 50,
        total: undefined,
        progress: undefined,
        bytes: 50,
        rate: 1000,
        estimated: undefined,
        upload: false,
        download: true,
        event: undefined
      };

      const percentage = processProgress(progressEvent);
      expect(percentage).toBe(0);
    });

    it('should return 0 when total is 0', () => {
      const progressEvent: AxiosProgressEvent = {
        loaded: 50,
        total: 0,
        progress: 0,
        bytes: 50,
        rate: 1000,
        estimated: 0,
        upload: false,
        download: true,
        event: undefined
      };

      const percentage = processProgress(progressEvent);
      expect(percentage).toBe(0);
    });
  });

  describe('fakeProgress', () => {
    it('should have correct properties', () => {
      expect(fakeProgress).toMatchObject({
        loaded: 100,
        total: 200,
        progress: 0.5,
        bytes: 100
      });
    });
  });

  describe('logProgress', () => {
    it('should log progress information', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const progressEvent: AxiosProgressEvent = {
        loaded: 500,
        total: 1000,
        progress: 0.5,
        bytes: 500,
        rate: 1000,
        estimated: 0.5,
        upload: false,
        download: true,
        event: undefined
      };

      logProgress(progressEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Loaded: 500, Total: 1000');
      
      consoleSpy.mockRestore();
    });

    it('should handle undefined total', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const progressEvent: AxiosProgressEvent = {
        loaded: 300,
        total: undefined,
        progress: undefined,
        bytes: 300,
        rate: 1000,
        estimated: undefined,
        upload: false,
        download: true,
        event: undefined
      };

      logProgress(progressEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Loaded: 300, Total: undefined');
      
      consoleSpy.mockRestore();
    });
  });

  describe('progressHistory', () => {
    it('should contain initial progress event', () => {
      expect(progressHistory).toHaveLength(1);
      expect(progressHistory[0]).toMatchObject({
        loaded: 0,
        total: 100,
        progress: 0,
        bytes: 0,
        rate: 0,
        estimated: undefined,
        upload: true,
        download: false,
        event: undefined
      });
    });
  });

  describe('extendedProgress', () => {
    it('should have correct properties from base and extended', () => {
      expect(extendedProgress).toMatchObject({
        loaded: 50,
        total: 100,
        progress: 0.5,
        bytes: 50,
        rate: 1000,
        estimated: 0.5,
        upload: false,
        download: true,
        event: undefined
      });
    });
  });

  describe('simulateProgress', () => {
    it('should return a promise that resolves to progress event', async () => {
      const progressEvent = await simulateProgress();
      
      expect(progressEvent).toMatchObject({
        loaded: 1000,
        total: 1000,
        progress: 1,
        bytes: 1000,
        rate: 2000,
        estimated: 0,
        upload: false,
        download: true,
        event: undefined
      });
    });
  });

  describe('processEvent', () => {
    it('should add processed property to event', () => {
      const originalEvent: AxiosProgressEvent = {
        loaded: 200,
        total: 400,
        progress: 0.5,
        bytes: 200,
        rate: 1000,
        estimated: 0.2,
        upload: false,
        download: true,
        event: undefined
      };

      const processedEvent = processEvent(originalEvent);

      expect(processedEvent).toMatchObject({
        ...originalEvent,
        processed: true
      });
    });

    it('should preserve all original properties', () => {
      const originalEvent: AxiosProgressEvent = {
        loaded: 150,
        total: 300,
        progress: 0.5,
        bytes: 150,
        rate: 2000,
        estimated: 0.075,
        upload: true,
        download: false,
        event: { type: 'progress' }
      };

      const processedEvent = processEvent(originalEvent);

      expect(processedEvent.loaded).toBe(originalEvent.loaded);
      expect(processedEvent.total).toBe(originalEvent.total);
      expect(processedEvent.progress).toBe(originalEvent.progress);
      expect(processedEvent.bytes).toBe(originalEvent.bytes);
      expect(processedEvent.rate).toBe(originalEvent.rate);
      expect(processedEvent.estimated).toBe(originalEvent.estimated);
      expect(processedEvent.upload).toBe(originalEvent.upload);
      expect(processedEvent.download).toBe(originalEvent.download);
      expect(processedEvent.event).toBe(originalEvent.event);
    });
  });
}); 