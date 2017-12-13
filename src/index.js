const getRelationDefaultColumns = (instance, relation) => {
  let relationSplit = relation.split('.')
  let currentModel = instance
  let qualifiedSubfield = ''
  const result = []
  for (const subfield of relationSplit) {
    if (!currentModel[subfield]) {
      return false
    }
    if (qualifiedSubfield.length > 0) {
      qualifiedSubfield += '.'
    }
    qualifiedSubfield += subfield
    const target = currentModel[subfield]().model
    if (!target) {
      continue
    }
    currentModel = target.forge()
    result.push([qualifiedSubfield, currentModel.defaultColumns])
  }
  return result
}

const convertWithRelatedToObject = (options) => {
  if (typeof options.withRelated === 'string') {
    options.withRelated = [options.withRelated]
  }

  if (Array.isArray(options.withRelated)) {
    const newWithRelated = {}
    for (const relation of options.withRelated) {
      newWithRelated[relation] = (qb) => qb
    }
    options.withRelated = newWithRelated
  }
}

const processRelations = (instance, options) => {
  convertWithRelatedToObject(options)

  for (const relation of Object.keys(options.withRelated)) {

    const relationDefaultColumns = getRelationDefaultColumns(instance, relation)

    for (const subfieldDefaultColumns of relationDefaultColumns) {
      if (subfieldDefaultColumns[0] !== relation && options.withRelated[subfieldDefaultColumns[0]]) {
        continue
      }
      const existingQueryFunction = options.withRelated[subfieldDefaultColumns[0]]
      options.withRelated[subfieldDefaultColumns[0]] =
        (qb) => {
          qb = qb.column(subfieldDefaultColumns[1])
          if (existingQueryFunction) {
            qb = existingQueryFunction(qb)
          }
          return qb
        }
    }
  }
}

const addOptions = (instance, options, config) => {
  if (instance.defaultColumns) {
    if (!options.columns) {
      options.columns = instance.defaultColumns
    }
  }
  if (config.relations && options.withRelated) {
    processRelations(instance, options, config)
  }
}

const extend = (bookshelf, config) => {
  const proto = bookshelf.Model.prototype
  bookshelf.Model = bookshelf.Model.extend({
    fetch: function(options = {}) {
      addOptions(this, options, config)
      return proto.fetch.call(this, options)
    },
    fetchAll: function(options = {}) {
      addOptions(this, options, config)
      return proto.fetchAll.call(this, options)
    },
  })
}

const plugin = (config) => (bookshelf) => {
  config = Object.assign({relations: true}, config)
  extend(bookshelf, config)
}

module.exports = plugin
