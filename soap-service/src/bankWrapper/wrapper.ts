import { createClientAsync, Client } from 'soap';

/**
 * Allows the communication of the application 
 * to the bank's service throgh SOAP
 */
class BankWrapper {
    /**
    * path to the wsdl file, it specify the methods implemented by the bank
    */
    private wsdl: string = process.env.WSDL_PATH!;
    private client: Promise<Client>;

    constructor() {
        this.client = createClientAsync(this.wsdl)
    }

    /**
     * 
     * @returns when the promise is completed it returns the value of the session
     */
    login(args: any) : Promise<string>{
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.loginAsync( args )
                resolve(response)
                /*const body = response[0]
                resolve(body.sid.$value)*/
            })
            .catch((err) => {
                reject(err)
                // retry to connect with a timeout of 5s
            })
        })
    }

    //todo: test function
     logout(args: any) : Promise<string>{
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.logoutAsync( args )
                resolve(response)
            })
            .catch((err) => {
                reject(err)
                // retry to connect with a timeout of 5s
            })
        })
    }

    //todo: test function
    /**
     * create a new transaction
     * @param sid id of transaction
     * @param to_user the user that recives the payment
     * @param amount the amount of money to send
     * @returns 
     */
     newTransaction(args: any) {
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.newTransactionAsync( args )
                resolve(response)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * checks if the transaction is paid
     * @param token id of transaction
     * @param amount the amount to check
     * @returns a promise, if the request succeed a boolean 
     * (true if paid, false otherwise) otherwise the error
     */
    verifyTransaction(args: any) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.verifyTransactionAsync(args)
                resolve(response)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * refunds a user when the order is canceled
     * @param token id of transaction
     * @param to_user the user to refund
     * @returns 
     */
    refundTransaction(args: any) {
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.refundTransactionAsync( args )
                resolve(response)
            })
            .catch((err) => {
                reject(err)
            })
        })
    } 

}

export { BankWrapper }