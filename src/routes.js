import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import ProgramController from './app/controllers/ProgramController'
import AuthMiddleware from './app/middlewares/auth'

const routes = new Router()

routes.post('/sessions', SessionController.store)

routes.use(AuthMiddleware)

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.put('/users', UserController.update)

routes.post('/students', StudentController.store)
routes.put('/students/:id', StudentController.update)

routes.post('/programs', ProgramController.store)
// routes.get('/programs', ProgramController.index)
// routes.put('/programs/:id', ProgramController.update)

export default routes
