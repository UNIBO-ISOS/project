import * as soap from 'soap'
import dotenv from 'dotenv'
import fs from 'fs'
import http from 'http'
import { service } from './serviceSOAP/service';

// load environment
dotenv.config();

const wsdl = fs.readFileSync(process.env.WSDL_PATH!, 'utf-8')

const server = http.createServer((request, response) => {
    response.end('404: Not Found' + request.url)
})

server.listen(parseInt(process.env.HTTP_PORT!))

const soapServer = soap.listen(server, '/wsdl', service, wsdl, () => {
    console.log('Server initialized?!')
})

soapServer.log = (type: string, data: any) => {
    console.log(`SOAP received request!\n Type: ${type} with ${data} `)
}