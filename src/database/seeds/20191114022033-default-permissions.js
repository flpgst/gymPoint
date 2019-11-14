module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'permissions',
      [
        {
          name: 'admin',
          super_admin: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'professor',
          super_admin: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'student',
          super_admin: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('permissions', null, {})
  }
}
