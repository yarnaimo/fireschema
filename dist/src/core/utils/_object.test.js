"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsd_1 = require("tsd");
const _object_js_1 = require("./_object.js");
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
    const result = (0, _object_js_1.getDeep)(obj, ['d', 'b', 'c']);
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
    const result = (0, _object_js_1.parseLocString)('a.b.c');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toEqual(['a', 'b', 'c']);
});
test('parseLocString (1 segment)', () => {
    const result = (0, _object_js_1.parseLocString)('a');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toEqual(['a']);
});
test('parseLocString (empty)', () => {
    const result = (0, _object_js_1.parseLocString)('');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toEqual([]);
});
// test('getSchemaOptionsByLoc', () => {
//   const result = getSchemaOptionsByLoc(obj, 'd.b.c')
//   expect(result).toEqual(obj.d.b.c)
// })
test('joinLoc', () => {
    const result = (0, _object_js_1.joinLoc)('a.b', 'c');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toBe('a.b.c');
});
test('joinLoc (empty)', () => {
    const result = (0, _object_js_1.joinLoc)('', 'a.b');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toBe('a.b');
});
test('getLastSegment', () => {
    const result = (0, _object_js_1.getLastSegment)('a.b.c');
    expect(result).toBe('c');
});
test('omitLastSegment', () => {
    const result = (0, _object_js_1.omitLastSegment)('a.b.c');
    (0, tsd_1.expectType)(result);
    // @ts-expect-error: error
    (0, tsd_1.expectType)(result);
    expect(result).toBe('a.b');
});
