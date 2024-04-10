/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker'
import { LocalSaveAccessToken } from './local-save-access-token'
import { SetStorageSpy } from '@/data/test/mock-set-storage'

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct with values', async () => {
    const setStorageSpy = new SetStorageSpy()
    const sut = new LocalSaveAccessToken(setStorageSpy)
    const accessToken = faker.string.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
