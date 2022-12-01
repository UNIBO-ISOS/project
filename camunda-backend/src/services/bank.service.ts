import axios from "axios";
import { HandlerArgs } from "camunda-external-task-client-js";
import { createClientAsync } from 'soap';

export const verifyToken = async ({ task, taskService }: HandlerArgs) => {
    console.log('verify token!')
    try {
        // console.log(process.env.SOAP_SERVICE_URL_WSDL!)
        const soapRequest = await createClientAsync(process.env.SOAP_SERVICE_URL_WSDL!);
        // console.log(soapRequest.describe())

        // retrieve environmenr variable (missing to user)
        const tokenToVerify = task.variables.get('token');
        const toUser = task.variables.get('toUser');
        const amount = task.variables.get('amount');
        const bk = task.businessKey;

        await taskService.complete(task, task.variables);

        soapRequest.verifyTransaction({ token: tokenToVerify, bk: bk, to_user: toUser, amount: amount }, (err: any, result: any) => {
            if (err) {
                console.log(err)
                return
            }
            console.log('success?!')
        })
    } catch (err) {
        console.log(err)
    }
}

export const SendSuccessfulVerification = async ({ task, taskService }: HandlerArgs) => {
    console.log('send successful verification!')
    await axios.post("http://customer-server:3001/orders/verifyToken", {
        validated: true
    }, {
        headers: {
            businessKey: task.businessKey
        }
    })


    await taskService.complete(task, task.variables);
}

export const SendUnsuccessfulVerification = async ({ task, taskService }: HandlerArgs) => {
    await axios.post("http://customer-server:3001/orders/verifyToken", {
        validated: false
    }, {
        headers: {
            businessKey: task.businessKey
        }
    })

    await taskService.complete(task, task.variables);
}