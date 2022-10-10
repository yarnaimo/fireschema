import { renderHook } from '@testing-library/react-hooks';
import { typeExtends } from '@yarnaimo/type-extends';
import { expectType } from 'tsd';
import { buildQueryUniv, collectionUniv, docFromRootUniv, docUniv, existsUniv, getDocUniv, queryEqualUniv, refEqualUniv, setDocUniv, updateDocUniv, } from '../../core/firestore/controller/_universal.js';
import { TypedDocumentSnap, TypedQuerySnap, _createdAt, _updatedAt, withRefTransformer, } from '../../core/index.js';
import { getCollectionOptionsByName } from '../../core/utils/_object.js';
import { useTypedCollection } from '../../hooks/useTypedCollection.js';
import { useTypedDoc, useTypedDocOnce } from '../../hooks/useTypedDocument.js';
import { R } from '../../lib/fp.js';
import { createUserData, postAData, userDataBase } from '../_fixtures/data.js';
import { PostModel, UserModel, firestoreModel, } from '../_fixtures/firestore-schema.js';
import { assertFails, getTestAppAdmin, getTestAppWeb, } from '../_services/app.js';
import { _tcollections, firestoreModelWithDup, } from '../_services/firestore-collections.js';
import { sleep } from '../_utils/common.js';
import { expectAnyTimestampAdmin, expectAnyTimestampWeb, } from '../_utils/firestore.js';
describe('types', () => {
    test('decoder', () => {
        expectType(UserModel.decoder);
        expectType(PostModel.decoder);
    });
    test('UAt', () => {
        expectType({});
        expectType(
        // @ts-expect-error: wrong U type
        {});
    });
    test('CollectionNameToLoc', () => {
        expectType({});
        expectType({});
    });
});
describe('utils', () => {
    test('getCollectionOptionsByName', () => {
        expect(getCollectionOptionsByName(firestoreModel.schemaOptions, 'posts')).toEqual([
            {
                loc: 'versions.users.posts',
                options: expect.objectContaining({ model: PostModel }),
            },
        ]);
        expect(getCollectionOptionsByName(firestoreModelWithDup.schemaOptions, 'posts')).toEqual([
            {
                loc: 'versions.users.posts',
                options: expect.objectContaining({ model: PostModel }),
            },
            {
                loc: 'posts',
                options: expect.objectContaining({ model: PostModel }),
            },
        ]);
    });
});
for (const env of ['web', 'admin']) {
    const $env = (str) => `[${env}] ${str}`;
    const app = env === 'web'
        ? getTestAppWeb('user').firestore()
        : getTestAppAdmin().firestore();
    const appUnauthed = env === 'web'
        ? getTestAppWeb('unauthed').firestore()
        : getTestAppAdmin().firestore();
    const r = _tcollections(app, env);
    const ur = _tcollections(appUnauthed, env);
    const firestoreStatic = r.typedFirestore.firestoreStatic;
    const expectAnyTimestamp = env === 'web' ? expectAnyTimestampWeb : expectAnyTimestampAdmin;
    describe($env('collectionGroup'), () => {
        test('collection name duplication', () => {
            expect(() => {
                r.typedFirestoreWithCollectionDup.collectionGroup('users');
            }).not.toThrowError();
            expect(() => {
                r.typedFirestoreWithCollectionDup.collectionGroup('posts');
            }).toThrowError();
        });
    });
    describe($env('refs'), () => {
        test('ref equality', () => {
            expect(refEqualUniv(r.users.raw, collectionUniv(app, 'versions/v1/users'))).toBe(false);
            expect(refEqualUniv(r.user.raw, docFromRootUniv(app, 'versions/v1/users/user'))).toBe(false);
            expect(refEqualUniv(r.users.raw, r.v1.collection('users').raw)).toBe(true);
            expect(refEqualUniv(r.user.raw, r.v1.collection('users').doc('user').raw)).toBe(true);
        });
        env === 'web' &&
            test('query equality', () => {
                expect(queryEqualUniv(buildQueryUniv(r.users.raw, (q) => [
                    q.where('age', '>=', 10),
                    q.where('age', '<', 20),
                ]), r.teenUsers.raw)).toBe(true);
                expect(queryEqualUniv(buildQueryUniv(r.usersGroup.raw, (q) => [
                    q.where('age', '>=', 10),
                    q.where('age', '<', 20),
                ]), r.teenUsersGroup.raw)).toBe(true);
                expect(queryEqualUniv(buildQueryUniv(r.users.raw, (q) => [
                    q.orderBy(firestoreStatic.documentId()),
                ]), r.usersOrderedById.raw)).toBe(true);
            });
        test('doc() argument', () => {
            const a = r.users.doc();
            const b = r.users.doc(undefined);
            expect(a.id).toHaveLength(20);
            expect(b.id).toHaveLength(20);
        });
    });
    describe($env('class structure'), () => {
        test('parent of root collection is undefined', () => {
            const parentOfRootCollection = r.versions.parentDocument();
            expect(parentOfRootCollection).toBeUndefined();
        });
        test.each([
            {
                p: 'versions',
                l: 'versions',
                instances: [r.versions, r.v1.parentCollection()],
            },
            {
                p: 'versions/v1',
                l: 'versions',
                instances: [
                    r.v1,
                    r.users.parentDocument(),
                    r.typedFirestore.wrapDocument(r.v1.raw),
                ],
            },
            {
                p: 'versions/v1/users',
                l: 'versions.users',
                instances: [r.users, r.user.parentCollection()],
            },
            {
                p: 'versions/v1/users/user',
                l: 'versions.users',
                instances: [
                    r.user,
                    r.posts.parentDocument(),
                    r.typedFirestore.wrapDocument(r.user.raw),
                ],
            },
            {
                p: 'versions/v1/users/user/posts',
                l: 'versions.users.posts',
                instances: [r.posts, r.post.parentCollection()],
            },
            {
                p: 'versions/v1/users/user/posts/post',
                l: 'versions.users.posts',
                instances: [
                    r.post,
                    r.typedFirestore.wrapDocument(r.post.raw),
                    r.typedFirestore.wrapDocument(
                    // @ts-expect-error: wrong doc type
                    r.post.raw),
                ],
            },
        ])('path, loc (C, D): %p', ({ p, l, instances }) => {
            const firstInstance = instances[0];
            for (const instance of instances) {
                expect(instance.path).toBe(p);
                expect(instance.options.loc).toEqual(l);
                expect(refEqualUniv(instance.raw, firstInstance.raw)).toBe(true);
            }
        });
        test.each([
            {
                l: 'versions.users',
                instances: [r.teenUsers],
            },
            {
                l: 'versions.users',
                instances: [r.usersGroup],
            },
            {
                l: 'versions.users',
                instances: [r.teenUsersGroup],
            },
        ])('loc (Q): %p', ({ l, instances }) => {
            for (const instance of instances) {
                expect(instance.options.loc).toEqual(l);
            }
        });
    });
    const transformer = withRefTransformer;
    describe($env('read'), () => {
        beforeEach(r.createInitialUserAndPost);
        test.each([
            {
                get: async () => r.typedFirestore.runTransaction(async (tt) => tt.get(r.user)),
                getData: typeExtends()(async (options) => r.typedFirestore.runTransaction(async (tt) => tt.getData(r.user, options))),
            },
            r.user,
            r.posts.parentDocument(),
            r.typedFirestore.wrapDocument(r.user.raw),
        ])('get doc - user %#', async (ref) => {
            const snap = await ref.get();
            const [get, getR, getData, getDataR] = [
                snap.data(),
                snap.data({ transformer }),
                (await ref.getData({})),
                (await ref.getData({ transformer })),
            ];
            for (const data of [get, getR, getData, getDataR]) {
                // @ts-expect-error: ref not exists
                data.ref;
                // @ts-expect-error: wrong data type
                expectType(data);
                expect(data).toMatchObject({
                    ...userDataBase,
                    timestamp: expect.any(String),
                    id: snap.id,
                });
            }
            for (const data of [getR, getDataR]) {
                expectType(data);
                expect(refEqualUniv(data.ref.raw, r.user.raw)).toBe(true);
            }
        });
        test.each([
            {
                get: async () => r.typedFirestore.runTransaction(async (tt) => tt.get(r.post)),
                getData: typeExtends()(async (options) => r.typedFirestore.runTransaction(async (tt) => tt.getData(r.post, options))),
            },
            r.post,
            r.typedFirestore.wrapDocument(r.post.raw),
        ])('get doc - post %#', async (ref) => {
            const snap = await ref.get();
            const [get, getR, getData, getDataR] = [
                snap.data(),
                snap.data({ transformer }),
                (await ref.getData({})),
                (await ref.getData({ transformer })),
            ];
            for (const data of [get, getR, getData, getDataR]) {
                // @ts-expect-error: ref not exists
                data.ref;
                // @ts-expect-error: wrong data type
                expectType(data);
                expect(data).toMatchObject({
                    ...postAData,
                    id: snap.id,
                });
            }
            for (const data of [getR, getDataR]) {
                expectType(data);
                expect(refEqualUniv(data.ref.raw, r.post.raw)).toBe(true);
            }
        });
        test.each([r.users, r.user.parentCollection()])('get collection - users %#', async (ref) => {
            const snap = await ref.get();
            const [get, getR, getData, getDataR] = [
                snap.docs[0].data(),
                snap.docs[0].data({ transformer }),
                (await ref.getData({}))[0],
                (await ref.getData({ transformer }))[0],
            ];
            expect(snap.docs).toHaveLength(1);
            for (const data of [get, getR, getData, getDataR]) {
                // @ts-expect-error: ref not exists
                data.ref;
                // @ts-expect-error: wrong data type
                expectType(data);
                expect(data).toMatchObject({
                    ...userDataBase,
                    timestamp: expect.any(String),
                    id: snap.docs[0].id,
                });
            }
            for (const data of [getR, getDataR]) {
                expectType(data);
                expect(refEqualUniv(data.ref.raw, r.user.raw)).toBe(true);
            }
        });
        test.each([r.teenUsers, r.teenUsersGroup])('get query - users %#', async (query) => {
            const snap = await query.get();
            const [get, getR, getData, getDataR] = [
                snap.docs[0].data(),
                snap.docs[0].data({ transformer }),
                (await query.getData({}))[0],
                (await query.getData({ transformer }))[0],
            ];
            expect(snap.docs).toHaveLength(1);
            for (const data of [get, getR, getData, getDataR]) {
                // @ts-expect-error: ref not exists
                data.ref;
                // @ts-expect-error: wrong data type
                expectType(data);
                expect(data).toMatchObject({
                    ...userDataBase,
                    timestamp: expect.any(String),
                    id: snap.docs[0].id,
                });
            }
            for (const data of [getR, getDataR]) {
                expectType(data);
            }
        });
        test.each([
            {
                get: async () => {
                    const usersSnap = await r.users.get();
                    const userRef = usersSnap.docs[0].ref;
                    return userRef.collection('posts').get();
                },
                getData: typeExtends()(async (options) => {
                    const usersSnap = await r.users.get();
                    const userRef = usersSnap.docs[0].ref;
                    return userRef.collection('posts').getData(options);
                }),
            },
            r.posts,
            r.post.parentCollection(),
        ])('get collection - posts %#', async (ref) => {
            const snap = await ref.get();
            const [get, getR, getData, getDataR] = [
                snap.docs[0].data(),
                snap.docs[0].data({ transformer }),
                (await ref.getData({}))[0],
                (await ref.getData({ transformer }))[0],
            ];
            expect(snap.docs).toHaveLength(1);
            for (const data of [get, getR, getData, getDataR]) {
                // @ts-expect-error: ref not exists
                data.ref;
                // @ts-expect-error: wrong data type
                expectType(data);
                expect(data).toMatchObject({
                    ...postAData,
                    id: snap.docs[0].id,
                });
            }
            for (const data of [getR, getDataR]) {
                expectType(data);
                expect(refEqualUniv(data.ref.raw, r.post.raw)).toBe(true);
            }
        });
    });
    env === 'web' &&
        describe($env('write (test rules)'), () => {
            test('create user (empty array)', async () => {
                await r.user.create({ ...r.userData, tags: [] });
            });
            test('create user (fails due to invalid timestamp)', async () => {
                const serverTs = () => firestoreStatic.serverTimestamp();
                const localTs = () => firestoreStatic.Timestamp.fromDate(new Date());
                for (const data of [
                    { ...r.userData, [_createdAt]: serverTs() },
                    { ...r.userData, [_updatedAt]: serverTs() },
                    { ...r.userData, [_createdAt]: localTs(), [_updatedAt]: serverTs() },
                    { ...r.userData, [_createdAt]: serverTs(), [_updatedAt]: localTs() },
                ]) {
                    await assertFails(async () => setDocUniv(r.user.raw, data));
                }
                await setDocUniv(r.user.raw, {
                    ...r.userData,
                    [_createdAt]: serverTs(),
                    [_updatedAt]: serverTs(),
                });
                for (const data of [
                    { [_createdAt]: serverTs() },
                    { [_createdAt]: serverTs(), [_updatedAt]: serverTs() },
                    { [_updatedAt]: localTs() },
                ]) {
                    await assertFails(async () => updateDocUniv(r.user.raw, data));
                }
                await updateDocUniv(r.user.raw, {
                    [_updatedAt]: serverTs(),
                });
            });
            test('create user (fails due to invalid data)', async () => {
                await assertFails(async () => r.user.create({
                    ...r.userData,
                    // @ts-expect-error: number
                    age: '20',
                }));
                await assertFails(async () => r.user.create({
                    ...r.userData,
                    // @ts-expect-error: options.a
                    options: { a: 1, b: 'value' },
                }));
                await assertFails(async () => r.user.create({
                    ...r.userData,
                    // @ts-expect-error: excess property
                    excessProperty: 'text',
                }));
            });
            test('create user (fails due to unauthed)', async () => {
                await assertFails(async () => ur.user.create(createUserData));
            });
            describe('write to non-existing doc', () => {
                test('setMerge fails', async () => {
                    await assertFails(async () => r.user.setMerge(createUserData));
                });
                test('update fails', async () => {
                    await assertFails(async () => r.user.update(createUserData));
                });
            });
            test('overwrite user fails', async () => {
                await r.user.create(createUserData);
                await r.user.update(createUserData);
                await assertFails(async () => r.user.create(createUserData));
            });
        });
    describe($env('write'), () => {
        test.each([
            async () => {
                await r.user.create(createUserData);
                // @ts-expect-error: wrong data type
                void (async () => r.user.create(postData));
            },
            async () => {
                const b = r.typedFirestore.batch();
                b.create(r.user, createUserData);
                // @ts-expect-error: wrong data type
                void (() => b.create(r.user, postAData));
                await b.commit();
            },
            async () => {
                await r.typedFirestore.runTransaction(async (tt) => {
                    tt.create(r.user, createUserData);
                    // @ts-expect-error: wrong data type
                    void (() => tt.create(r.user, postAData));
                });
            },
        ])('create user %#', async (fn) => {
            await fn();
            const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined);
            expect(snapRaw.data()).toMatchObject({
                ...userDataBase,
                _createdAt: expectAnyTimestamp(),
                _updatedAt: expectAnyTimestamp(),
                timestamp: expectAnyTimestamp(),
            });
        });
    });
    describe($env('write (with initial docs)'), () => {
        beforeEach(r.createInitialUserAndPost);
        const userUpdateData = {
            name: 'name1-updated',
            tags: firestoreStatic.arrayUnion({ id: 2, name: 'tag2' }),
        };
        for (const op of ['setMerge', 'update']) {
            test.each([
                async () => {
                    await r.user[op](userUpdateData);
                    // @ts-expect-error: wrong data type
                    void (async () => r.user[op](postAData));
                },
                async () => {
                    const b = r.typedFirestore.batch();
                    b[op](r.user, userUpdateData);
                    // @ts-expect-error: wrong data type
                    void (() => b[op](r.user, postAData));
                    await b.commit();
                },
                async () => {
                    await r.typedFirestore.runTransaction(async (tt) => {
                        tt[op](r.user, userUpdateData);
                        // @ts-expect-error: wrong data type
                        void (() => tt[op](r.user, postAData));
                    });
                },
            ])(`${op} user %#`, async (fn) => {
                await fn();
                const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined);
                expect(snapRaw.data()).toMatchObject({
                    ...userDataBase,
                    name: 'name1-updated',
                    tags: [...userDataBase.tags, { id: 2, name: 'tag2' }],
                    _updatedAt: expectAnyTimestamp(),
                    timestamp: expectAnyTimestamp(),
                });
            });
            test.each([
                async () => {
                    await r.typedFirestore.runTransaction(async (tt) => {
                        const tsnap = await tt.get(r.user);
                        tt[op](r.user, {
                            age: tsnap.data().age + 1,
                        });
                    });
                },
            ])(`${op} user (transaction using .get()) %#`, async (fn) => {
                await fn();
                const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined);
                expect(snapRaw.data()).toMatchObject({
                    ...userDataBase,
                    age: userDataBase.age + 1,
                    _updatedAt: expectAnyTimestamp(),
                    timestamp: expectAnyTimestamp(),
                });
            });
        }
        test.each([
            async () => {
                await r.user.delete();
            },
            async () => {
                const b = r.typedFirestore.batch();
                b.delete(r.user);
                await b.commit();
            },
            async () => {
                await r.typedFirestore.runTransaction(async (tt) => {
                    tt.delete(r.user);
                });
            },
        ])('delete user %#', async (fn) => {
            await fn();
            const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined);
            expect(existsUniv(snapRaw)).toBeFalsy();
        });
    });
    env === 'web' &&
        describe($env('hooks'), () => {
            beforeEach(r.createInitialUserAndPost);
            beforeEach(() => {
                const _globalThis = globalThis;
                _globalThis._reactFirePreloadedObservables.clear();
                _globalThis._reactFireFirestoreQueryCache.splice(0);
            });
            describe('useTypedDocument', () => {
                test('safeRef', async () => {
                    let ref;
                    const updateRef = () => {
                        const typedDoc = r.users.doc('user');
                        typedDoc.raw = typedDoc.raw.withConverter({
                            toFirestore: (data) => data,
                            fromFirestore: (snap) => snap.data(),
                        });
                        ref = typedDoc;
                    };
                    updateRef();
                    const { result, rerender, waitForNextUpdate, unmount } = renderHook(() => useTypedDoc(ref));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedDocumentSnap),
                    });
                    expect(result.all.length).toBe(2);
                    const typedRef1 = result.current.ref;
                    rerender();
                    expect(typedRef1 === result.current.ref).toBe(true);
                    const typedRef2 = result.current.ref;
                    updateRef();
                    rerender();
                    await sleep(100);
                    expect(typedRef2 === result.current.ref).toBe(false);
                    const consoleMock = jest.spyOn(console, 'error').mockImplementation();
                    for (const i of R.range(0, 8)) {
                        updateRef();
                        rerender();
                        await sleep(100);
                    }
                    consoleMock.mockRestore();
                    expect(result.all.length).toBe(5);
                    unmount();
                });
                test.each([useTypedDoc, useTypedDocOnce])('without transformer %#', async (hook) => {
                    const { result, waitForNextUpdate, unmount } = renderHook(() => hook(r.user));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedDocumentSnap),
                        data: { ...userDataBase, timestamp: expect.any(String) },
                    });
                    expect(refEqualUniv(result.current.snap.ref.raw, r.user.raw)).toBe(true);
                    expectType(result.current.data);
                    // @ts-expect-error: wrong data type
                    expectType(result.current.data);
                    unmount();
                });
                test.each([useTypedDoc, useTypedDocOnce])('with transformer %#', async (hook) => {
                    const { result, waitForNextUpdate, unmount } = renderHook(() => hook(r.user, {
                        transformer: (data, snap) => {
                            expectType(snap);
                            return data.name;
                        },
                    }));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedDocumentSnap),
                        data: userDataBase.name,
                    });
                    expect(refEqualUniv(result.current.snap.ref.raw, r.user.raw)).toBe(true);
                    expectType(result.current.data);
                    // @ts-expect-error: wrong data type
                    expectType(result.current.data);
                    unmount();
                });
            });
            describe('useTypedCollection', () => {
                test('safeRef', async () => {
                    let random = 0;
                    const updateRef = () => {
                        random = Math.random();
                    };
                    updateRef();
                    const { result, rerender, waitForNextUpdate, unmount } = renderHook(() => useTypedCollection(r.users.select._teen(random)));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedQuerySnap),
                    });
                    expect(result.all.length).toBe(2);
                    const typedRef1 = result.current.ref;
                    rerender();
                    expect(typedRef1 === result.current.ref).toBe(true);
                    const consoleMock = jest.spyOn(console, 'error').mockImplementation();
                    for (const i of R.range(0, 8)) {
                        updateRef();
                        rerender();
                        await sleep(100);
                    }
                    consoleMock.mockRestore();
                    expect(result.all.length).toBe(7);
                    unmount();
                });
                test.each([useTypedCollection /** useTypedQueryOnce */])('without transformer %#', async (hook) => {
                    const { result, waitForNextUpdate, unmount } = renderHook(() => hook(r.users.select.teen()));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedQuerySnap),
                        data: [{ ...userDataBase, timestamp: expect.any(String) }],
                    });
                    expect(refEqualUniv(result.current.snap.docs[0].ref.raw, r.user.raw)).toBe(true);
                    expectType(result.current.data[0]);
                    // @ts-expect-error: wrong data type
                    expectType(result.current.data[0]);
                    unmount();
                });
                test.each([useTypedCollection /** useTypedQueryOnce */])('with transformer %#', async (hook) => {
                    const { result, waitForNextUpdate, unmount } = renderHook(() => hook(r.users.select.teen(), {
                        transformer: (data, snap) => {
                            expectType(snap);
                            return data.name;
                        },
                    }));
                    expect(result.current).toBe(undefined);
                    await waitForNextUpdate();
                    expect(result.current).toMatchObject({
                        error: undefined,
                        snap: expect.any(TypedQuerySnap),
                        data: [userDataBase.name],
                    });
                    expect(refEqualUniv(result.current.snap.docs[0].ref.raw, r.user.raw)).toBe(true);
                    expectType(result.current.data[0]);
                    // @ts-expect-error: wrong data type
                    expectType(result.current.data[0]);
                    unmount();
                });
            });
        });
}
