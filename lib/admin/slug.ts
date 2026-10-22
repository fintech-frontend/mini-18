/* API slug talabi: ^[-a-zA-Z0-9_]+$, maks. 50 belgi.
   Kirill (rus/o'zbek) harflari lotinchaga o'giriladi. */

const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya", ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

export function slugify(text: string, max = 50): string {
  const s = text
    .toLowerCase()
    .replace(/[ʻʼ'`‘’]/g, "")
    .split("")
    .map((ch) => MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s.slice(0, max).replace(/-+$/g, "");
}

/** Takrorlanmasligi uchun oxiriga qisqa tasodifiy qo'shimcha (masalan: "drel-bosch-4821") */
export function uniqueSlug(text: string): string {
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  const base = slugify(text, 50 - suffix.length - 1) || "item";
  return `${base}-${suffix}`;
}
