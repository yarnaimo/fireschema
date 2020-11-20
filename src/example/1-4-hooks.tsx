import React from 'react'
import {
  useDocumentSnapData,
  useQuerySnapData,
  useTypedDocument,
  useTypedQuery,
} from '../hooks'
import { $, firestoreApp } from './1-3-adapter'

/**
 * コレクション/クエリをリアルタイムで表示
 */
export const UsersComponent = () => {
  const users = useTypedQuery($.collection(firestoreApp, 'users'))
  const usersData = useQuerySnapData(users.snap)
  if (!usersData) {
    return <span>{'Loading...'}</span>
  }

  return (
    <ul>
      {usersData.map((user, i) => (
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
  const userData = useDocumentSnapData(user.snap)
  if (!userData) {
    return <span>{'Loading...'}</span>
  }

  return <span>{userData.displayName}</span>
}
