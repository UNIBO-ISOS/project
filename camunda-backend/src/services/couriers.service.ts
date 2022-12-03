import axios from 'axios';
import { HandlerArgs, Variables } from 'camunda-external-task-client-js';

interface PriceProposal {
    courierId: string;
    price: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const SendCourierRequest = async ({ task, taskService }: HandlerArgs) => {
    try {
        console.log('SendCourierRequest');
        const courierId = task.variables.get('courierId');

        console.log(`Sent request to courier ${courierId}`);

        await taskService.complete(task, task.variables)
        await axios.get("http://courier-service:3000/api/v1/availability/" + courierId, {
            params: {
                bk: task.businessKey
            }
        })
    } catch (err) {
        console.log(err);
    }
}

export const SelectCourier = async ({ task, taskService }: HandlerArgs) => {
    // const courierList = task.variables.get('auction');
    // console.log(courierList);
    console.log("Compute best courier");

    let pvar = variablesFrom(task.variables)
    let couriers = pvar.get("couriers")
    let courier = undefined;
    let maxPrice = Number.MAX_VALUE;

    for (let id of couriers) {
        const price = pvar.get(`courier-${id}`);
        if (typeof price == "number" && price < maxPrice) {
            maxPrice = price;
            courier = { id, price };
        }
    }

    pvar.set('courier', courier)
    pvar.set('courierAvailable', courier != undefined)
    console.log(courier)

    // Complete the task
    await taskService.complete(task, pvar)
}

export const variablesFrom = (variables: Variables): Variables => {
    let res = new Variables();
    res.setAll(variables.getAll());

    return res;
}