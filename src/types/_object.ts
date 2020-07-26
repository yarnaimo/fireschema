type Cons<H, T> = T extends readonly any[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
]

export type Loc<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]-?:
        | [K]
        | (Loc<T[K], Prev[D]> extends infer P
            ? P extends []
              ? never
              : Cons<K, P>
            : never)
    }[keyof T & string]
  : []

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T & string]-?: Cons<K, Leaves<T[K], Prev[D]>> }[keyof T &
      string]
  : []

type Next<U> = U extends readonly [string, ...string[]]
  ? ((...args: U) => void) extends (top: any, ...args: infer T) => void
    ? T
    : never
  : never

export type GetDeep<T, L extends readonly string[]> = L[0] extends keyof T
  ? {
      0: T[L[0]]
      1: GetDeep<T[L[0]], Next<L>>
    }[L[1] extends undefined ? 0 : 1]
  : L extends []
  ? T
  : never

export type GetDeepByKey<T, Key> = {
  [K in keyof T]: T[K] extends object
    ? GetDeepByKey<T[K], Key> | (K extends Key ? T[K] : never)
    : never
}[keyof T]
