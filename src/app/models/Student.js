import Sequelize, { Model } from 'sequelize'

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birthday: Sequelize.DATE,
        age: Sequelize.VIRTUAL,
        weight: Sequelize.FLOAT,
        height: Sequelize.FLOAT
      },
      {
        sequelize
      }
    )

    this.addHook('afterSave', async student => {
      if (student.birthday)
        student.age = Math.floor(
          (new Date() - new Date(student.birthday).getTime()) / 3.15576e10
        )
    })

    return this
  }
}

export default Students
