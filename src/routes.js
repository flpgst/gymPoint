import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import ProgramController from './app/controllers/ProgramController'
import EnrollmentController from './app/controllers/EnrollmentController'
import CheckinController from './app/controllers/CheckinController'
import HelpOrderController from './app/controllers/HelpOrderController'
import AuthMiddleware from './app/middlewares/auth'
import PermissionMiddleware from './app/middlewares/permission'

const routes = new Router()

routes.post('/sessions', SessionController.store)

routes.use(AuthMiddleware)
routes.use(PermissionMiddleware)

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.put('/users', UserController.update)

routes.post('/students', StudentController.store)
routes.put('/students/:id', StudentController.update)
routes.get('/students/:id/checkins', CheckinController.index)

routes.post('/programs', ProgramController.store)
routes.get('/programs', ProgramController.index)
routes.put('/programs/:id', ProgramController.update)
routes.delete('/programs/:id', ProgramController.delete)

routes.post('/enrollments', EnrollmentController.store)
routes.get('/enrollments', EnrollmentController.index)
routes.put('/enrollments/:id', EnrollmentController.update)
routes.delete('/enrollments/:id', EnrollmentController.delete)

routes.post('/checkins', CheckinController.store)

routes.post('/help-orders', HelpOrderController.store)
routes.put('/help-orders/:id', HelpOrderController.update)
routes.get('/help-orders', HelpOrderController.index)

export default routes
