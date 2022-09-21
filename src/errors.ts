export class ATMControllerError extends Error {
  httpStatusCode: number
  date: Date

  constructor (httpStatusCode: number, ...params: string[]) {
    super(...params)

    this.name = 'ATMControllerError'
    this.httpStatusCode = httpStatusCode
    this.date = new Date()
  }
}

export class BankControllerError extends Error {
  httpStatusCode: number
  date: Date

  constructor (httpStatusCode: number, ...params: string[]) {
    super(...params)

    this.name = 'BankControllerError'
    this.httpStatusCode = httpStatusCode
    this.date = new Date()
  }
}
