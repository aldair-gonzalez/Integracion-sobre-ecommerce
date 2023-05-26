import express from 'express'
import path from 'path'
import hbs from 'express-handlebars'
import compression from 'express-compression'

import { __dirname } from './dirname.js'
import { useMorgan } from './middlewares/morgan.js'
import { isError } from './middlewares/error.js'

const app = express()

app.use(useMorgan)

app.use(compression({ brotli: { enabled: true, zlib: {} } }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(`${__dirname}/views`)))

app.engine('hbs', hbs.engine({ extname: 'hbs' }))
app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

app.use(isError)

export default app
