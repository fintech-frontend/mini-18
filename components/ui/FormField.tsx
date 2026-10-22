import { cn } from "@/lib/utils";

/** Maketdagi input / textarea uslubi (61px balandlik, och kulrang chegara) */
export function inputClassName(invalid?: boolean) {
  return cn(
    "w-full rounded-[7px] border bg-white px-5 text-[15px] text-[#2C333D] outline-none transition-colors placeholder:text-[#A0A5AC] focus:border-[#186FD4]",
    invalid ? "border-[#E5484D]" : "border-[#E5E7EB] hover:border-[#CBD5E1]",
  );
}

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[15px] leading-[21px] text-[#2C333D]"
    >
      {children}
      {required && (
        <span className="text-[#E5484D]" aria-hidden>
          {" "}
          *
        </span>
      )}
      :
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-[#E5484D]">
      {message}
    </p>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}
