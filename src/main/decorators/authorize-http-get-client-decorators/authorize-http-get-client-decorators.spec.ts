import { GetStorageSpy, mockGetRequest } from '@/data/test'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'

type SutTypes = {
  getStorageSpy: GetStorageSpy
  sut: AuthorizeHttpGetClientDecorator
}

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy()
  const sut = new AuthorizeHttpGetClientDecorator(getStorageSpy)

  return {
    sut,
    getStorageSpy,
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  test('Should call GetStorage with correct value', () => {
    const { getStorageSpy, sut } = makeSut()
    sut.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })

  test('Should not add headers with getStorage is invalid', () => {
    const { getStorageSpy, sut } = makeSut()
    sut.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })
})
