import { fetchAccount, validatePIN, Account } from './bank'
import { ATMControllerError } from "./errors";
import { ATMController } from "./atm";

describe('ATMController works expectedly', () => {
  const atm = new ATMController()

  describe('insertCard() works expectedly', () => {
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
    let fooAccount: Account; // John Doe, 1234

    beforeAll(async () => {
      fooAccount = await atm.insertCard('12340000');
    })

    test('returns error with invalid pin format', async () => {
      return expect(() => atm.enterPIN(fooAccount, '1'))
        .rejects
    })

    test('returns error when pin is not correct', async () => {
      return expect(() => atm.enterPIN(fooAccount, '1234999'))
        .rejects
    })

    test('returns account', async () => {
      return expect(() => atm.enterPIN(fooAccount, '1234'))
        .resolves
    })
  })

  describe('deposit() and withdraw() work expectedly', () => {
    let fooAccount: Account; // John Doe, 1234, zn5sxx
    let barAccount: Account; // John Doe, 1234, zn5sxx
    let bazAccount: Account; // Jane Doe, 5678, sr9egy

    beforeAll(async () => {
      fooAccount = await atm.insertCard('12340000');
      barAccount = await atm.insertCard('12340001');
      bazAccount = await atm.insertCard('12340003');
    })

    test('deposit() returns error with too small or too big money', async () => {
      return Promise.all([
        atm.deposit(fooAccount, 0),
        atm.deposit(fooAccount, 1000000)
      ])
        .catch(err => {
          expect(err).toBeInstanceOf(ATMControllerError)
        })
    })

    test('deposit() works expectedly', async () => {
      await atm.deposit(fooAccount, 100)
      await atm.deposit(barAccount, 100)
      await atm.deposit(bazAccount, 500)

      expect(atm.checkBalance(fooAccount))
        .toBe(1200)

      expect(atm.checkBalance(bazAccount))
        .toBe(2500)
    })

    test('withdraw() returns error with too much amount', async () => {
      return expect(() => atm.withdraw(fooAccount, 9999))
        .rejects
    })

    test('withdraw() works expectedly', async () => {
      // TODO: concurrency
      await atm.withdraw(fooAccount, 100)

      expect(atm.checkBalance(fooAccount))
        .toBe(1100)
    })
  })
})
