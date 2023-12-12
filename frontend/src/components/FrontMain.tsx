import { Person } from '../utils/data';
import { downloadVcf } from '../utils/utilContact';
import { EjsRenderer } from './EjsRenderer';
import { useEffect, useState } from 'react';

export default function FrontMain({
  personData,
  templateStr,
}: {
  personData: Person;
  templateStr?: string;
}) {
  const [template, setTemplate] = useState<string>(templateStr || '');

  // load template if templateStr is undefined
  useEffect(() => {
    if (templateStr === undefined) {
      fetch(`/api/t/${personData.theme.selectedName}`).then(async (res) => {
        if (200 <= res.status && res.status < 300) {
          setTemplate((await res.json()).template);
        } else {
          setTemplate(
            `<h1>Error loading template: ${personData.theme.selectedName}</h1>`,
          );
        }
      });
    }
  }, [templateStr, personData]);

  // update template if templateStr changes
  useEffect(() => {
    if (templateStr) setTemplate(templateStr);
  }, [templateStr]);

  return (
    <div className="w-full h-full text-center overflow-y-auto touch-pan-y select-none">
      <EjsRenderer
        template={template}
        data={{
          ...personData,
          clickListener: {
            downloadVcf: () => downloadVcf(personData),
          },
        }}
      />
    </div>
  );
}
