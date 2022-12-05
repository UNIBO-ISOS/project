import { myBank } from "../bankWrapper/wrapper"
import { moveToken } from "../util/util"

const service = {
    BankServiceService: {
        BankServiceServicePort: {
            login: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to login with args ${args}`)
                    try {
                        //resolve(args)
                        //const bank = new BankWrapper()
                        const response = await myBank.loginClient(args)
                        resolve(response)
                    } catch (err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            logout: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to logout with args ${args}`)
                    try {
                        resolve(args)
                        //const bank = new BankWrapper()
                        //const response = await myBank.logout(args)
                        //resolve(response)
                    } catch (err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            newTransaction: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to create a new transaction with args: ${args}`)
                    try {
                        const token = args.bk
                        delete args.bk
                        //const bank = new BankWrapper()
                        const response = await myBank.newTransaction(args)
                        const body = { 
                            "messageName": 'message',
                            "businessKey": token,
                            "processVariables": {}
                        }
                        //await moveToken(body)
                        resolve(response)
                    } catch (err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            verifyTransaction: ( args: any ) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to verify token with args ${args}`)
                    try {
                        const token = args.bk
                        delete args.bk
                        //const bank = new BankWrapper()
                        const response = await myBank.verifyTransaction(args)
                        const verified = response[0].status.$value
                        let body = { 
                            "messageName": verified ? process.env.CAMUNDA_SUCCESSFUL_TOKEN_VERIFICATION! : process.env.CAMUNDA_UNSUCCESSFUL_TOKEN_VERIFICATION!,
                            "businessKey": token,
                            "processVariables": {}
                        } 
                        await moveToken(body)
                        resolve(response)
                    } catch (err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            refundTransaction: ( args: any ) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to refund token with args ${args}`)
                    try {
                        const token = args.bk
                        delete args.bk
                        const response = await myBank.refundTransaction(args)
                        const verified = response[0].status.$value
                        let body = { 
                            "messageName": verified ? process.env.CAMUNDA_SUCCESSFUL_REFUND! : process.env.CAMUNDA_UNSUCCESSFUL_REFUND!,
                             "businessKey": token,
                             "processVariables": {}
                         } 
                        await moveToken(body)
                        resolve(response)
                    } catch(err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            getBalance: ( args: any ) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to getBalance ${args}`)
                    try {
                        const response = await myBank.getBalance(args)
                        resolve(response)
                    } catch(err) {
                        reject(err)
                    }
                }).catch((err: any) => {
                    console.log(err)
                })
            }
        }
    }
}

export { service } 