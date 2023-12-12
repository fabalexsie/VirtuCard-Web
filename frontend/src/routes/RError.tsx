import { Link } from '@nextui-org/react';

export default function RError() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">
        Unfortunately this page does not exist.
      </h1>
      <Link className="text-xl mt-4" href="/">
        Go back to the homepage
      </Link>
    </div>
  );
}
