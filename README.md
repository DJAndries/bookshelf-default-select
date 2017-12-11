# bookshelf-default-select
[![npm version](https://badge.fury.io/js/bookshelf-default-select.svg)](https://badge.fury.io/js/bookshelf-default-select)
#### Enables default column selection for Bookshelf. Inspired by visibility, but operates on a database level.

Useful for large models that contain many non-essential columns.

## Install
```
npm install --save bookshelf-default-select
```

## Usage

Add the plugin to bookshelf:

```
const defaultSelect = require('bookshelf-default-select')
bookshelf.plugin(defaultSelect())
```

Add default columns to a model:
```
const Example = bookshelf.Model.extend({
  tableName: 'example',
  defaultColumns: ['id', 'name']
})
```

Fetch the model:
```
Example.where({id: 1}).fetch()
// {id: 1, name: 'Test 1'}
Example.fetchAll()
// [{id: 1, name: 'Test 1'}, {id: 2, name: 'Test 2'}]
```

## Configuration

By default, functionality will be applied to related models during a fetch.
To turn this off, simply add `{ relations: false }` to the plugin function.

```
bookshelf.plugin(defaultSelect({relations: false}))
```
