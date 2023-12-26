import type { FastifyInstance } from 'fastify'
import type { Server } from 'socket.io'

function registerCreateVersionRoute(httpServer: FastifyInstance, socketServer: Server) {
  httpServer.post('/versions', async (request) => {
    socketServer.emit('updateVersion', request.body)
    return null
  })
}

export default registerCreateVersionRoute
