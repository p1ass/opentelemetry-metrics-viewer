import { createServer } from 'node:http2'
import { type Http2Bindings, serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { routes } from './connect'
import { honoConnectMiddleware } from './lib/connect-hono'

const app = new Hono<{ Bindings: Http2Bindings }>()

app.use(logger())
app.use(honoConnectMiddleware({ routes: routes }))

app.get('/', c => {
  return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
  createServer,
})
