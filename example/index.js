const db = require('./db')
const shelves = require('./shelves')

const go = async () => {
  await db.init()

  const aModel = await shelves.TableA.where({id: 1}).fetch()
  console.log(aModel.toJSON())

  let aModels = await shelves.TableA.where({id: 1}).fetchAll()
  console.log(aModels.toJSON())

  aModels = await shelves.TableA.where({id: 1}).fetchAll({columns: ['id', 'test2']})
  console.log(aModels.toJSON())

  aModels = await shelves.TableA.where({id: 1}).fetch({withRelated: 'tableBs.tableCs'})
  console.log(JSON.stringify(aModels.toJSON()))

  console.log((await shelves.TableA.fetchAll()).toJSON())
}

go().then(() => {
  process.exit()
}, (err) => {
  console.error(err)
  process.exit(-1)
})
