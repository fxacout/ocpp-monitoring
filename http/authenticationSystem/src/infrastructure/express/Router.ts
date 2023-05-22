import {Router as ExpressRouter} from 'express'
import { singleton } from 'tsyringe';
import { UserVerifierController } from '../../controller/UserVerifierController';

@singleton()
export class Router {
  constructor(
    protected userVerifierController: UserVerifierController
  ) {}
  public get routes(): ExpressRouter {
    const router = ExpressRouter();
    router.get('/status',(req, res, next) => {
      res.json({
        message: 'ok'
      }).status(200)
    })

    router.post('/verificar', (req, res, next) => {console.log("AAAAAAAAAAAAAA");return this.userVerifierController.validateUser(req, res, next)})

    router.post('/create', (req, res, next) => this.userVerifierController.createUser(req, res, next))


    return router
  }
}