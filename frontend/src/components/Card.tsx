export function CardWrapper({
  children,
  slim = true,
}: {
  children?: React.ReactNode;
  slim?: boolean;
}) {
  return (
    <div
      className={`flex relative [perspective:1000px] w-[calc(100vw-40px)] ${
        slim ? 'max-w-md' : 'max-w-2xl 2xl:max-w-4xl'
      } h-[calc(100vh-40px)]`}
    >
      {children}
    </div>
  );
}

export default function Card({
  children,
  className,
  slim = true,
}: {
  children?: React.ReactNode;
  className?: string;
  slim?: boolean;
}) {
  return (
    <CardWrapper slim={slim}>
      <div
        className={`rounded-3xl overflow-hidden w-full h-full absolute ${className}`}
      >
        {children}
      </div>
    </CardWrapper>
  );
}
