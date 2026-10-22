import toast from "react-hot-toast";
import { formatApiError } from "@/lib/apiError";

/** API xatosini toast'da ko'rsatadi. Bir xil xabar qayta bosilganda ustma-ust yig'ilmaydi. */
export function toastApiError(err: unknown, prefix = "") {
  const text = prefix + formatApiError(err);
  toast.error(text, { id: text });
}
