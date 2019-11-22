import Sequelize, { Model } from 'sequelize'

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL,
        student_id: Sequelize.NUMBER,
        program_id: Sequelize.NUMBER
      },
      {
        sequelize
      }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' })
    this.belongsTo(models.Program, { foreignKey: 'program_id', as: 'program' })
  }
}

export default Enrollment
