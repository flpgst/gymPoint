import Sequelize from 'sequelize'
import Mongoose from 'mongoose'

import Permission from '../app/models/Permission'
import User from '../app/models/User'
import Student from '../app/models/Student'
import Program from '../app/models/Program'
import Enrollment from '../app/models/Enrollment'
import Checkin from '../app/models/Checkin'

import databaseConfig from '../config/database'

const models = [Permission, User, Student, Program, Enrollment, Checkin]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models.map(model => model.init(this.connection))
    models.map(
      model => model.associate && model.associate(this.connection.models)
    )
  }

  mongo() {
    this.mongoConnection = Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    })
  }
}

export default new Database()
