/* eslint @typescript-eslint/return-await: 0 */
/**
 * Mock functions of cash bin controller
 */

export async function takeCashIn (): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

export async function takeCashOut (): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
