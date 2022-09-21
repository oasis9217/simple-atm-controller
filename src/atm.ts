import { fetchAccount, validatePIN, Account } from './bank'
import { ATMControllerError } from './errors'

interface ATMControllerResponse {
  status: 'success' | 'error'
  [key: string]: unknown
}

function errorHandler (error: Error | unknown): ATMControllerResponse {
  if (error instanceof Error) {
    // TODO: logger
    return {
      status: 'error',
      reason: error.message,
      error: error
    }
  }

  return {
    status: 'error',
    error: error
  }
}

function validateCardNumberFormat (cardNumber: string): boolean {
  const isValid = (cardNumber.replace(/[ ,-]/, '').match(/^[0-9]{8,19}$/) !== null)

  if (!isValid) {
    throw new ATMControllerError(400, 'Invalid card number')
  }
  return true
}

export class ATMController {
  /**
     * insertCard() triggered by the card reader
     * @param cardNumber
     */
  async insertCard (cardNumber: string): Promise<Account> {
    validateCardNumberFormat(cardNumber)
    const account = await fetchAccount(cardNumber)

    return account
  }

  async enterPIN (account: Account, PIN: string): Promise<Account> {
    if (PIN.length < 4) {
      throw new ATMControllerError(400, 'Invalid PIN number')
    }
    await validatePIN(account, PIN)

    return account
  }

  checkBalance (account: Account): number {
    return account.balance
  }
}