module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'programs',
      [
        {
          title: 'bluebelt',
          duration: 3,
          price: '269.90',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: 'purplebelt',
          duration: 6,
          price: '529.90',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: 'blackbelt',
          duration: 12,
          price: '1090.90',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('programs', null, {})
  }
}
