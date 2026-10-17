/**
 * localStorage'ga saqlanadigan kichik global store.
 *
 * - Provider kerak emas: hook istalgan komponentda ishlaydi
 * - SSR'da boshlang'ich qiymat qaytadi, brauzerda saqlangani o'qiladi
 *   (useSyncExternalStore hydration xatosiz almashtiradi)
 * - Boshqa tabda o'zgarsa ("storage" event) shu tab ham yangilanadi
 */

type Listener = () => void;

export type PersistentStore<T> = {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  set: (updater: (prev: T) => T) => void;
};

export function createPersistentStore<T>(
  key: string,
  initialValue: T,
  /** localStorage'dan kelgan qiymatni tekshiradi; yaroqsiz bo'lsa null */
  parse: (raw: unknown) => T | null,
): PersistentStore<T> {
  const listeners = new Set<Listener>();
  let state = initialValue;
  let hydrated = false;

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return parse(JSON.parse(raw)) ?? initialValue;
    } catch {
      return initialValue;
    }
  };

  const emit = () => listeners.forEach((listener) => listener());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    state = read();
    emit();
  };

  const getSnapshot = (): T => {
    if (!hydrated && typeof window !== "undefined") {
      state = read();
      hydrated = true;
    }
    return state;
  };

  return {
    getSnapshot,

    getServerSnapshot: () => initialValue,

    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          window.removeEventListener("storage", onStorage);
        }
      };
    },

    set(updater) {
      const next = updater(getSnapshot());
      if (Object.is(next, state)) return;

      state = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Private rejim yoki to'lgan storage: holat xotirada qoladi
      }
      emit();
    },
  };
}

/** [1, 2, 3] ko'rinishidagi id ro'yxatini tekshiradi */
export function parseIdList(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null;
  const ids = raw.filter((id): id is number => Number.isInteger(id));
  return Array.from(new Set(ids));
}
