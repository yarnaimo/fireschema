// type PathChars =
//   | 'A'
//   | 'B'
//   | 'C'
//   | 'D'
//   | 'E'
//   | 'F'
//   | 'G'
//   | 'H'
//   | 'I'
//   | 'J'
//   | 'K'
//   | 'L'
//   | 'M'
//   | 'N'
//   | 'O'
//   | 'P'
//   | 'Q'
//   | 'R'
//   | 'S'
//   | 'T'
//   | 'U'
//   | 'V'
//   | 'W'
//   | 'X'
//   | 'Y'
//   | 'Z'
//   | 'a'
//   | 'b'
//   | 'c'
//   | 'd'
//   | 'e'
//   | 'f'
//   | 'g'
//   | 'h'
//   | 'i'
//   | 'j'
//   | 'k'
//   | 'l'
//   | 'm'
//   | 'n'
//   | 'o'
//   | 'p'
//   | 'q'
//   | 'r'
//   | 's'
//   | 't'
//   | 'u'
//   | 'v'
//   | 'w'
//   | 'x'
//   | 'y'
//   | 'z'
//   | '0'
//   | '1'
//   | '2'
//   | '3'
//   | '4'
//   | '5'
//   | '6'
//   | '7'
//   | '8'
//   | '9'
//   | '-'
//   | '_'
export {};
// export type SPath<
//   C extends STypes.RootOptions.All | STypes.CollectionOptions.All,
//   D extends number = 10
// > = [D] extends [never]
//   ? never
//   : {
//       [K in keyof C & string]-?: DocLabelOrString<C[K]> extends infer PS
//         ? PS extends NotPathSegment
//           ? never
//           : PS extends string
//           ? Join<K, PS> | Join<K, PS, SPath<C[K], Prev[D]>>
//           : never
//         : never
//     }[keyof C & string]
