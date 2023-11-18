import { Person } from '../utils/data';

export default function FrontMain({ personData }: { personData: Person }) {
  return (
    <div className="w-full h-full text-center">
      <h1>Front</h1>
      <pre>{JSON.stringify(personData)}</pre>
    </div>
  );
}
