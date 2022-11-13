import { BankWrapper } from "../bankWrapper/wrapper"
import { moveToken } from "../util/util"

const service = {
    BankServiceService: {
        BankServiceServicePort: {
            login: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to login with args ${args}`)
                    const bank = new BankWrapper()
                    const token = bank.login(args)
                    //todo: verify token's fields
                    const body = { 
                        "messageName": 'message',
                        "businessKey": args.bk,
                        "processVariables": {}
                    }
                    await moveToken(body)
                    resolve({
                        token: token
                    })
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            logout: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to logout with args ${args}`)
                    const bank = new BankWrapper()
                    const response = bank.logout(args)
                    //todo: verify token's fields
                    const body = { 
                        "messageName": 'message',
                        "businessKey": args.bk,
                        "processVariables": {}
                    }
                    await moveToken(body)
                    resolve({
                        response: response
                    })
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            newTransaction: (args: any) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to create a new transaction with args: ${args}`)
                    const bank = new BankWrapper()
                    const response = bank.newTransaction(args)
                    //todo: verify token's fields
                    const body = { 
                        "messageName": 'message',
                        "businessKey": args.bk,
                        "processVariables": {}
                    }
                    await moveToken(body)
                    resolve({
                        response: response
                    })
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            verifyTransaction: ( args: any ) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to verify token with args ${args}`)
                    const bank = new BankWrapper()
                    const response = bank.verifyTransaction(args)
                    //todo: verify token's fields
                    const body = { 
                        "messageName": 'message',
                        "businessKey": args.bk,
                        "processVariables": {}
                    }
                    await moveToken(body)
                    resolve({
                        transactionConfermed: response
                    })
                }).catch((err: any) => {
                    console.log(err)
                })
            },
            refundTransaction: ( args: any ) => {
                return new Promise(async (resolve, reject) => {
                    console.log(`Received request to refund token with args ${args}`)
                    const bank = new BankWrapper()
                    const response = bank.refundTransaction(args)
                    //todo: verify token's fields
                    const body = { 
                        "messageName": 'message',
                        "businessKey": args.bk,
                        "processVariables": {}
                    }
                    await moveToken(body)
                    resolve({
                        refund: response
                    })
                }).catch((err: any) => {
                    console.log(err)
                })
            }
        }
    }
}

export { service } 