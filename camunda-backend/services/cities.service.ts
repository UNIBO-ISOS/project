import { HandlerArgs, Variables } from "camunda-external-task-client-js";

export const RetreiveCities = async ({ task, taskService }: HandlerArgs) => {
    // FIXME: retrieve cities from database
    const cities = ['Modena', 'Bologna', 'Ferrara']

    let variables = new Variables();
    variables.set('cities', cities);

    // Complete the task
    await taskService.complete(task, variables);
}

export const ReturnCities = async ({ task, taskService }: HandlerArgs) => {
    const cities = task.variables.get('cities');
    console.log(`return-cities service: ${cities}`);

    // Complete the task
    await taskService.complete(task, task.variables);
}