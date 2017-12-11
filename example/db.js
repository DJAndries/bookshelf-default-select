const bookshelfDefaultSelectPlugin = require('../src')

const knex = require('knex')({
  client: "sqlite3",
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true,
})

const bookshelf = require('bookshelf')(knex);

bookshelf.plugin(bookshelfDefaultSelectPlugin())

const init = async () => {
  await knex.schema.createTable('table_a', (table) => {
    table.increments()
    table.string('test1')
    table.string('test2')
  })
  await knex.schema.createTable('table_b', (table) => {
    table.increments()
    table.integer('table_a_id')
    table.string('test1')
    table.string('test2')
  })
  await knex.schema.createTable('table_c', (table) => {
    table.increments()
    table.integer('table_b_id')
    table.string('test3')
    table.string('test4')
  })
  await knex('table_a').insert({test1: 'abc', test2: '123'})
  await knex('table_b').insert({table_a_id: 1, test1: '111', test2: '222'})
  await knex('table_c').insert({table_b_id: 1, test3: '333', test4: '444'})
}

module.exports = {
  init,
  bookshelf
}
