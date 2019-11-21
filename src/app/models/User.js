import Sequelize, { Model } from 'sequelize'
import Bcrypt from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        permission_id: Sequelize.NUMBER
      },
      {
        sequelize
      }
    )

    this.addHook('beforeSave', async user => {
      if (user.password)
        user.password_hash = await Bcrypt.hash(user.password, 8)
    })

    return this
  }

  static associate(models) {
    this.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
      as: 'permission'
    })
  }

  checkPassword(password) {
    return Bcrypt.compare(password, this.password_hash)
  }
}

export default User
