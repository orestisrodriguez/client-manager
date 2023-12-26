import { Server } from 'socket.io'

export interface Options {
  port?: number
}

function createSocketServer(options: Options) {
  const io = new Server({
    transports: ['websocket'],
  })

  function start() {
    io.listen(options.port ?? 4002)
    return Promise.resolve()
  }

  function stop() {
    return new Promise<void>((resolve, reject) => {
      io.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  return { start, stop, server: io }
}

export default createSocketServer
