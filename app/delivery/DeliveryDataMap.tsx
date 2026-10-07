import { deliveryData } from "@/data/delivery";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[9px] pl-[15px]">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span
            aria-hidden
            className="mt-[11px] size-1.5 shrink-0 rounded-full bg-[#D93829]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[18px] leading-[26px] font-bold text-[#2C333D]">
      {children}
    </h2>
  );
}

/** "Доставка" sahifasining asosiy matni (maket: 16px / 27px, bloklar orasi 20px) */
function DeliveryDataMap() {
  const { header, methods, rules, additionalMethods } = deliveryData;

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 text-[16px] leading-[27px] text-[#393939]">
      {header.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}

      <p className="text-[18px] leading-[26px] font-semibold text-[#2C333D]">
        {header.subheading}
      </p>

      {methods.map((method) => (
        <section key={method.id} className="flex flex-col gap-5">
          <SectionTitle>{method.title}</SectionTitle>

          {method.description && <p>{method.description}</p>}

          {method.workInfo && (
            <div className="flex flex-col gap-2.5">
              <p className="font-semibold text-[#2C333D]">
                {method.workInfo.title}
              </p>
              <BulletList items={method.workInfo.schedule} />
            </div>
          )}

          {method.note && <p>{method.note}</p>}

          {method.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-5">
        <p className="font-semibold text-[#2C333D]">{rules.title}</p>
        <p>{rules.description}</p>

        <BulletList items={rules.list} />

        <p className="rounded-lg bg-[#F4F7FA] px-5 py-[15px] font-medium text-[#2C333D]">
          {rules.highlightWarning}
        </p>

        <p>{rules.supportContact}</p>
      </section>

      {additionalMethods.map((method) => (
        <section key={method.id} className="flex flex-col gap-5">
          <SectionTitle>{method.title}</SectionTitle>

          {method.subtitle && (
            <p className="font-semibold text-[#2C333D]">{method.subtitle}</p>
          )}

          {method.list && <BulletList items={method.list} />}

          {method.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

export default DeliveryDataMap;
