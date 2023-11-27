import { useEffect, useRef, useState } from 'react';
import * as ejsprima from './ejsprima';

export function EjsRenderer({
  template,
  data,
}: {
  template: string;
  data: { clickListener: { [listenerClazz: string]: () => void } } & {
    [key: string]: any;
  };
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [renderedHtmlStr, setRenderedHtmlStr] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // render html string
  useEffect(() => {
    try {
      let usedVarsObj = ejsprima.extractUsedVarsFromTemplate(template);
      let usedVars: string[] = Array.from(
        new Set(usedVarsObj.reads.concat(usedVarsObj.writes)),
      );
      // set used vars to undefined if not given (less errors in the script)
      const missingVars = usedVars.filter((varName) => !(varName in data));
      const missingVarObjects = missingVars.map((varName) => ({
        [varName]: undefined,
      }));
      const missingVarObj = Object.assign({}, ...missingVarObjects);

      let html = window.ejs.render(template, {
        ...missingVarObj,
        ...data,
        encodeURI: encodeURI,
        JSON: JSON, // to make it possible for debugging to use JSON.stringify
      });

      setRenderedHtmlStr(html);
      setRenderError(null);
    } catch (err) {
      // TODO: meaningful output for non-technical users for ReferenceErrors (read data not given) and TypeErrors (read property of undefined)
      setRenderError(String(err));
      setRenderedHtmlStr(null);
    }
  }, [template, data]);

  // set clickListeners to html elements + make a elements open in new tab
  useEffect(() => {
    const currentOuterRef = outerRef.current;

    if (renderedHtmlStr && outerRef) {
      Object.entries(data.clickListener).forEach(
        ([clazzName, listener]: [clazzName: string, listener: () => void]) => {
          const elements = currentOuterRef?.getElementsByClassName(clazzName);
          if (elements != null) {
            for (let i = 0; i < elements.length; i++) {
              elements.item(i)?.addEventListener('click', listener);
              elements.item(i)?.classList.add('cursor-pointer');
            }
          }
        },
      );

      const aElements = currentOuterRef?.getElementsByTagName('a');
      if (aElements != null) {
        for (let i = 0; i < aElements.length; i++) {
          aElements.item(i)?.setAttribute('target', '_blank');
        }
      }
    }

    // to prevent adding multiple event listeners
    return () => {
      Object.entries(data.clickListener).forEach(
        ([clazzName, listener]: [clazzName: string, listener: () => void]) => {
          const elements = currentOuterRef?.getElementsByClassName(clazzName);
          if (elements != null) {
            for (let i = 0; i < elements.length; i++) {
              elements.item(i)?.removeEventListener('click', listener);
              elements.item(i)?.classList.remove('cursor-pointer');
            }
          }
        },
      );
    };
  }, [renderedHtmlStr, outerRef, data.clickListener]);

  if (renderedHtmlStr && !renderError) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: renderedHtmlStr }}
        ref={outerRef}
      />
    );
  } else {
    return <pre>{String(renderError)}</pre>;
  }
}
