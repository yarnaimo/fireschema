import React from 'react'
import { useTypedDocument, useTypedQuery } from '../hooks'
import { $, firestoreApp } from './1-3-adapter'

/**
 * コレクション/クエリをリアルタイムで表示
 */
export const UsersComponent = () => {
  const users = useTypedQuery($.collection(firestoreApp, 'users'))
  if (!users.data) {
    return <span>{'Loading...'}</span>
  }

  return (
    <ul>
      {users.data.map((user, i) => (
        <li key={i}>{user.displayName}</li>
      ))}
    </ul>
  )
}

/**
 * ドキュメントをリアルタイムで表示
 */
export const UserComponent = ({ id }: { id: string }) => {
  const user = useTypedDocument($.collection(firestoreApp, 'users').doc(id))
  if (!user.data) {
    return <span>{'Loading...'}</span>
  }

  return <span>{user.data.displayName}</span>
}
