import React, { useState, useEffect } from 'react';
import { Metric } from 'web-vitals';
import reportWebVitals from '../utils/reports';

interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const WebVitalsDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<WebVitalMetric[]>([]);

  useEffect(() => {
    // Function to handle web vitals reporting
    const handlePerfEntry = (metric: Metric) => {
      console.log('Web Vital collected:', metric);
      
      setMetrics(prevMetrics => {
        // Update existing metric or add new one
        const existingIndex = prevMetrics.findIndex(m => m.name === metric.name);
        const roundedValue = Math.round(metric.value * 100) / 100;
        const newMetric: WebVitalMetric = {
          name: metric.name,
          value: roundedValue, // Round to 2 decimal places
          delta: Math.round(metric.delta * 100) / 100,
          id: metric.id,
          rating: getMetricRating(metric.name, roundedValue)
        };

        if (existingIndex >= 0) {
          const updated = [...prevMetrics];
          updated[existingIndex] = newMetric;
          return updated;
        } else {
          return [...prevMetrics, newMetric];
        }
      });
    };

    // Start collecting web vitals
    reportWebVitals(handlePerfEntry);
  }, []);

  const getMetricDescription = (name: string) => {
    switch (name) {
      case 'CLS':
        return 'Cumulative Layout Shift - measures visual stability';
      case 'FID':
        return 'First Input Delay - measures interactivity';
      case 'FCP':
        return 'First Contentful Paint - measures loading performance';
      case 'LCP':
        return 'Largest Contentful Paint - measures loading performance';
      case 'TTFB':
        return 'Time to First Byte - measures server response time';
      default:
        return 'Web performance metric';
    }
  };

  const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (name) {
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return '#4CAF50';
      case 'needs-improvement':
        return '#FF9800';
      case 'poor':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Web Vitals Performance Metrics</h2>
      <p>This component demonstrates the usage of the reportWebVitals utility.</p>
      
      {metrics.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          textAlign: 'center' 
        }}>
          <p>Loading web vitals metrics...</p>
          <small>Interact with the page to generate some metrics!</small>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h3>Collected Metrics:</h3>
          {metrics.map((metric) => (
            <div
              key={metric.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                margin: '10px 0',
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                  {metric.name}
                </h4>
                <span
                  style={{
                    backgroundColor: getRatingColor(metric.rating),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {metric.rating}
                </span>
              </div>
              
              <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                {getMetricDescription(metric.name)}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>Value:</strong>
                  <br />
                  <span style={{ fontSize: '18px', color: '#333' }}>
                    {metric.value}
                    {metric.name === 'CLS' ? '' : 'ms'}
                  </span>
                </div>
                <div>
                  <strong>Delta:</strong>
                  <br />
                  <span style={{ fontSize: '18px', color: '#666' }}>
                    {metric.delta}
                    {metric.name === 'CLS' ? '' : 'ms'}
                  </span>
                </div>
              </div>
              
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                ID: {metric.id}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h4>How to test:</h4>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Navigate around the app to generate LCP and FCP metrics</li>
          <li>Click buttons or interact with elements to generate FID metrics</li>
          <li>Scroll and trigger layout shifts to generate CLS metrics</li>
          <li>TTFB is measured automatically on page load</li>
        </ul>
      </div>
    </div>
  );
};

export default WebVitalsDemo; 