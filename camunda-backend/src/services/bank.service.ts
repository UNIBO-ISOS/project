import axios from 'axios';
import { Client, createClientAsync } from 'soap';
import { HandlerArgs, Variables } from "camunda-external-task-client-js";

export const verifyToken = async ({ task, taskService }: HandlerArgs) => {
    console.log('verify token!')
    try {
        console.log(process.env.SOAP_SERVICE_URL_WSDL!)
        const soapRequest = await createClientAsync(process.env.SOAP_SERVICE_URL_WSDL!);
        console.log(soapRequest.describe())

        // retrieve environmenr variable (missing to user)
        const tokenToVerify = task.variables.get('token');
        const toUser = task.variables.get('toUser');
        const amount = task.variables.get('amount');
        const bk = task.businessKey;

        await taskService.complete(task, task.variables);

        soapRequest.verifyTransaction({ token: tokenToVerify, bk: bk, to_user: toUser, amount: amount }, (err: any, result: any) => {
            if(err) {
                console.log(err)
                return
            }
            console.log('success?!')
        })
    } catch(err) {
        console.log(err)
    }
}