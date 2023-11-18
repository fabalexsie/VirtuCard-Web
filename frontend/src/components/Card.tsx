export function CardWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex relative max-w-md [perspective:1000px] w-[calc(100vw-40px)] h-[calc(100vh-40px)]">
      {children}
    </div>
  );
}

export default function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardWrapper>
      <div
        className={`rounded-3xl overflow-hidden w-full h-full absolute ${className}`}
      >
        {children}
      </div>
    </CardWrapper>
  );
}
