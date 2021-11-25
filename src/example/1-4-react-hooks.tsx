import React, { Suspense } from 'react'

import { useTypedDoc, useTypedQuery } from '../hooks/index.js'
import { typedFirestore } from './1-3-typed-firestore.js'

/**
 * Get realtime updates of collection/query
 */
export const UsersComponent = () => {
  const users = useTypedQuery(typedFirestore.collection('users'))

  return (
    <Suspense fallback={'Loading...'}>
      <ul>
        {users.data.map((user, i) => (
          <li key={i}>{user.displayName}</li>
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
