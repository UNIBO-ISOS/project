import axios from 'axios';
import { HandlerArgs } from 'camunda-external-task-client-js';
import { IOrder, Order } from '../repository/order.repo';
import { variablesFrom } from './couriers.service';

export const CreateNewOrder = async ({ task, taskService }: HandlerArgs) => {
    const status = 'PENDING'
    const order = task.variables.get('order');

    const object: IOrder = {
        status: status,
        ...order
    }

    const document = new Order(object);
    const { _id } = await document.save()

    const pvar = variablesFrom(task.variables)
    pvar.set("orderId", _id)

    await taskService.complete(task, pvar)
}

export const NotifyOrderCreated = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;

    const body = {
        orderId: task.variables.get('orderId'),
        status: 'ok',
        message: 'Order created'
    }
    // send-order-created
    await axios.post('http://customer-server:3001/orders/wait', body, { headers: { businessKey: bk } });



    await taskService.complete(task, task.variables)
}

export const NotifyOrderNotAvailable = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;

    const body = {
        orderId: task.variables.get('orderId'),
        status: 'error',
        message: 'Order could not be created'
    }
    // send-order-created
    await axios.post('http://customer-server:3001/orders/wait', body, { headers: { businessKey: bk } });


    await taskService.complete(task)
}