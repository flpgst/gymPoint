import Sequelize, { Model } from 'sequelize'

class Permission extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        super_admin: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    )

    return this
  }
}

export default Permission
