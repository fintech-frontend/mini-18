"use client";

import { useState } from "react";

import { CATALOG_SEO } from "@/data/catalogData";
import { cn } from "@/lib/utils";

/**
 * Sahifa pastidagi "Купить электроинструмент" matni.
 * 360 / 768 da yig'ilgan holda, "Читать полностью" bilan ochiladi.
 */
export default function CatalogSeoText() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section aria-labelledby="catalog-seo-title">
      <h2
        id="catalog-seo-title"
        className="text-[26px] leading-[1.2] font-bold text-[#303640] md:text-[28px] lg:text-[30px]"
      >
        {CATALOG_SEO.title}
      </h2>

      <div className="relative mt-3.5">
        <div
          className={cn(
            "space-y-3.5 text-[14px] leading-[1.6] text-[#414446] md:text-[15px]",
            !expanded &&
              "max-h-[540px] overflow-hidden md:max-h-[320px] lg:max-h-none",
          )}
        >
          {CATALOG_SEO.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}

          <ul className="space-y-3">
            {CATALOG_SEO.list.map((item) => (
              <li key={item.title} className="relative pl-4">
                <span
                  aria-hidden
                  className="absolute top-[0.6em] left-0 size-1.5 rounded-full bg-[#D93829]"
                />
                <strong className="font-semibold text-[#303640]">
                  {item.title}:
                </strong>{" "}
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {!expanded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[73px] bg-gradient-to-t from-white to-white/0 lg:hidden"
          />
        )}
      </div>

      <div className="mt-3.5 text-center lg:hidden">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="text-[14px] font-medium text-[#1976E8] hover:underline"
        >
          {expanded ? "Свернуть" : "Читать полностью"}
        </button>
      </div>
    </section>
  );
}
