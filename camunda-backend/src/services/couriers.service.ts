import axios from 'axios';
import { HandlerArgs, Variables } from 'camunda-external-task-client-js';

interface PriceProposal {
    courierId: string;
    price: number;
}

export const SendCourierRequest = async ({ task, taskService }: HandlerArgs) => {
    const courierId = task.variables.get('courierId');

    await taskService.complete(task, task.variables)

    try {
        await axios.get("http://courier-service:3000/api/v1/availability/" + courierId, {
            params: {
                bk: task.businessKey
            }
        })
    } catch (err) {
        console.log(err);
    }

    // TODO:Send request to courier service
    // let localVariables = new Variables();
    // localVariables.set("InputCourier", courierId)
    // console.log("Local variable set.", courierId)
    // console.log(localVariables.getAll())

    /* Bisogna mandare bk e activity id. */
    // console.log(`${taskService.}`)

    // Complete the task
}

export const UpdateList = async ({ task, taskService }: HandlerArgs) => {
    const price = task.variables.get('price');
    const courierId: string | undefined = task.variables.get('courierId');

    // TODO: Update courier list on mongo
    const pvar = variablesFrom(task.variables)
    const list: any[] = pvar.get("auction")
    if (list == undefined) {
        pvar.set("auction", [{ price, courierId }])
    } else {
        list.push({ price, courierId })
        pvar.set("auction", list)
    }



    // Complete the task
    await taskService.complete(task, pvar)
}

export const SelectCourier = async ({ task, taskService }: HandlerArgs) => {
    const courierList = task.variables.get('auction');
    // console.log(courierList);
    console.log("Compute best courier");

    if (courierList == undefined || courierList.length <= 0) {
        console.log("No couriers available");
        await taskService.complete(task, task.variables);
        return;
    }


    // Select the cheapest courier
    let courier = courierList[0];
    for (let i = 1; i < courierList.length; i++) {
        if (courierList[i].price < courier.price) {
            courier = courierList[i];
        }
    }

    let pvar = variablesFrom(task.variables);
    pvar.set('courier', courier)
    // Complete the task
    await taskService.complete(task, pvar)
}

export const variablesFrom = (variables: Variables): Variables => {
    let res = new Variables();
    res.setAll(variables.getAll());

    return res;
}