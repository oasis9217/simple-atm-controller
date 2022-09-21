import { ATMControllerError } from './errors'
import { makeID } from './utils'
import { takeCashIn, takeCashOut } from './cashbin'
import {
  Account,
  fetchAccount,
  validatePIN,
  getAccountBalance,
  updateAccountBalance
} from './bank'

interface ATMControllerResponse {
  status: 'success' | 'error'
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler (error: Error | unknown): ATMControllerResponse {
  if (error instanceof Error) {
    // TODO: logger
    return {
      status: 'error',
      reason: error.message,
      error
    }
  }

  return {
    status: 'error',
    error
  }
}

function validateCardNumberFormat (cardNumber: string): boolean {
  const isValid = (cardNumber.replace(/[ ,-]/, '').match(/^[0-9]{8,19}$/) !== null)

  if (!isValid) {
    throw new ATMControllerError(400, 'Invalid card number')
  }
  return true
}

function validateCashAmount (amount: number): boolean {
  if (!Number.isInteger(amount)) {
    throw new ATMControllerError(400, 'Invalid cash amount')
  }

  if (amount < 1) {
    throw new ATMControllerError(400, 'Invalid cash amount')
  }

  if (amount > 999999) {
    throw new ATMControllerError(400, 'Too much cash requests')
  }

  return true
}

export class ATMController {
  sessionID: string
  createdAt: Date
  account: Account | null

  constructor () {
    this.sessionID = makeID()
    this.createdAt = new Date()
    this.account = null
  }

  /**
     * insertCard() triggered by the card reader
     * @param cardNumber
     */
  async insertCard (cardNumber: string): Promise<boolean> {
    validateCardNumberFormat(cardNumber)

    const account = await fetchAccount(cardNumber)
    this.account = account

    return true
  }

  async enterPIN (PIN: string): Promise<boolean> {
    if (this.account === null) {
      throw new ATMControllerError(500, 'User account is not set')
    }

    if (PIN.length < 4) {
      throw new ATMControllerError(400, 'Invalid PIN number')
    }

    await validatePIN(this.account, PIN)
    return true
  }

  async checkBalance (): Promise<number> {
    if (this.account === null) {
      throw new ATMControllerError(500, 'User account is not set')
    }
    const balance = await getAccountBalance(this.account)
    return balance
  }

  async deposit (amount: number): Promise<boolean> {
    if (this.account === null) {
      throw new ATMControllerError(500, 'User account is not set')
    }

    validateCashAmount(amount)

    const balance = await this.checkBalance()
    await takeCashIn()
    await updateAccountBalance(this.account, balance + amount)

    return true
  }

  async withdraw (amount: number): Promise<boolean> {
    if (this.account === null) {
      throw new ATMControllerError(500, 'User account is not set')
    }

    validateCashAmount(amount)

    const balance = await this.checkBalance()

    if (amount > balance) {
      throw new ATMControllerError(400, 'Not enough balance')
    }

    await takeCashOut()
    await updateAccountBalance(this.account, balance - amount)

    return true
  }
}

export default ATMController
