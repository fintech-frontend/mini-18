import type { Profile } from "@/lib/api/userApi";
import { FIELD_LABELS, asText } from "./profileFields";

/* Bo'lim: «Мой аккаунт» */
export default function AccountSection({ profile }: { profile?: Profile }) {
  const keys = Object.keys(FIELD_LABELS).filter(
    (k) => profile && asText(profile[k]) !== ""
  );

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Мой аккаунт</h3>

      {keys.length === 0 ? (
        <p className="text-sm text-gray-500">Данные профиля не найдены.</p>
      ) : (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {keys.map((k) => (
            <div key={k} className="rounded-lg border border-gray-100 px-4 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {FIELD_LABELS[k]}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {asText(profile?.[k])}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
