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

  useEffect(() => {
    try {
      let usedVarsObj = ejsprima.extractUsedVarsFromTemplate(template);
      let usedVars: string[] = Array.from(
        new Set(usedVarsObj.reads.concat(usedVarsObj.writes)),
      );
      //console .log('Rendering uses vars:', usedVars);
      //console .log('Provided data:', props.data);
      // TODO: check if all used vars are given in data
      let html = window.ejs.render(template, data);

      setRenderedHtmlStr(html);
      setRenderError(null);
    } catch (err) {
      // TODO: meaningful output for non-technical users for ReferenceErrors (read data not given) and TypeErrors (read property of undefined)
      setRenderError(String(err));
      setRenderedHtmlStr(null);
    }
  }, [template, data]);

  useEffect(() => {
    if (renderedHtmlStr && outerRef) {
      Object.entries(data.clickListener).forEach(
        ([clazzName, listener]: [clazzName: string, listener: () => void]) => {
          const elements = outerRef.current?.getElementsByClassName(clazzName);
          if (elements != null) {
            for (let i = 0; i < elements.length; i++) {
              elements.item(i)?.addEventListener('click', listener);
              elements.item(i)?.classList.add('cursor-pointer');
            }
          }
        },
      );
    }
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
