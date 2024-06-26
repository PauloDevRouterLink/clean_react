import { FC } from 'react'
import { SignUp } from '@/presentation/pages'
import { makeSignUpValidation } from './sign-up-validation'
import { makeRemoteAddAccount } from '@/main/factory/usecases'

export const MakeSignUp: FC = () => (
  <SignUp
    addAccount={makeRemoteAddAccount()}
    validation={makeSignUpValidation()}
  />
)
