import { FC } from 'react'
import { Login } from '@/presentation/pages'
import {
  makeLocalSaveCurrentAccount,
  makeRemoteAuthentication,
} from '@/main/factory/usecases'
import { makeLoginValidate } from './login-validate-factory'

export const MakeLogin: FC = () => (
  <Login
    validation={makeLoginValidate()}
    authentication={makeRemoteAuthentication()}
    saveCurrentAccount={makeLocalSaveCurrentAccount()}
  />
)
