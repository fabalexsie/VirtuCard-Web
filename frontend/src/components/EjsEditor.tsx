import { Editor, useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import {
  language as languageDef,
  conf as languageConfig,
} from '../monaco-ejs/ejs-language-defs';
import { IDisposable } from 'monaco-editor';

export default function EjsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
}) {
  const monaco = useMonaco();

  useEffect(() => {
    let disponsable: IDisposable | undefined = undefined;
    if (monaco) {
      monaco.languages.register({ id: 'ejs' });
      monaco.languages.setMonarchTokensProvider('ejs', languageDef);
      monaco.languages.setLanguageConfiguration('ejs', languageConfig);
      const customEjsVars = [
        'firstname',
        'lastname',
        'email',
        'phone',
        'address',
        'website',
        'linkedin',
        'github',
        'birthday',
        'notes',
      ];
      // registration for * to support other (text) providers as well ~https://stackoverflow.com/a/72905458
      disponsable = monaco.languages.registerCompletionItemProvider('*', {
        provideCompletionItems: (model, position, context, token) => {
          return {
            suggestions: customEjsVars.map((varName) => {
              return {
                label: varName,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: varName,
                range: new monaco.Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column,
                ),
              };
            }),
          };
        },
      });
    }

    return () => {
      if (monaco) {
        disponsable?.dispose();
      }
    };
  }, [monaco]);

  return (
    <Editor
      className="w-full my-6"
      value={value}
      defaultLanguage="ejs"
      theme="vs-dark"
      options={{
        wordWrap: 'on',
        wrappingIndent: 'indent',
      }}
      onChange={onChange}
    />
  );
}
