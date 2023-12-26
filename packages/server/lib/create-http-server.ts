import Fastify from 'fastify'

export interface Options {
  port?: number
}

function createHTTPServer(options: Options) {
  const fastify = Fastify({})

  function start() {
    return fastify.listen({ port: options.port ?? 4001 })
  }

  function stop() {
    return fastify.close()
  }

  return { start, stop, server: fastify }
}

export default createHTTPServer
