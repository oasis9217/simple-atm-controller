import { ATMController } from './atm';

/**
 * Simple ATM
 *  - User inserts card and then ATM session created
 *  - User does operations with the account
 *  - Exit
 *
 *  This is for demonstration purpose
 */
async function ATMflow (commands: string[]): Promise<unknown> {
  try {
    const [cardNumber, PIN, ...cmds] = commands
    const atm = new ATMController()

    await atm.insertCard(cardNumber)
    await atm.enterPIN(PIN)

    for (const cmd of cmds) {
      const [op, operand] = cmd.split(',')

      switch (op) {
        case 'checkBalance': {
          const balance = atm.checkBalance()
          console.log(op, ':', balance)
          break
        }
        case 'deposit':
          await atm.deposit(parseInt(operand, 10))
          console.log(op, operand, ':', atm.checkBalance())
          break
        case 'withdraw':
          await atm.withdraw(parseInt(operand, 10))
          console.log(op, operand, ':', atm.checkBalance())
          break
        default:
          console.log('noop')
      }
    }

    return
  } catch (err) {
    console.error(err)
  }
}

// eslint-disable-next-line
(async () => {
  await ATMflow([
    '12340000',
    '1234',
    'checkBalance',
    'deposit,100',
    'withdraw,200'
  ])
})()
