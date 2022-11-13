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