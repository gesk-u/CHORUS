import { useCallback, useState } from "react"

/** A list of ids where `toggle(id)` adds the id or removes it if present. */
export function useToggleList<T>(initial: T[] = []) {
  const [items, setItems] = useState<T[]>(initial)
  const toggle = useCallback(
    (item: T) =>
      setItems((current) =>
        current.includes(item) ? current.filter((x) => x !== item) : [...current, item],
      ),
    [],
  )
  const clear = useCallback(() => setItems([]), [])
  return { items, toggle, clear }
}
