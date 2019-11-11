import Sequelize, { Model } from 'sequelize'

class Program extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(4, 2)
      },
      {
        sequelize
      }
    )
  }
}

export default Program
