import axios from "axios";
import { HandlerArgs } from "camunda-external-task-client-js";

export const AskCouriersInRange = async ({ task, taskService }: HandlerArgs) => {

    await taskService.complete(task, task.variables)
    console.log("Asking couriers in range completed after task complete");
    await axios.get("http://gis-service:7005/gis/couriers", {
        params: {
            bk: task.businessKey,
            lat: 44.723853,
            lng: 10.561290
        }
    });

    // let ids = couriers.data.documenys.map((c: any) => c._id);
    // pvar.set("couriers", ids);

}