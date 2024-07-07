import Image from 'next/image';

interface Props {
  title: string;
  description: string;
  imgOrder: 'left' | 'right';
  children: React.ReactNode;
}

export async function AuthTemplate({
  title,
  description,
  imgOrder,
  children
}: Props) {
  const imageOrderClass = imgOrder === 'left' ? 'order-1' : 'order-2';
  const contentOrderClass = imgOrder === 'left' ? 'order-2' : 'order-1';

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div
        className={`flex items-center justify-center py-12 ${contentOrderClass}`}
      >
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-balance text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
      <div className={`hidden bg-muted lg:block ${imageOrderClass}`}></div>
    </div>
  );
}
