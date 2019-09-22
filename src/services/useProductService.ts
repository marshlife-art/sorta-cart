import { useEffect, useState } from 'react'
import { AppDatabase, IProduct } from '../appDatabase'

// demo
const db = new AppDatabase()
const demoProduct: IProduct = {
  name: 'foobar',
  description: 'beep',
  pk: 6,
  size: '2#',
  unit_type: 'CS',
  price: '$6.66',
  unit_price: '$1.11',
  properties: 'vwykftog',
  category: 'demo',
  search: 'foobar beep demo',
  upc: '1234567890',
  sku: 'ssssskYOU'
}

db.products
  .add(demoProduct)
  .then(() => {
    return db.products
      .where('name')
      .startsWith('foo')
      .toArray()
  })
  .then(fooz => {
    alert('foo productz: ' + JSON.stringify(fooz))
  })
  .catch(e => {
    alert('error: ' + e.stack || e)
  })
