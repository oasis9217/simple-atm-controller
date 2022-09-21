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

    test('returns error with invalid pin format', async() => {
      return expect(() => atm.enterPIN(fooAccount, '1'))
          .rejects
    })

    test('returns error when pin is not correct', async() => {
      return expect(() => atm.enterPIN(fooAccount, '1234999'))
          .rejects
    })

    test('returns account', async() => {
      return expect(() => atm.enterPIN(fooAccount, '1234'))
          .resolves
    })
  })
})


