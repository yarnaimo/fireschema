import { expectType } from 'tsd';
import { getDeep, getLastSegment, joinLoc, omitLastSegment, parseLocString, } from './_object.js';
const obj = {
    a: {
        b: {
            c: { key: 'value' },
        },
    },
    d: {
        b: {
            c: {
                b: { key: 'value' },
            },
        },
    },
};
test('getDeep', () => {
    const result = getDeep(obj, ['d', 'b', 'c']);
    expect(result).toEqual(obj.d.b.c);
});
// test('getDeepByKey', () => {
//   const expected = [
//     {
//       c: {
//         key: 'value',
//       },
//     },
//     {
//       c: {
//         b: { key: 'value' },
//       },
//     },
//     { key: 'value' },
//   ]
//   type Expected = (
//     | {
//         c: {
//           key: string
//         }
//       }
//     | {
//         c: {
//           b: { key: string }
//         }
//       }
//     | { key: string }
//   )[]
//   const result = getDeepByKey(obj, 'b')
//   expectType<Expected>(result)
//   // @ts-expect-error: error
//   expectType<Expected[number]>(result)
//   expect(result).toEqual(expected)
// })
test('parseLocString', () => {
    const result = parseLocString('a.b.c');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toEqual(['a', 'b', 'c']);
});
test('parseLocString (1 segment)', () => {
    const result = parseLocString('a');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toEqual(['a']);
});
test('parseLocString (empty)', () => {
    const result = parseLocString('');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toEqual([]);
});
// test('getSchemaOptionsByLoc', () => {
//   const result = getSchemaOptionsByLoc(obj, 'd.b.c')
//   expect(result).toEqual(obj.d.b.c)
// })
test('joinLoc', () => {
    const result = joinLoc('a.b', 'c');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toBe('a.b.c');
});
test('joinLoc (empty)', () => {
    const result = joinLoc('', 'a.b');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toBe('a.b');
});
test('getLastSegment', () => {
    const result = getLastSegment('a.b.c');
    expect(result).toBe('c');
});
test('omitLastSegment', () => {
    const result = omitLastSegment('a.b.c');
    expectType(result);
    // @ts-expect-error: error
    expectType(result);
    expect(result).toBe('a.b');
});
