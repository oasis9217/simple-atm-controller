/**
 * This file is for demonstration purpose only
 */
import { ATMController } from './atm';

/**
 * Simple ATM
 *  - User inserts card and then ATM session created
 *  - User does operations with the account
 *  - Exit
 */
async function ATMflow (commands: string[]): Promise<unknown> {
  try {
    const [cardNumber, PIN, ...cmds] = commands
    const atm = new ATMController()

    await atm.insertCard(cardNumber)
    await atm.enterPIN(PIN)

    console.log('ATM session: ', atm.sessionID, atm.createdAt)
    console.log('Account: ', atm.account?.accountID)
    console.log('Owner: ', atm.account?.userName)

    for (const cmd of cmds) {
      const [op, operand] = cmd.split(',')

      switch (op) {
        case 'checkBalance': {
          const balance = await atm.checkBalance()
          console.log(op, ':', balance)
          break
        }
        case 'deposit':
          await atm.deposit(parseInt(operand, 10))
          console.log(op, operand, ':', await atm.checkBalance())
          break
        case 'withdraw':
          await atm.withdraw(parseInt(operand, 10))
          console.log(op, operand, ':', await atm.checkBalance())
          break
        default:
          console.log('noop')
      }
    }
    console.log('done')
    return
  } catch (err) {
    console.error(err)
  }
}

// eslint-disable-next-line
(async () => {
  console.log('---------------------------------')
  await ATMflow([
    '12340000',
    '1234',
    'checkBalance',
    'deposit,100',
    'withdraw,200'
  ])

  console.log('Non-existing account ---------------------')
  await ATMflow([
    '12340009',
    '1234'
  ])

  console.log('Invalid PIN number -----------------------')
  await ATMflow([
    '12340001',
    '5678'
  ])

  console.log('Not enough money -----------------------')
  await ATMflow([
    '12340001',
    '1234',
    'withdraw,100000'
  ])

  console.log('---------------------------------')
  await ATMflow([
    '12340003',
    '5678',
    'withdraw,1000',
    'checkBalance'
  ])
})()
