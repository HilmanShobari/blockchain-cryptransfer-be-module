/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import QR from 'App/Controllers/Http/QrController'
import Env from '@ioc:Adonis/Core/Env'

Route.get('/', async () => {
  return 'Hello world from a slim app'
})

async function serverConnect() {
  const username = Env.get('RABBIT_USER')
  const password = Env.get('RABBIT_PASS')
  const hostname = Env.get('HOSTNAME')
  const vhost = Env.get('VHOST')

  const amqplib = require('amqplib')
  const utf8 = require('utf8')
  const opt = { credentials: require('amqplib').credentials.plain(username, password) }
  const queueServer = 'blockchain.que.cryptotransfer'
  let resMessage

  try {
    let conn = await amqplib.connect(
      {
        protocol: 'amqp',
        hostname: hostname,
        port: Number(5672),
        username: username,
        password: password,
        vhost: vhost,
      },
      opt,
      (err) => {
        console.log(err)
      }
    )

    let ch = await conn.createChannel()
    process.once('SIGINT', () => conn.close())

    let q = await ch.assertQueue(queueServer)
    ch.prefetch(1)
    console.log('[v] Awaiting RPC requests')

    //Server : Start
    await ch.consume(
      q.queue,
      async (msg) => {
        let replyMessage = msg.content.toString()

        // console.log('[.] Server Received : Message => ' + replyMessage)
        const obj = JSON.parse(replyMessage)

        let actionCommand = obj.command

        switch (actionCommand) {
          // SBT
          case 'CreateQr':
            let tempCreateID = await QR.createQr(obj.data)
            resMessage = tempCreateID
            break

          default:
            resMessage = ''
            break
        }

        resMessage = resMessage !== null ? resMessage : ''
        // console.log('Data : ', resMessage)
        let messageBytes = utf8.encode(JSON.stringify(resMessage))
        ch.sendToQueue(msg.properties.replyTo, Buffer.from(messageBytes, 'utf-8'), {
          correlationId: msg.properties.correlationId,
        })

        ch.ack(msg)
      },
      { noAck: false }
    )
  } catch (ex) {
    console.error(ex)
  }
}

serverConnect()
