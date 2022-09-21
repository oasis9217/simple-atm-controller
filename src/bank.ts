/**
 * Mock functions of Bank service
 */
import { sign } from 'jsonwebtoken'
import db from './sampleDB.json'
import { BankControllerError } from './errors'

const mockAccountsJSON = db.accounts
const mockAccounts = mockAccountsJSON.map(decodeAccount)

interface AccountJSON {
  account_id: string
  user_name: string
  user_id: string
  card_numbers: string[]
  pin: string
  balance: number
  created_at: string
}

export interface Account {
  accountID: string
  userName: string
  userID: string
  cardNumbers: string[]
  PIN: string
  balance: number
  createdAt: Date
}

function decodeAccount (json: AccountJSON): Account {
  return {
    accountID: json.account_id,
    userName: json.user_name,
    userID: json.user_id,
    cardNumbers: json.card_numbers,
    PIN: json.pin,
    balance: json.balance,
    createdAt: new Date(json.created_at)
  }
}

function simpleHash (str: string): string {
  return sign(str, 'simple')
}

export async function fetchAccount (cardNumber: string): Promise<Account> {
  const targetAccount = mockAccounts.filter(account => account.cardNumbers.includes(cardNumber))

  if (targetAccount.length < 1) {
    throw new BankControllerError(404, 'Account not found')
  }

  return targetAccount[0]
}

export async function validatePIN (account: Account, PIN: string): Promise<boolean> {
  const hashed = simpleHash(PIN)

  if (account.PIN !== hashed) {
    throw new BankControllerError(401, 'Invalid PIN number')
  }

  return true
}

export async function getAccountBalance (account: Account): Promise<number> {
  return account.balance
}

export async function updateAccountBalance (account: Account, balance: number): Promise<boolean> {
  /**
   * Never should appear in practice
   * TODO: writing to JSON file
   */
  mockAccounts.forEach(a => {
    if (a.accountID === account.accountID) {
      a.balance = balance
    }
  })

  return true
}
