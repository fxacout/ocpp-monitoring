import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, {Express} from 'express'
import { singleton } from 'tsyringe'
import { DbConnection } from './DbConnection'
import { Router } from './express/Router'

@singleton()
export class Application {
  private server: Express
  constructor(
		private router: Router,
		private dbConnection: DbConnection
	) {
		this.dbConnection.connect().then(() => {
			console.log(`Database connected!`)
		})
    this.server = express()
  }

  listen() {
		this.server.use(bodyParser.json())
		this.server.use(cookieParser())
		this.server.use(this.router.routes)
		this.server.listen('3000')
		console.log('Server listening on port 3000!')
  }
}