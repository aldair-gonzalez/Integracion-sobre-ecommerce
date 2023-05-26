import '../utils/env.js'
import { mode } from './command.config.js'

import defaultConfig from './default.config.js'
import developmentConfig from './development.config.js'
import productionConfig from './production.config.js'
import authConfig from './auth.config.js'
import mongooseConfig from './mongoose.config.js'

export default {
  ...defaultConfig,
  ...(mode === 'PRODUCTION' ? productionConfig : developmentConfig),
  authConfig,
  mongooseConfig
}
