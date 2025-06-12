import React, { useState, useEffect } from 'react';
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
} from '../services/api-service';

const AxiosBreakingChangesDemo: React.FC = () => {
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    runDemo();
  }, []);

  const runDemo = async () => {
    console.log('Mock Progress Event:', mockProgressEvent);
    logProgress(mockProgressEvent);

    const testEvent = createTestProgressEvent(500, 1000);
    console.log('Test Progress Event:', testEvent);
    const percentage = processProgress(testEvent);
    console.log('Calculated percentage:', percentage);

    const customEvent = new CustomProgressEvent(750, 1500);
    console.log('Custom Progress Event:', customEvent);

    console.log('Fake Progress:', fakeProgress);
    logProgress(fakeProgress);

    console.log('Progress History:', progressHistory);
    progressHistory.forEach(logProgress);

    console.log('Extended Progress:', extendedProgress);
    logProgress(extendedProgress);

    const simulatedProgress = await simulateProgress();
    console.log('Simulated Progress:', simulatedProgress);
    const processedEvent = processEvent(simulatedProgress);
    console.log('Processed Event:', processedEvent);
    setProgressData(simulatedProgress);
  };

  return (
    <div>
      <button onClick={runDemo}>Run Demo</button>
      {progressData && (
        <div>
          <p>Loaded: {progressData.loaded}</p>
          <p>Total: {progressData.total}</p>
          <p>Progress: {progressData.progress}</p>
        </div>
      )}
    </div>
  );
};

export default AxiosBreakingChangesDemo; 