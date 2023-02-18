import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { container } from 'tsyringe'
import { Application } from './infrastructure/Application'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}


const app = container.resolve(Application)

app.listen()