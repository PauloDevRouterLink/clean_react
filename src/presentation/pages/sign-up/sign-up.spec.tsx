import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { SignUp } from './sign-up'
import {
  AddAccountSpy,
  Helper,
  SaveAccessTokenMock,
  ValidationStub,
} from '@/presentation/test'
import { Errors } from '@/domain/errors'

type SutTypes = {
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  render(
    <BrowserRouter>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </BrowserRouter>,
  )

  return { addAccountSpy, saveAccessTokenMock }
}

describe('SignUp Component', () => {
  afterEach(cleanup)
  test('Should start initial state', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })
    Helper.testChildCount('error-wrap', 0)
    Helper.testButtonIsDisabled('submit', true)
    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show name Validation if error failed', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })
    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
  })

  test('Should show email Validation if error failed', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })
  test('Should show password Validation if error failed', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('Should show passwordConfirmation Validation if error failed', () => {
    const validationError = faker.word.words()
    makeSut({ validationError })
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show valid name state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('name')
    Helper.testStatusForField('name')
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  test('Should enabled submit button form is valid', () => {
    makeSut()
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    Helper.testButtonIsDisabled('submit', false)
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await Helper.simulateValidSubmit()
    Helper.testElementExists('spinner')
  })

  test('Should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.internet.userName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await Helper.simulateValidSubmit(name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    })
  })

  test('Should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut()
    await Helper.simulateValidSubmit()
    await Helper.simulateValidSubmit()
    expect(addAccountSpy.callsCount).toEqual(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const validationError = faker.word.words()
    const { addAccountSpy } = makeSut({ validationError })
    Helper.populateField('email')
    await Helper.simulateValidSubmit()
    expect(addAccountSpy.callsCount).toEqual(0)
  })

  test('Should prevent error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new Errors.EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    Helper.simulateValidSubmitSign()
    const errorWrap = screen.getByTestId('error-wrap')
    await waitFor(() => errorWrap)
    Helper.testElementText('main-error', error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { addAccountSpy, saveAccessTokenMock } = makeSut()
    Helper.simulateValidSubmitSign()
    await waitFor(() => screen.getByTestId('form'))
    expect(saveAccessTokenMock.accessToken).toBe(
      addAccountSpy.account.accessToken,
    )
  })

  test.skip('Should prevent error if SaveAccessToken fails', async () => {
    const { saveAccessTokenMock } = makeSut()
    const error = new Errors.EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await Helper.simulateValidSubmit()
    // const errorWrap = screen.getByTestId('error-wrap')
    // await waitFor(() => errorWrap)
    Helper.testElementText('main-error', error.message)
    Helper.testChildCount('error-wrap', 1)
    // expect(errorWrap.childElementCount).toBe(1)
  })
})
