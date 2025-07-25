// import React, { useEffect, useRef, useState } from 'react';
// import * as hljs from 'highlight.js';

// interface ModernHighlightComponentProps {
//   code: string;
//   language?: string;
//   autoDetect?: boolean;
// }

// const ModernHighlightComponent: React.FC<ModernHighlightComponentProps> = ({ 
//   code, 
//   language = 'javascript', 
//   autoDetect = false 
// }) => {
//   const codeRef = useRef<HTMLElement>(null);
//   const [highlightedCode, setHighlightedCode] = useState<string>('');
//   const [detectedLanguage, setDetectedLanguage] = useState<string>('');
//   const [relevance, setRelevance] = useState<number>(0);

//   useEffect(() => {
//     if (!code) return;

//     try {
//       hljs.configure({
//         classPrefix: 'hljs-',
//         tabReplace: '    ',
//         useBR: false,
//         languages: ['javascript', 'typescript', 'python', 'java', 'cpp']
//       });

//       let result: any;

//       if (autoDetect) {
//         result = hljs.highlightAuto(code, ['javascript', 'typescript', 'python']);
//         setDetectedLanguage(result.language || 'unknown');
        
//         if (result.second_best) {
//           console.log('Second best match:', result.second_best.language);
//         }
//       } else {
//         const langDef = hljs.getLanguage(language);
//         if (langDef) {
//           result = hljs.highlight(language, code);
//           setDetectedLanguage(language);
          
//           if (result.top) {
//             console.log('Compiled mode keywords:', result.top.keywords);
//             console.log('Terminators:', result.top.terminators);
//           }
//         } else {
//           result = hljs.highlightAuto(code);
//           setDetectedLanguage(result.language || 'unknown');
//         }
//       }

//       setRelevance(result.relevance);
//       setHighlightedCode(result.value);

//     } catch (error) {
//       console.error('Highlighting failed:', error);
//       setHighlightedCode(code);
//     }
//   }, [code, language, autoDetect]);

//   useEffect(() => {
//     hljs.initHighlighting();
    
//     const availableLanguages = hljs.listLanguages();
//     console.log('Available languages:', availableLanguages);
//   }, []);

//   const createCustomMode = () => {
//     return {
//       className: 'custom-string',
//       begin: hljs.QUOTE_STRING_MODE.begin,
//       end: hljs.QUOTE_STRING_MODE.end,
//       contains: [
//         hljs.BACKSLASH_ESCAPE,
//         hljs.APOS_STRING_MODE,
//         {
//           className: 'number',
//           begin: hljs.C_NUMBER_RE,
//           relevance: 0
//         },
//         {
//           className: 'binary',
//           begin: hljs.BINARY_NUMBER_RE,
//           relevance: 0
//         }
//       ],
//       keywords: {
//         keyword: 'function var let const',
//         literal: 'true false null undefined'
//       }
//     };
//   };

//   const commentMode = hljs.COMMENT('//', '$', {
//     contains: [hljs.PHRASAL_WORDS_MODE]
//   });

//   const modes = {
//     cLineComment: hljs.C_LINE_COMMENT_MODE,
//     cBlockComment: hljs.C_BLOCK_COMMENT_MODE,
//     hashComment: hljs.HASH_COMMENT_MODE,
//     numberMode: hljs.NUMBER_MODE,
//     cNumberMode: hljs.C_NUMBER_MODE,
//     binaryNumberMode: hljs.BINARY_NUMBER_MODE,
//     cssNumberMode: hljs.CSS_NUMBER_MODE,
//     regexMode: hljs.REGEXP_MODE,
//     titleMode: hljs.TITLE_MODE,
//     underscoreTitleMode: hljs.UNDERSCORE_TITLE_MODE
//   };

//   const regexPatterns = {
//     ident: hljs.IDENT_RE,
//     underscoreIdent: hljs.UNDERSCORE_IDENT_RE,
//     number: hljs.NUMBER_RE,
//     cNumber: hljs.C_NUMBER_RE,
//     binaryNumber: hljs.BINARY_NUMBER_RE,
//     reStarters: hljs.RE_STARTERS_RE
//   };

//   const inheritedMode = hljs.inherit(commentMode, {
//     className: 'special-comment',
//     relevance: 10
//   });

//   return (
//     <div className="highlight-wrapper">
//       <div className="highlight-info">
//         <span>Language: {detectedLanguage}</span>
//         <span>Relevance: {relevance}</span>
//         <span>Auto-detect: {autoDetect ? 'Yes' : 'No'}</span>
//         <span>API Version: 10.4.1+</span>
//       </div>
      
//       <pre className="highlight-container">
//         <code 
//           ref={codeRef}
//           className={`language-${detectedLanguage}`}
//           dangerouslySetInnerHTML={{ __html: highlightedCode }}
//         />
//       </pre>

//       <div className="mode-info">
//         <h4>Available Modes:</h4>
//         <ul>
//           {Object.entries(modes).map(([key, mode]) => (
//             <li key={key}>
//               {key}: {mode.className || 'no-class'}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="regex-info">
//         <h4>Regex Patterns:</h4>
//         <ul>
//           {Object.entries(regexPatterns).map(([key, pattern]) => (
//             <li key={key}>
//               {key}: {pattern}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ModernHighlightComponent; 