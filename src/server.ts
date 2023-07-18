/* eslint-disable no-console */
import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config from './config'

process.on('uncaughtException', error => {
  console.log(error)
  process.exit(1)
})

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    console.info(`Database connection successful`)

    app.listen(config.port, () => {
      console.info(`Application listening on port ${config.port}`)
    })
  } catch (error) {
    console.error(`Database connection error: ${error}`)
  }
}

main()

process.on('SIGTERM', () => {
  console.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
