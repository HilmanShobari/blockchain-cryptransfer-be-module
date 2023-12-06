import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import Decimal from 'decimal.js'
import Env from '@ioc:Adonis/Core/Env'
import WebSocket from 'ws'

export default class SetupWebSocket {
  // setup websocket ethereum
  public static async setupWebSocketEthereum() {
    const network = 'ETHEREUM'
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)

    ws.on('open', () => {
      const contentMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['alchemy_minedTransactions'],
      }

      console.log(`Connected to WebSocket ${network}`)
      ws.send(JSON.stringify(contentMessage))
    })

    ws.on('message', async (data) => {
      try {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)
        const myBlock = parseInt(obj.params.result.transaction.blockNumber, 16)

        let destination = obj.params.result.transaction.to

        // push notif
        // if using native coin
        if (destination === Env.get('QOINPAY_ADDRESS').toLowerCase()) {
          const hex = obj.params.result.transaction.value
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_COIN_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_COIN_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
        }
      } catch (error) {
        // console.error(error.message)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket ${network} connection closed. Reconnecting...`)
      // Reconnect after a delay
      setTimeout(() => {
        ws.terminate() // Terminate the existing connection
        ws.removeAllListeners() // Remove all listeners to avoid memory leaks
        this.setupWebSocketEthereum() // Reinitialize the WebSocket connection
      }, 1000)
    })
  }

  // setup websocket polygon
  public static async setupWebSocketSolana() {
    const network = 'SOLANA'
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)

    ws.on('open', () => {
      const contentMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['alchemy_minedTransactions'],
      }

      console.log(`Connected to WebSocket ${network}`)
      ws.send(JSON.stringify(contentMessage))
    })

    ws.on('message', async (data) => {
      try {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)
        const myBlock = parseInt(obj.params.result.transaction.blockNumber, 16)

        let destination = obj.params.result.transaction.to

        // push notif
        // if using native coin
        if (destination === Env.get('QOINPAY_ADDRESS').toLowerCase()) {
          const hex = obj.params.result.transaction.value
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_COIN_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_COIN_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
        }
      } catch (error) {
        // console.error(error.message)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket ${network} connection closed. Reconnecting...`)
      // Reconnect after a delay
      setTimeout(() => {
        ws.terminate() // Terminate the existing connection
        ws.removeAllListeners() // Remove all listeners to avoid memory leaks
        this.setupWebSocketSolana() // Reinitialize the WebSocket connection
      }, 1000)
    })
  }

  // setup websocket polygon
  public static async setupWebSocketPolygon() {
    const network = 'POLYGON'
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)

    ws.on('open', () => {
      const contentMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['alchemy_minedTransactions'],
      }

      console.log(`Connected to WebSocket ${network}`)
      ws.send(JSON.stringify(contentMessage))
    })

    ws.on('message', async (data) => {
      try {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)
        const myBlock = parseInt(obj.params.result.transaction.blockNumber, 16)

        let destination = obj.params.result.transaction.to

        // push notif
        // if using native coin
        if (destination === Env.get('QOINPAY_ADDRESS').toLowerCase()) {
          const hex = obj.params.result.transaction.value
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_COIN_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_COIN_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
        }
      } catch (error) {
        // console.error(error.message)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket ${network} connection closed. Reconnecting...`)
      // Reconnect after a delay
      setTimeout(() => {
        ws.terminate() // Terminate the existing connection
        ws.removeAllListeners() // Remove all listeners to avoid memory leaks
        this.setupWebSocketPolygon() // Reinitialize the WebSocket connection
      }, 1000)
    })
  }

  // setup websocket sepolia
  public static async setupWebSocketSepolia() {
    const network = 'SEPOLIA'
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)

    ws.on('open', () => {
      const contentMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['alchemy_minedTransactions'],
      }

      console.log(`Connected to WebSocket ${network}`)
      ws.send(JSON.stringify(contentMessage))
    })

    ws.on('message', async (data) => {
      try {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)
        const myBlock = parseInt(obj.params.result.transaction.blockNumber, 16)

        let destination = obj.params.result.transaction.to

        // push notif
        // if using native coin
        if (destination === Env.get('QOINPAY_ADDRESS').toLowerCase()) {
          const hex = obj.params.result.transaction.value
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_COIN_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          console.log('finalValue: ', finalValue)
          console.log('uniqueCode: ', uniqueCode)

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_COIN_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
          // if using USDT on SEPOLIA
        } else if (destination === Env.get(`${network}_USDT_ADDRESS`).toLowerCase()) {
          const hex = obj.params.result.transaction.input.slice(74)
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_USDT_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          console.log('finalValue: ', finalValue)
          console.log('uniqueCode: ', uniqueCode)

          destination = '0x' + obj.params.result.transaction.input.slice(34, 74)

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_USDT_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
        }
      } catch (error) {
        // console.error(error.message)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket ${network} connection closed. Reconnecting...`)
      // Reconnect after a delay
      setTimeout(() => {
        ws.terminate() // Terminate the existing connection
        ws.removeAllListeners() // Remove all listeners to avoid memory leaks
        this.setupWebSocketSepolia() // Reinitialize the WebSocket connection
      }, 1000)
    })
  }

  // setup websocket mumbai
  public static async setupWebSocketMumbai() {
    const network = 'MUMBAI'
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)

    ws.on('open', () => {
      const contentMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['alchemy_minedTransactions'],
      }

      console.log(`Connected to WebSocket ${network}`)
      ws.send(JSON.stringify(contentMessage))
    })

    ws.on('message', async (data) => {
      try {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)
        const myBlock = parseInt(obj.params.result.transaction.blockNumber, 16)

        let destination = obj.params.result.transaction.to

        // push notif
        // if using native coin
        if (destination === Env.get('QOINPAY_ADDRESS').toLowerCase()) {
          const hex = obj.params.result.transaction.value
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_COIN_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          console.log('finalValue: ', finalValue)
          console.log('uniqueCode: ', uniqueCode)

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_COIN_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
          // if using QBRIDGE on MUMBAI
        } else if (destination === Env.get(`${network}_QBRIDGE_ADDRESS`).toLowerCase()) {
          const hex = obj.params.result.transaction.input.slice(74)
          const value = new BigNumber(hex, 16).toString()
          const decimal = Env.get(`${network}_QBRIDGE_DECIMAL`)
          const finalValue = await this.getFinalValue(value, decimal)
          const uniqueCode = finalValue.slice(-Env.get('UNIQUE_CODE_LENGTH'))

          console.log('finalValue: ', finalValue)
          console.log('uniqueCode: ', uniqueCode)

          destination = '0x' + obj.params.result.transaction.input.slice(34, 74)

          const blockConfirm = await this.blockConfirm(network, myBlock, obj)

          const newObj = {
            coinName: Env.get(`${network}_QBRIDGE_NAME`),
            network,
            tx: obj,
            destination,
            value: finalValue,
            uniqueCode,
          }

          if (!!blockConfirm) {
            return await this.postHandler(newObj)
          }
          return
        }
      } catch (error) {
        // console.error(error.message)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket ${network} connection closed. Reconnecting...`)
      // Reconnect after a delay
      setTimeout(() => {
        ws.terminate() // Terminate the existing connection
        ws.removeAllListeners() // Remove all listeners to avoid memory leaks
        this.setupWebSocketMumbai() // Reinitialize the WebSocket connection
      }, 1000)
    })
  }

  //block confirm
  public static async blockConfirm(network: string, myBlock: number, obj): Promise<boolean> {
    const websocketUrl = Env.get(`WEBSOCKET_URL_${network}`)
    const ws = new WebSocket(websocketUrl)
    const txHash = obj.params.result.transaction.hash

    return new Promise<boolean>((resolve) => {
      ws.on('open', () => {
        const contentMessage = {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_subscribe',
          params: ['newHeads'],
        }

        console.log(`Connected to WebSocket ${network} block tracing txHash: ${txHash}`)
        ws.send(JSON.stringify(contentMessage))
      })

      ws.on('message', async (data) => {
        const dataString = data.toString()
        const obj = JSON.parse(dataString)

        if (obj.params?.result?.number) {
          const latestBlock = obj.params.result.number
          const different = latestBlock - myBlock

          // resolve true if condition is met
          if (different > Env.get('BLOCK_CONFIRM_THRESHOLD')) {
            console.log(`WebSocket ${network} txHash: ${txHash} block confirmed!`)
            ws.close()
            resolve(true)
          }
        }
      })

      ws.on('close', () => {
        console.log(`WebSocket ${network} txHash: ${txHash} closed`)
      })
    })
  }

  // post handler
  private static async postHandler(obj: any) {
    try {
      const from = obj.tx.params.result.transaction.from
      const txHash = obj.tx.params.result.transaction.hash
      const chainId = parseInt(obj.tx.params.result.transaction.chainId, 16).toString()

      const response = await axios.post(Env.get('PUSHNOTIF_API'), {
        coinName: obj.coinName,
        network: obj.network,
        from,
        destination: obj.destination,
        value: obj.value,
        uniqueCode: obj.uniqueCode,
        txHash,
        chainId,
      })

      console.log('HTTP request success!')
    } catch (error) {
      console.error('HTTP request error:', error.message)
    }
  }

  private static async getFinalValue(value, decimal) {
    const initialValue = new Decimal(value)
    const divisor = new Decimal(10 ** decimal)
    const result = initialValue.dividedBy(divisor)
    const finalResult = result.toFixed(parseInt(decimal))

    return finalResult
  }
}
