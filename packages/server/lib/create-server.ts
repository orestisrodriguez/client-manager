import createHTTPServer, { type Options as CreateHTTPServerOptions } from './create-http-server.ts'
import createSocketServer, { type Options as CreateSocketServerOptions } from './create-socket-server.ts'

import registerCreateVersionRoute from './register-create-version-route.ts'

interface Options {
  http: CreateHTTPServerOptions
  socket: CreateSocketServerOptions
}

function createServer(options: Options) {
  const socketServer = createSocketServer(options.socket)
  const httpServer = createHTTPServer(options.http)

  registerCreateVersionRoute(httpServer.server, socketServer.server)

  function start() {
    return Promise.all([httpServer.start(), socketServer.start()])
  }

  function stop() {
    return Promise.all([httpServer.stop(), socketServer.stop()])
  }

  return { start, stop }
}

export default createServer
