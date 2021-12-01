import React, { Suspense } from 'react'

import { useTypedCollection, useTypedDoc } from '../hooks/index.js'
import { typedFirestore } from './1-3-typed-firestore.js'

/**
 * Get realtime updates of collection/query
 */
export const PostsComponent = () => {
  const userRef = typedFirestore.collection('users').doc('user1')

  const posts = useTypedCollection(userRef.collection('posts'))
  const techPosts = useTypedCollection(userRef.collection('posts'), (select) =>
    select.byTag('tech'),
  )

  return (
    <Suspense fallback={'Loading...'}>
      <ul>
        {posts.data.map((post, i) => (
          <li key={i}>{post.text}</li>
        ))}
      </ul>
    </Suspense>
  )
}

/**
 * Get realtime updates of document
 */
export const UserComponent = ({ id }: { id: string }) => {
  const user = useTypedDoc(typedFirestore.collection('users').doc(id))

  return (
    <Suspense fallback={'Loading...'}>
      <span>{user.data?.displayName}</span>
    </Suspense>
  )
}
