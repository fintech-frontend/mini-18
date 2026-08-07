import { deliveryData } from "@/data/delivery";

function DeliveryDataMap() {
  return (
    <div className="w-full text-[13px] md:text-[14px] text-[#393939] leading-relaxed">
      {/* Header qismi */}
      <div className="flex flex-col gap-4 mb-6">
        {deliveryData.header.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
        <p className="font-semibold text-[#2C333D] mt-2">
          {deliveryData.header.subheading}
        </p>
      </div>

      {/* Methods (1 va 2 bo'limlar) */}
      {deliveryData.methods.map((method) => (
        <div key={method.id} className="mb-8">
          <h3 className="font-bold text-[#2C333D] text-[15px] md:text-[16px] mb-3">
            {method.title}
          </h3>

          {method.description && <p className="mb-4">{method.description}</p>}

          {/* Ish vaqti */}
          {method.workInfo && (
            <div className="mb-4">
              <p className="font-semibold mb-2">{method.workInfo.title}</p>
              <ul className="flex flex-col gap-2">
                {method.workInfo.schedule.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {method.note && <p className="mb-4">{method.note}</p>}

          {/* Qo'shimcha paragraflar */}
          {method.paragraphs && (
            <div className="flex flex-col gap-4">
              {method.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Rules (Qoidalar) */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2C333D] text-[15px] md:text-[16px] mb-3">
          {deliveryData.rules.title}
        </h3>
        <p className="mb-4">{deliveryData.rules.description}</p>

        <ul className="flex flex-col gap-3 mb-6">
          {deliveryData.rules.list.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Ogohlantirish bloki (Highlight) */}
        <div className="bg-[#F4F7FA] p-4 md:p-5 rounded-lg mb-6 border-l-4 border-blue-500 text-[#2C333D] font-medium">
          {deliveryData.rules.highlightWarning}
        </div>

        <p>{deliveryData.rules.supportContact}</p>
      </div>

      {/* Additional Methods (3 va 4 bo'limlar) */}
      {deliveryData.additionalMethods.map((method) => (
        <div key={method.id} className="mb-8">
          <h3 className="font-bold text-[#2C333D] text-[15px] md:text-[16px] mb-3">
            {method.title}
          </h3>

          {method.paragraphs && (
            <div className="flex flex-col gap-4 mb-4">
              {method.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}

          {method.subtitle && (
            <p className="font-semibold text-[#2C333D] mb-3">
              {method.subtitle}
            </p>
          )}

          {method.list && (
            <ul className="flex flex-col gap-3 mb-4">
              {method.list.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default DeliveryDataMap;
