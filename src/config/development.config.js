import '../utils/env.js'
import { port, store } from './command.config.js'
import mongooseConfig from './mongoose.config.js'

export default {
  serverPort: port ?? process.env.SERVER_PORT ?? 3000,
  store: store ?? process.env.STORE ?? 'not loaded',
  mongooseConfig
}
