import React, { Suspense } from 'react';
import { useTypedCollection, useTypedDoc } from '../hooks/index.js';
import { $web } from './1-3-typed-firestore.js';
/**
 * Get realtime updates of collection/query
 */
export const PostsComponent = () => {
    const userRef = $web.collection('users').doc('user1');
    const postsRef = userRef.collection('posts');
    const posts = useTypedCollection(postsRef);
    const techPosts = useTypedCollection(postsRef.select.byTag('tech'));
    return (<Suspense fallback={'Loading...'}>
      <ul>
        {posts.data.map((post, i) => (<li key={i}>{post.text}</li>))}
      </ul>
    </Suspense>);
};
/**
 * Get realtime updates of document
 */
export const UserComponent = ({ id }) => {
    var _a;
    const user = useTypedDoc($web.collection('users').doc(id));
    return (<Suspense fallback={'Loading...'}>
      <span>{(_a = user.data) === null || _a === void 0 ? void 0 : _a.displayName}</span>
    </Suspense>);
};
