import React, { useEffect, useState } from 'react';
import * as hljs from 'highlight.js';
import { COMMENT } from 'highlight.js';

const LanguageRegistration: React.FC = () => {
  const [registeredLanguages, setRegisteredLanguages] = useState<string[]>([]);
  const [customLanguageName, setCustomLanguageName] = useState('custom-lang');

  useEffect(() => {
    const languages = hljs.listLanguages();
    setRegisteredLanguages(languages);
  }, []);

  const createCustomLanguage = (hljs?: hljs.HLJSStatic) => {
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
        hljs!.C_LINE_COMMENT_MODE,
        hljs!.C_BLOCK_COMMENT_MODE,
        hljs!.QUOTE_STRING_MODE,
        hljs!.APOS_STRING_MODE,
        hljs!.C_NUMBER_MODE,
        {
          className: 'function',
          beginKeywords: 'function',
          end: /\{/,
          excludeEnd: true,
          contains: [
            hljs!.UNDERSCORE_TITLE_MODE,
            {
              className: 'params',
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              contains: [
                hljs!.C_BLOCK_COMMENT_MODE
              ]
            }
          ]
        },
        {
          className: 'class',
          beginKeywords: 'class',
          end: /\{/,
          excludeEnd: true,
          contains: [hljs!.TITLE_MODE]
        },
        COMMENT('/\\*\\*', '\\*/', {
          contains: [
            {
              className: 'doctag',
              begin: '@[A-Za-z]+'
            }
          ]
        } as hljs.IMode),
        {
          className: 'variable',
          begin: '\\$' + hljs!.IDENT_RE,
          relevance: 0
        },
        {
          className: 'number',
          begin: hljs!.C_NUMBER_RE,
          relevance: 0
        },
        {
          className: 'binary',
          begin: hljs!.BINARY_NUMBER_RE,
          relevance: 0
        }
      ]
    } as hljs.IModeBase;
  };

  const registerCustomLanguage = () => {
    try {
      hljs.registerLanguage(customLanguageName, createCustomLanguage);
      
      const updatedLanguages = hljs.listLanguages();
      setRegisteredLanguages(updatedLanguages);
      
      console.log(`Custom language '${customLanguageName}' registered successfully`);
    } catch (error) {
      console.error('Failed to register custom language:', error);
    }
  };

  const testLanguage = (languageName: string) => {
    try {
      const langDef = hljs.getLanguage(languageName);
      if (langDef) {
        console.log(`Language '${languageName}' definition:`, langDef);
        
        const testCode = `function hello() {
  var message = "Hello World";
  console.log(message);
  /* This is a block comment */
  return true;
}`;
        
        const result = hljs.highlight(languageName, testCode, false);
        console.log(`Highlighted with '${languageName}':`, result);
      } else {
        console.log(`Language '${languageName}' not found`);
      }
    } catch (error) {
      console.error(`Error testing language '${languageName}':`, error);
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
    
    console.log('Extended comment mode:', extendedComment);
    console.log('Extended string mode:', extendedString);
  };

  return (
    <div className="language-registration">
      <h3>Language Registration (Using Deprecated APIs)</h3>
      
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

      <div className="language-list">
        <h4>Registered Languages ({registeredLanguages.length}):</h4>
        <div className="language-grid">
          {registeredLanguages.map((lang) => (
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
        <button onClick={createInheritedModes}>
          Create Inherited Modes
        </button>
        
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

      <div className="deprecated-functions">
        <h4>Deprecated Functions Used:</h4>
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

export default LanguageRegistration; 