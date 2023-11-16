import * as ejsprima from './ejsprima';

export function EjsRenderer(props: { template: string; data: object }) {
  try {
    let usedVarsObj = ejsprima.extractUsedVarsFromTemplate(props.template);
    let usedVars: string[] = Array.from(
      new Set(usedVarsObj.reads.concat(usedVarsObj.writes)),
    );
    // TODO: check if all used vars are given in data
    let html = window.ejs.render(props.template, props.data);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (err) {
    // TODO: meaningful output for non-technical users for ReferenceErrors (read data not given) and TypeErrors (read property of undefined)
    return <pre>{String(err)}</pre>;
  }
}
