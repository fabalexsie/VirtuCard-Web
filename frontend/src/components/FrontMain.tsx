import { Button } from '@nextui-org/react';
import { Person } from '../utils/data';
import { downloadVcf } from '../utils/utilContact';
import { EjsRenderer } from './EjsRenderer';

export default function FrontMain({ personData }: { personData: Person }) {
  return (
    <div className="w-full h-full text-center">
      <h1>Front</h1>
      <pre className="text-left">{JSON.stringify(personData, null, 2)}</pre>
      <Button onPress={() => downloadVcf(personData)}>Download VCF</Button>
      <EjsRenderer
        template="Hello <%= name %><% if (from) { %> from <%= from %><% } %>!"
        data={{ name: 'World', from: undefined }}
      />
    </div>
  );
}
