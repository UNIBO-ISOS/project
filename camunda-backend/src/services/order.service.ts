import { HandlerArgs } from 'camunda-external-task-client-js';
import { Order } from '../repository/order.repo';
import { variablesFrom } from './couriers.service';

export const CreateNewOrder = async ({ task, taskService }: HandlerArgs) => {
    // TODO: Create new order on mongo
    const { _id } = new Order();

    const pvar = variablesFrom(task.variables)
    pvar.set("orderId", _id)

    await taskService.complete(task, pvar)
}

export const NotifyOrderCreated = async ({ task, taskService }: HandlerArgs) => {
    // TODO: Notify order created

    await taskService.complete(task, task.variables)
}

export const NotifyOrderNotAvailable = async ({ task, taskService }: HandlerArgs) => {
    // TODO: notify order not available

    await taskService.complete(task)
}