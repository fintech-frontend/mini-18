import { CONTACT_EMAIL, DEPARTMENTS, REGIONS } from "./data";

/* Bo'limlar telefonlari, rekvizitlar va hududlar */
export default function ContactsInfo() {
  return (
    <section className="py-10 md:py-16">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <DepartmentPhones />
        <Requisites />
      </div>
      <RegionsList />
    </section>
  );
}

function DepartmentPhones() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-4">
      {DEPARTMENTS.map((item, index) => (
        <div key={index} className="rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:shadow-md">
          <p className="mb-2 text-[13px] text-gray-500">{item.title}</p>
          <h3 className="text-[18px] font-semibold leading-6 text-[#2F3640] md:text-[20px]">{item.value}</h3>
        </div>
      ))}
    </div>
  );
}

function Requisites() {
  return (
    <div className="rounded-xl bg-[#F5F8FC] p-5 sm:p-6">
      <h3 className="mb-4 text-xl font-semibold text-[#2F3640]">Реквизиты:</h3>
      <p className="text-sm leading-7 text-gray-600">
        ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «СТРОЙОПТТОРГ»
        <br />
        ИНН 0901051787
        <br />
        КПП 091001001
        <br />
        Карачаево-Черкесская республика
        <br />
        г. Черкесск
        <br />
        ул. Октябрьская, 301Г
        <br />
        р/с 40702810630000102415
        <br />
        Ставропольское отделение №5230
        <br />
        ПАО Сбербанк
        <br />
        БИК 040702615
      </p>
    </div>
  );
}

function RegionsList() {
  return (
    <div className="mt-12 md:mt-16">
      <h2 className="mb-6 text-2xl font-bold text-[#2F3640] md:mb-10 md:text-3xl">Работаем по регионам:</h2>
      <div className="grid grid-cols-1 border-t border-gray-200 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {REGIONS.map((city, index) => (
          <div key={index} className="border-b border-gray-200 px-4 py-5 lg:border-b-0 lg:border-r">
            <h3 className="mb-3 font-medium text-[#2F3640]">{city}</h3>
            <p className="mb-2 text-base font-semibold text-[#2F3640] md:text-lg">+7 (800) 444-00-65</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-sm text-blue-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
