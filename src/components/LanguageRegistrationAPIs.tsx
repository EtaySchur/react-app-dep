import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js';

const LanguageRegistrationAPIs: React.FC = () => {
  const [registeredLanguages, setRegisteredLanguages] = useState<string[]>([]);
  const [customLanguageName, setCustomLanguageName] = useState('custom-lang');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const languages = hljs.listLanguages();
    setRegisteredLanguages(languages);
  }, []);

  const createCustomLanguage = () => {
    return {
      name: 'Custom Language',
      aliases: ['custom', 'cust'],
      case_insensitive: false,
      keywords: {
        keyword: 'function var let const if else for while',
        literal: 'true false null undefined',
        built_in: 'console log error warn'
      },
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.APOS_STRING_MODE,
        hljs.C_NUMBER_MODE,
        {
          className: 'function',
          beginKeywords: 'function',
          end: /\{/,
          excludeEnd: true,
          contains: [
            hljs.UNDERSCORE_TITLE_MODE,
            {
              className: 'params',
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              contains: [
                hljs.C_BLOCK_COMMENT_MODE
              ]
            }
          ]
        },
        {
          className: 'class',
          beginKeywords: 'class',
          end: /\{/,
          excludeEnd: true,
          contains: [hljs.TITLE_MODE]
        },
        hljs.COMMENT('/\\*\\*', '\\*/', {}),
        {
          className: 'variable',
          begin: '\\$' + hljs.IDENT_RE,
          relevance: 0
        },
        {
          className: 'number',
          begin: hljs.C_NUMBER_RE,
          relevance: 0
        },
        {
          className: 'binary',
          begin: hljs.BINARY_NUMBER_RE,
          relevance: 0
        }
      ]
    };
  };

  const registerCustomLanguage = () => {
    try {
      hljs.registerLanguage(customLanguageName, createCustomLanguage);
      
      const updatedLanguages = hljs.listLanguages();
      setRegisteredLanguages(updatedLanguages);
      
      setTestResult(`Custom language '${customLanguageName}' registered successfully`);
    } catch (error) {
      setTestResult(`Failed to register custom language: ${error}`);
    }
  };

  const testLanguage = (languageName: string) => {
    try {
      const langDef = hljs.getLanguage(languageName);
      if (langDef) {
        const testCode = `function hello() {
  var message = "Hello World";
  console.log(message);
  /* This is a block comment */
  return true;
}`;
        
        const result = hljs.highlight(languageName, testCode, false);
        setTestResult(`Language '${languageName}' test result: ${result.value}`);
      } else {
        setTestResult(`Language '${languageName}' not found`);
      }
    } catch (error) {
      setTestResult(`Error testing language '${languageName}': ${error}`);
    }
  };

  const createInheritedModes = () => {
    const baseComment = hljs.C_LINE_COMMENT_MODE;
    
    const extendedComment = hljs.inherit(baseComment, {
      className: 'special-comment',
      begin: '// @',
      relevance: 10
    });
    
    const baseString = hljs.QUOTE_STRING_MODE;
    const extendedString = hljs.inherit(baseString, {
      className: 'template-string',
      contains: [
        hljs.BACKSLASH_ESCAPE,
        {
          className: 'subst',
          begin: '\\${',
          end: '}',
          keywords: 'var let const'
        }
      ]
    });
    
    setTestResult('Extended modes created successfully');
  };

  const createModeExamples = () => {
    const modes = {
      cLineComment: hljs.C_LINE_COMMENT_MODE,
      cBlockComment: hljs.C_BLOCK_COMMENT_MODE,
      hashComment: hljs.HASH_COMMENT_MODE,
      numberMode: hljs.NUMBER_MODE,
      cNumberMode: hljs.C_NUMBER_MODE,
      binaryNumberMode: hljs.BINARY_NUMBER_MODE,
      cssNumberMode: hljs.CSS_NUMBER_MODE,
      regexMode: hljs.REGEX_MODE,
      titleMode: hljs.TITLE_MODE,
      underscoreTitleMode: hljs.UNDERSCORE_TITLE_MODE
    };

    const regexPatterns = {
      ident: hljs.IDENT_RE,
      underscoreIdent: hljs.UNDERSCORE_IDENT_RE,
      number: hljs.NUMBER_RE,
      cNumber: hljs.C_NUMBER_RE,
      binaryNumber: hljs.BINARY_NUMBER_RE,
      reStarters: hljs.RE_STARTERS_RE
    };

    setTestResult(`Created ${Object.keys(modes).length} modes and ${Object.keys(regexPatterns).length} regex patterns`);
  };

  return (
    <div className="language-registration">
      <h3>Language Registration</h3>
      
      <div className="registration-controls">
        <div className="input-group">
          <label htmlFor="custom-lang-name">Custom Language Name:</label>
          <input 
            id="custom-lang-name"
            type="text"
            value={customLanguageName}
            onChange={(e) => setCustomLanguageName(e.target.value)}
            placeholder="Enter language name"
          />
          <button onClick={registerCustomLanguage}>
            Register Language
          </button>
        </div>
      </div>

      <div className="test-result">
        <h4>Test Result:</h4>
        <pre>{testResult}</pre>
      </div>

      <div className="language-list">
        <h4>Registered Languages ({registeredLanguages.length}):</h4>
        <div className="language-grid">
          {registeredLanguages.slice(0, 30).map((lang) => (
            <div key={lang} className="language-item">
              <span className="language-name">{lang}</span>
              <button 
                onClick={() => testLanguage(lang)}
                className="test-button"
              >
                Test
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mode-examples">
        <h4>Mode Examples:</h4>
        <div className="button-group">
          <button onClick={createInheritedModes}>
            Create Inherited Modes
          </button>
          <button onClick={createModeExamples}>
            Create Mode Examples
          </button>
        </div>
        
        <div className="mode-showcase">
          <h5>Available Mode Constants:</h5>
          <ul>
            <li>C_LINE_COMMENT_MODE</li>
            <li>C_BLOCK_COMMENT_MODE</li>
            <li>HASH_COMMENT_MODE</li>
            <li>QUOTE_STRING_MODE</li>
            <li>APOS_STRING_MODE</li>
            <li>BACKSLASH_ESCAPE</li>
            <li>NUMBER_MODE</li>
            <li>C_NUMBER_MODE</li>
            <li>BINARY_NUMBER_MODE</li>
            <li>CSS_NUMBER_MODE</li>
            <li>REGEX_MODE</li>
            <li>TITLE_MODE</li>
            <li>UNDERSCORE_TITLE_MODE</li>
            <li>PHRASAL_WORDS_MODE</li>
          </ul>
        </div>

        <div className="regex-showcase">
          <h5>Available Regex Constants:</h5>
          <ul>
            <li>IDENT_RE</li>
            <li>UNDERSCORE_IDENT_RE</li>
            <li>NUMBER_RE</li>
            <li>C_NUMBER_RE</li>
            <li>BINARY_NUMBER_RE</li>
            <li>RE_STARTERS_RE</li>
          </ul>
        </div>
      </div>

      <div className="api-functions">
        <h4>API Functions:</h4>
        <ul>
          <li><code>hljs.registerLanguage()</code> - Register custom language</li>
          <li><code>hljs.listLanguages()</code> - Get available languages</li>
          <li><code>hljs.getLanguage()</code> - Get language definition</li>
          <li><code>hljs.highlight()</code> - Highlight with specific language</li>
          <li><code>hljs.inherit()</code> - Inherit mode properties</li>
          <li><code>hljs.COMMENT()</code> - Create comment modes</li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageRegistrationAPIs; 