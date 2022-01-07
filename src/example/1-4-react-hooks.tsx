import React, { Suspense } from 'react'

import { useTypedCollection, useTypedDoc } from '../hooks/index.js'
import { $web } from './1-3-typed-firestore.js'

/**
 * Get realtime updates of collection/query
 */
export const PostsComponent = () => {
  const userRef = $web.collection('users').doc('user1')
  const postsRef = userRef.collection('posts')

  const posts = useTypedCollection(postsRef)
  const techPosts = useTypedCollection(postsRef.select.byTag('tech'))

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
  const user = useTypedDoc($web.collection('users').doc(id))

  return (
    <Suspense fallback={'Loading...'}>
      <span>{user.data?.displayName}</span>
    </Suspense>
  )
}
