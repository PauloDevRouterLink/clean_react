/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginPageProps } from '../login'

const useLogin = ({
  validation,
  authentication,
  saveAccessToken,
}: LoginPageProps) => {
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const emailError = validation.validate('email', state.email)
    const passwordError = validation.validate('password', state.password)

    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError,
    })
  }, [state.email, state.password])

  const handlerNavigate = () => navigate('/signup')

  const handlerLogin = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return
      setState({ ...state, isLoading: true })
      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      })
      await saveAccessToken.save(account.accessToken)
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  return { state, handlerLogin, handleChange, handlerNavigate }
}

export { useLogin }
