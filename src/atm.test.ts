import { Account } from './bank'
import { ATMControllerError } from "./errors";
import { ATMController } from "./atm";

/**
 * TODO: timerMock, rejected error comparison
 */

describe('ATMController works expectedly', () => {
  describe('insertCard() works expectedly', () => {
    const atm = new ATMController()

    test('returns error with malformed card number', async () => {
      return expect(() => atm.insertCard("1234"))
        .rejects
    })

    test('returns error when an account could not be found', async () => {
      return expect(() => atm.insertCard("1234567899"))
        .rejects
    })

    test('returns account', async () => {
      return expect(() => atm.insertCard("12340000"))
        .resolves
    })
  })

  describe('enterPIN() works expectedly', () => {
    const atm = new ATMController()

    beforeAll(async () => {
      await atm.insertCard('12340000'); // John Doe, 1234
    })

    test('returns error with invalid pin format', async () => {
      return expect(() => atm.enterPIN('1'))
        .rejects
    })

    test('returns error when pin is not correct', async () => {
      return expect(() => atm.enterPIN('1234999'))
        .rejects
    })

    test('returns account', async () => {
      return expect(() => atm.enterPIN('1234'))
        .resolves
    })
  })

  describe('deposit() and withdraw() work expectedly', () => {
    const fooAtm = new ATMController()
    const barAtm = new ATMController()
    const bazAtm = new ATMController()

    beforeAll(async () => {
      await fooAtm.insertCard('12340000'); // John Doe, 1234, zn5sxx
      await barAtm.insertCard('12340001'); // John Doe, 1234, zn5sxx
      await bazAtm.insertCard('12340003'); // Jane Doe, 5678, sr9egy
    })

    test('deposit() returns error with too small or too big money', async () => {
      return Promise.all([
        fooAtm.deposit(0),
        fooAtm.deposit(1000000)
      ])
        .catch(err => {
          expect(err).toBeInstanceOf(ATMControllerError)
        })
    })

    test('deposit() works expectedly', async () => {
      await fooAtm.deposit(100)
      await barAtm.deposit(100)
      await bazAtm.deposit(500)

      expect(fooAtm.checkBalance())
        .toBe(1200)

      expect(bazAtm.checkBalance())
        .toBe(2500)
    })

    test('withdraw() returns error with too much amount', async () => {
      return expect(() => fooAtm.withdraw(9999))
        .rejects
    })

    test('withdraw() works expectedly', async () => {
      // TODO: concurrency
      await fooAtm.withdraw(100)

      expect(fooAtm.checkBalance())
        .toBe(1100)
    })
  })
})
