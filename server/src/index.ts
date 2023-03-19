import dotenv from 'dotenv'
import ipfilter from 'express-ipfilter'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import openApiDocument from './openapi.json' assert { type: 'json' }

import db from './database'
import { setRoutes } from './routes'
import { authenticateToken } from './utils/auth'

dotenv.config({ path: '.env.local' })

const app = express()

app.use(cors())
app.options('*', cors())

app.use(express.json())

app.use(ipfilter.IpFilter(['127.0.0.1']))

// app.use(pino())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.use(authenticateToken)

setRoutes(app)

const port = process.env.PORT
app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
)

process.on('exit', () => db.close())
