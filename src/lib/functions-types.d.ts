import { FunctionsError, FunctionsErrorCode } from 'firebase/functions'
import { Merge } from 'type-fest'

export type * as _fadmin from 'firebase-functions'
export type * as _fweb from 'firebase/functions'

export type FunctionsErrorFixed = Merge<
  FunctionsError,
  { code: `functions/${FunctionsErrorCode}` }
>
