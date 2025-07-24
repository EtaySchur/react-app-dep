import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const SimpleHighlightDemo: React.FC = () => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [javascriptCode, setJavascriptCode] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [customMode, setCustomMode] = useState<any>(null);

  useEffect(() => {
    const fixedMarkup = hljs.fixMarkup('<span class="hljs-keyword">function</span> <span class="hljs-title">hello</span>() { <span class="hljs-keyword">return</span> <span class="hljs-string">"world"</span>; }');
    const cssMode = hljs.C_NUMBER_MODE;
    
    const result1 = hljs.highlight('javascript', 'function calculateSum(a, b) { return a + b; }');
    hljs.highlightBlock(document.createElement('pre'));
    hljs.initHighlighting();
    
    const customLanguage = {
      name: 'custom-language',
      contains: [
        cssMode,
      ]
    };
    
    hljs.registerLanguage('custom-language', function() {
      return customLanguage as any;
    });
    
    const customResult = hljs.highlight('custom-language', 'const value = 42px; const pattern = /[a-z]+/g;', false);
    
    const mode = {
      ...cssMode,
      className: 'custom-highlight'
    };
    
    setHighlightedCode(fixedMarkup);
    setJavascriptCode(result1.value);
    setCustomCode(customResult.value);
    setCustomMode(mode);
  }, []);

  return (
    <div className="simple-highlight-demo">
                        <h3>Syntax Highlighting Demo</h3>
      
                        <div className="code-output">
                    <h4>Fixed Markup:</h4>
                    <pre>
                      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </pre>
                    
                    <h4>JavaScript Highlighting:</h4>
                    <pre>
                      <code dangerouslySetInnerHTML={{ __html: javascriptCode }} />
                    </pre>
                    
                    <h4>Custom Language:</h4>
                    <pre>
                      <code dangerouslySetInnerHTML={{ __html: customCode }} />
                    </pre>
                  </div>
                  

    </div>
  );
};

export default SimpleHighlightDemo; 