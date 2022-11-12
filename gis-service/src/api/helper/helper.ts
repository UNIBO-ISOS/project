import axios from 'axios'

const moveTokenGetCouriers = async (documents: any, bk: any) => {
    const body = { 
        "messageName": process.env.MESSAGE_NAME!,
        "businessKey": bk,
        "processVariables": {
            "couriers": {
                "value": documents,
                "type": "Json"
            },
            "couriersCount": {
                "value": documents.length,
                "type": "Integer"
            }
        }
     }
    //await axios.post(process.env.CAMUNDA_URL!, body)
}

export { moveTokenGetCouriers }