import Link from "next/link";

type Props = {
  title: string;
  children?: React.ReactNode;
};

/** Breadcrumb + H1 (katalog sahifasidagi bilan bir xil o'lchamlar) */
export default function PageHeader({ title, children }: Props) {
  return (
    <>
      <nav
        aria-label="Хлебные крошки"
        className="pt-3 text-[14px] text-[#8A9098] lg:pt-[18px]"
      >
        <Link href="/" className="text-[#2C333D] hover:text-[#1976E8]">
          Стройоптторг
        </Link>
        <span className="mx-2.5">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:mt-[19px]">
        <h1 className="text-[28px] leading-[1.15] font-bold tracking-[-0.5px] text-[#303640] md:text-[30px] lg:text-[40px] 2xl:text-[44px]">
          {title}
        </h1>
        {children}
      </div>
    </>
  );
}
