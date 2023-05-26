import app from './app.js'
import config from './config/config.js'
import { logger } from './utils/logger.js'

const PORT = config.serverPort

const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`))
server.on('error', (err) => logger.error(err))
