import { RuleTester } from 'eslint';
import rule from '../src/rules/html-compat';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  }
});

describe('html-compat rule', () => {
  ruleTester.run('html-compat', rule, {
    valid: [
      {
        code: '<div>Hello World</div>',
        options: [{ browserslistConfig: ['> 1%'] }]
      },
      {
        code: '<span className="test">Content</span>',
        options: [{ browserslistConfig: ['> 1%'] }]
      },
      {
        code: '<p id="paragraph">Text</p>',
        options: [{ browserslistConfig: ['> 1%'] }]
      },
      {
        code: '<dialog>Modal content</dialog>',
        options: [{ 
          browserslistConfig: ['ie 11'], 
          ignoreBrowsers: ['ie 11'] 
        }]
      },
      {
        code: '<details><summary>Summary</summary>Details</details>',
        options: [{ 
          browserslistConfig: ['ie 11'], 
          ignoreBrowsers: ['ie'] 
        }]
      }
    ],
    
    invalid: [
      {
        code: '<dialog>Modal content</dialog>',
        options: [{ browserslistConfig: ['ie 11'] }],
        errors: [
          {
            messageId: 'incompatibleElement'
          }
        ]
      },
      {
        code: '<details><summary>Summary</summary>Details</details>',
        options: [{ browserslistConfig: ['ie 11'] }],
        errors: [
          {
            messageId: 'incompatibleElement'
          },
          {
            messageId: 'incompatibleElement'
          }
        ]
      },
      {
        code: '<dialog>Modal content</dialog>',
        options: [{ 
          browserslistConfig: ['ie 11', 'firefox 50'], 
          ignoreBrowsers: ['ie 11'] 
        }],
        errors: [
          {
            messageId: 'incompatibleElement'
          }
        ]
      }
    ]
  });
});