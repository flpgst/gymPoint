module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'permission_id', {
      type: Sequelize.INTEGER,
      references: { model: 'permissions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'permission_id')
  }
}
