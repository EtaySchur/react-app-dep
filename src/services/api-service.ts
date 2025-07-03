import { AxiosProgressEvent } from 'axios';

const mockProgressEvent: AxiosProgressEvent = {
  loaded: 1024,
  total: 2048,
  progress: 0.5,
  bytes: 1024,
  rate: 1000,
  estimated: 1,
  upload: false,
  download: true,
  event: undefined
};

const createTestProgressEvent = (loaded: number, total: number): AxiosProgressEvent => ({
  loaded,
  total,
  progress: loaded / total,
  bytes: loaded,
  rate: 1000,
  estimated: (total - loaded) / 1000,
  upload: false,
  download: true,
  event: undefined
});

class CustomProgressEvent implements AxiosProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: any;
  lengthComputable: boolean;

  constructor(loaded: number, total?: number) {
    this.loaded = loaded;
    this.total = total;
    this.progress = total ? loaded / total : undefined;
    this.bytes = loaded;
    this.lengthComputable = total !== undefined;
  }
}

function processProgress({ loaded, total, progress }: AxiosProgressEvent) {
  const percentage = total ? (loaded / total) * 100 : 0;
  return percentage;
}

const fakeProgress = {
  loaded: 100,
  total: 200,
  progress: 0.5,
  bytes: 100,
  lengthComputable: true
} as AxiosProgressEvent;

function logProgress(event: AxiosProgressEvent) {
  console.log(`Loaded: ${event.loaded}, Total: ${event.total}, Length Computable: ${event.lengthComputable}`);
}

const progressHistory: AxiosProgressEvent[] = [
  {
    loaded: 0,
    total: 100,
    progress: 0,
    bytes: 0,
    rate: 0,
    estimated: undefined,
    upload: true,
    download: false,
    event: undefined,
    lengthComputable: false
  }
];

const baseProgress = {
  loaded: 50,
  total: 100,
  progress: 0.5,
  bytes: 50
};

const extendedProgress: AxiosProgressEvent = {
  ...baseProgress,
  rate: 1000,
  estimated: 0.5,
  upload: false,
  download: true,
  event: undefined
};

function simulateProgress(): Promise<AxiosProgressEvent> {
  return Promise.resolve({
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
}

function processEvent<T extends AxiosProgressEvent>(event: T): T {
  return {
    ...event,
    processed: true
  } as T;
}

export {
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
}; 