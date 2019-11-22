import Sequelize from 'sequelize'

import Permission from '../app/models/Permission'
import User from '../app/models/User'
import Student from '../app/models/Student'
import Program from '../app/models/Program'
import Enrollment from '../app/models/Enrollment'

import databaseConfig from '../config/database'

const models = [Permission, User, Student, Program, Enrollment]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models.map(model => model.init(this.connection))
  }
}

export default new Database()
