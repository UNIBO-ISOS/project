import { HandlerArgs } from 'camunda-external-task-client-js';
import { IOrder, Order } from '../repository/order.repo';
import { variablesFrom } from './couriers.service';

export const CreateNewOrder = async ({ task, taskService }: HandlerArgs) => {
    const status = 'PENDING'
    const restaurantId = task.variables.get('restaurantId')
    const price = task.variables.get('price')
    const menuId = task.variables.get('menuId')

    const object: IOrder = {
        status: status,
        restaurantId: restaurantId,
        price: price,
        menuId: menuId
    }

    const document = new Order(object);
    const id = await document.save()

    const pvar = variablesFrom(task.variables)
    pvar.set("orderId", id)

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