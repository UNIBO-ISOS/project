import axios from 'axios'

const moveToken = async (body: any) => {
    await axios.post(process.env.CAMUNDA_URL!, body)
}

export { moveToken }