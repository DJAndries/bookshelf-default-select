const db = require('./db')

const TableC = db.bookshelf.Model.extend({
  tableName: 'table_c',
  defaultColumns: ['id', 'test3', 'table_b_id']
})

const TableB = db.bookshelf.Model.extend({
  tableName: 'table_b',
  defaultColumns: ['id', 'test2', 'table_a_id'],
  tableCs: function() {
    return this.hasMany(TableC)
  }
})

const TableA = db.bookshelf.Model.extend({
  tableName: 'table_a',
  defaultColumns: ['id', 'test1'],
  tableBs: function() {
    return this.hasMany(TableB)
  }
})

module.exports = {
  TableA,
  TableB,
  TableC
}
