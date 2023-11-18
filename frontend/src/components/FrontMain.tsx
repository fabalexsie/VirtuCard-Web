import { Button } from '@nextui-org/react';
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

  useEffect(() => {
    if (templateStr === undefined) {
      fetch(`/api/template/${personData.theme.selectedName}`).then(
        async (res) => {
          if (200 <= res.status && res.status < 300) {
            setTemplate(await res.text());
          } else {
            setTemplate(
              `<h1>Error loading template: ${personData.theme.selectedName}</h1>`,
            );
          }
        },
      );
    }
  }, [templateStr, personData]);

  return (
    <div className="w-full h-full text-center">
      <h1>Front</h1>
      <pre className="text-left">{JSON.stringify(personData, null, 2)}</pre>
      <Button onPress={() => downloadVcf(personData)}>Download VCF</Button>
      <EjsRenderer
        template={template}
        data={{ ...personData, from: undefined }}
      />
    </div>
  );
}
