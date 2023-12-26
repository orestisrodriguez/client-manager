import assert from 'node:assert'
import { After, type DataTable, Given, Then, When } from '@cucumber/cucumber'
import { Socket, io } from 'socket.io-client'

import createServer from '../../lib/create-server.ts'

let server: ReturnType<typeof createServer> | null = null
const clients = new Map<string, Socket>()
const events = new Array<{ name: string; clientId: string; data: unknown }>()

Given('I have started the server', () => {
  server = createServer({
    http: {},
    socket: {},
  })
  return server.start()
})

Given('I have a client {string} connected to the server', (clientId: string) => {
  const client = io('ws://127.0.0.1:4002', {
    forceNew: true,
    transports: ['websocket'],
  })
  clients.set(clientId, client)
})

Given('{string} subscribes to {string} events', (clientId: string, eventName: string) => {
  const client = clients.get(clientId)
  client?.on(eventName, (data) => {
    events.push({ name: eventName, clientId, data })
  })
})

When('I create the following version', (dataTable: DataTable) => {
  const options = dataTable.rowsHash()
  return fetch('http://127.0.0.1:4001/versions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then((response) =>
    response.json().then((body) => {
      if (!response.ok) {
        const error = new Error()
        Object.assign(error, body)
        return Promise.reject(error)
      }
    }),
  )
})

Then('I receive the following {string} event for {string}', (eventName: string, clientId: string, dataTable: DataTable) => {
  const event = events.find((event) => event.clientId === clientId && event.name === eventName)

  return assert.deepEqual(event?.data, dataTable.rowsHash())
})

After(() =>
  Promise.resolve(server?.stop()).then(() => {
    server = null

    return Promise.all(Array.from(clients.values()).map((client) => client.close()))
  }),
)
