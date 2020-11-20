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

// type Join<
//   T1 extends string,
//   T2 extends string,
//   T3 extends string | undefined = undefined
// > = T3 extends undefined ? `${T1}/${T2}` : `${T1}/${T2}/${T3}`

// type Chars<S extends string> =
//   string extends S ? string[] :
//   S extends '' ? [] :
//   S extends `${PathChars}${infer Tail}` ? S extends `${infer Head}${Tail}`
//     ? [Head, ...Chars<Tail>]
//     : never :
//   never;

// type NotPathSegment = Join<string, string>

// type DocLabelOrString<C extends STypes.CollectionOptions.Meta> =
//   | `{${C[typeof $docLabel]}}`
//   | string

export type ParseCollectionPath<
  P extends string
> = P extends `${infer C}/${infer DT}`
  ? DT extends `${infer D}/${infer T}`
    ? [C, ...ParseCollectionPath<T>]
    : never
  : [P]

export type ParseDocumentPath<
  P extends string
> = P extends `${infer C}/${infer DT}`
  ? DT extends `${infer D}/${infer T}`
    ? [C, ...ParseDocumentPath<T>]
    : [C]
  : never

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
