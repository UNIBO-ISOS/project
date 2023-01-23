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
    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/orders/wait`, body, { headers: { businessKey: bk } });



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
    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/orders/wait`, body, { headers: { businessKey: bk } });


    await taskService.complete(task)
}

export const VerifyCancelCondition = async ({ task, taskService }: HandlerArgs) => {
    const orderId = task.variables.get('orderId');
    const pv = variablesFrom(task.variables)

    const order = await Order.findById(orderId);
    if (order == undefined) {
        pv.set('cancel', false)
        await taskService.complete(task, pv)
        return
    }

    const now = [new Date().getHours(), new Date().getMinutes()];
    now[0] += 1;
    const hours = order.hour.split(":")
    const orderTime = [parseInt(hours[0]), parseInt(hours[1])]
    const nowSeconds = now[0] * 3600 + now[1] * 60;
    const orderSeconds = orderTime[0] * 3600 + orderTime[1] * 60;

    if (orderSeconds - nowSeconds > 3600) {
        order.status = 'CANCELLED'
        await order.save();
        pv.set('cancel', true)
        await taskService.complete(task, pv)
        return
    }

    console.log(now)
    console.log(orderTime)

    pv.set('cancel', false)
    await taskService.complete(task, pv)
}

export const SendOrderCancelled = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;

    const body = {
        status: true
    }
    // send-order-created
    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/orders/waitCancel`, body, { headers: { businessKey: bk } });
    await taskService.complete(task)
}

export const impossibleToRefund = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;

    const body = {
        status: false
    }
    // send-order-created
    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/orders/waitCancel`, body, { headers: { businessKey: bk } });
    //todo: notify user
    await taskService.complete(task)
}

export const RefundUser = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;
    const token = task.variables.get('token')

    const bodySoap = `
        <?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <refundTransaction xmlns="acme.bank.com.xsd">
              <token>${token}</token>
              <bk>${bk}</bk>
            </refundTransaction>
          </soap:Body>
        </soap:Envelope>
    `
    await taskService.complete(task)
    await axios.post('http://soap-service:6666/wsdl', bodySoap, { headers: { 'Content-type': 'text/xml' } })
}

export const SendOrderNotCancelled = async ({ task, taskService }: HandlerArgs) => {
    const bk = task.businessKey;

    const body = {
        status: false
    }
    // send-order-created

    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/orders/waitCancel`, body, { headers: { businessKey: bk } });
    await taskService.complete(task)
}