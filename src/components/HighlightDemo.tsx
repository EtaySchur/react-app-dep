import React, { useState } from 'react';
import HighlightComponent from './HighlightComponent';

const HighlightDemo: React.FC = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log("Fibonacci of 10:", result);

// This is a comment
const array = [1, 2, 3, 4, 5];
const doubled = array.map(x => x * 2);

class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(value) {
    this.result += value;
    return this;
  }
  
  multiply(value) {
    this.result *= value;
    return this;
  }
}`);

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [autoDetect, setAutoDetect] = useState(false);

  const sampleCodes = {
    javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f"Fibonacci of 10: {result}")`,
    java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        int result = fibonacci(10);
        System.out.println("Fibonacci of 10: " + result);
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(10);
    cout << "Fibonacci of 10: " << result << endl;
    return 0;
}`
  };

  return (
    <div className="highlight-demo">
      <h2>Highlight.js Legacy API Demo</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="language-select">Language:</label>
          <select 
            id="language-select"
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={autoDetect}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="auto-detect">
            <input 
              id="auto-detect"
              type="checkbox" 
              checked={autoDetect} 
              onChange={(e) => setAutoDetect(e.target.checked)}
            />
            Auto-detect language
          </label>
        </div>
      </div>

      <div className="sample-codes">
        <h3>Sample Codes:</h3>
        <div className="sample-buttons">
          {Object.entries(sampleCodes).map(([lang, sampleCode]) => (
            <button 
              key={lang}
              onClick={() => {
                setCode(sampleCode);
                if (!autoDetect) {
                  setSelectedLanguage(lang);
                }
              }}
            >
              Load {lang} sample
            </button>
          ))}
        </div>
      </div>

      <div className="code-input">
        <h3>Code Input:</h3>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={15}
          cols={80}
          placeholder="Enter your code here..."
        />
      </div>

      <div className="highlight-output">
        <h3>Highlighted Output:</h3>
        <HighlightComponent 
          code={code}
          language={selectedLanguage}
          autoDetect={autoDetect}
        />
      </div>

      <div className="api-usage">
        <h3>Legacy APIs Used:</h3>
        <ul>
          <li><code>hljs.configure()</code> - Configure highlight.js options</li>
          <li><code>hljs.highlight()</code> - Highlight code with specific language</li>
          <li><code>hljs.highlightAuto()</code> - Auto-detect and highlight</li>
          <li><code>hljs.fixMarkup()</code> - Fix markup issues</li>
          <li><code>hljs.highlightBlock()</code> - Highlight DOM element</li>
          <li><code>hljs.getLanguage()</code> - Get language definition</li>
          <li><code>hljs.listLanguages()</code> - List available languages</li>
          <li><code>hljs.initHighlighting()</code> - Initialize highlighting</li>
          <li><code>hljs.inherit()</code> - Inherit mode properties</li>
          <li><code>hljs.COMMENT()</code> - Create comment modes</li>
          <li>Mode constants: <code>QUOTE_STRING_MODE</code>, <code>BACKSLASH_ESCAPE</code>, etc.</li>
          <li>Regex constants: <code>C_NUMBER_RE</code>, <code>BINARY_NUMBER_RE</code>, etc.</li>
        </ul>
      </div>
    </div>
  );
};

export default HighlightDemo; 