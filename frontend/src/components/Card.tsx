import clsx from 'clsx';

export function CardWrapper({
  children,
  slim = true,
}: {
  children?: React.ReactNode;
  slim?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex',
        'relative',
        '[perspective:1000px]',
        'w-[calc(100%-40px)]',
        'h-[calc(100%-40px)]',
        {
          'max-w-md': slim,
          'max-w-2xl': !slim,
          '2xl:max-w-4xl': !slim,
        },
      )}
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
