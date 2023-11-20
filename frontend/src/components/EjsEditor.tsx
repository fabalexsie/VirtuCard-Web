import { Editor, useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import {
  language as languageDef,
  conf as languageConfig,
} from '../monaco-ejs/ejs-language-defs';
import { IDisposable } from 'monaco-editor';
import { html_beautify } from 'js-beautify';

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

      monaco.languages.registerDocumentFormattingEditProvider('ejs', {
        provideDocumentFormattingEdits: (model, options, token) => {
          return [
            {
              range: model.getFullModelRange(),
              text: html_beautify(model.getValue(), {
                indent_size: 2,
                preserve_newlines: true,
                max_preserve_newlines: 2,
                end_with_newline: true,
              }),
            },
          ];
        },
      });
      monaco.languages.registerDocumentRangeFormattingEditProvider('ejs', {
        provideDocumentRangeFormattingEdits: (model, range, options, token) => {
          // modify range to match complete lines
          range = new monaco.Range(
            range.startLineNumber,
            1,
            range.endLineNumber,
            model.getLineMaxColumn(range.endLineNumber),
          );

          return [
            {
              range: range,
              text: html_beautify(model.getValueInRange(range), {
                indent_size: 2,
                preserve_newlines: true,
                max_preserve_newlines: 2,
                end_with_newline: false,
              }),
            },
          ];
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
