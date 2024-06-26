import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { AddAccountParams, IAddAccount } from '@/domain/usecases'
import { AuthParams } from '@/domain/usecases/auth'

export class AddAccountSpy implements IAddAccount {
  account = mockAccountModel()
  params: AuthParams
  callsCount = 0

  async add(params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    this.callsCount++
    return Promise.resolve(this.account)
  }
}
