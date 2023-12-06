import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import SetupWebSocket from '../start/socket'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // Start the WebSocket connection
    await SetupWebSocket.setupWebSocketEthereum()
    await SetupWebSocket.setupWebSocketSolana()
    await SetupWebSocket.setupWebSocketPolygon()

    await SetupWebSocket.setupWebSocketSepolia()
    await SetupWebSocket.setupWebSocketMumbai()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
