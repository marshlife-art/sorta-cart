import React, { useState } from 'react'
import MaterialTable from 'material-table'
import ImportDialog from './ImportDialog'

const PROPERTY_MAP: { [index: string]: string } = {
  a: 'Artificial ingredients',
  c: 'Low carb',
  d: 'Dairy free',
  f: 'Food Service items',
  g: 'Gluten free',
  k: 'Kosher',
  l: 'Low sodium/no salt',
  m: 'Non-GMO Project Verified ',
  og: 'Organic',
  r: 'Refined sugar',
  v: 'Vegan',
  w: 'Yeast free',
  ft: 'Fair Trade',
  n: 'Natural',
  s: 'Specialty Only',
  y: 'Yeast free',
  1: '100% organic',
  2: '95%+ organic',
  3: '70%+ organic'
}

function renderCodes(codes: string) {
  return codes
    .split(', ')
    .map(code => (PROPERTY_MAP[code] ? PROPERTY_MAP[code] : ''))
    .join(', ')
}

function DataTable() {
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  return (
    <>
      <MaterialTable
        columns={[
          { title: 'name', field: 'name', type: 'string' },
          { title: 'description', field: 'description', type: 'string' },
          {
            title: 'pk',
            field: 'pk',
            type: 'numeric'
          },
          { title: 'size', field: 'size', type: 'string' },
          { title: 'unit_type', field: 'unit_type', type: 'string' },
          { title: 'price', field: 'ws_price', type: 'currency' },
          { title: 'unit_price', field: 'u_price', type: 'currency' },
          {
            title: 'codes',
            field: 'codes',
            type: 'string',
            lookup: PROPERTY_MAP,
            render: row => renderCodes(row.codes)
          },
          {
            title: 'category',
            field: 'category',
            type: 'string'
          },
          {
            title: 'sub category',
            field: 'sub_category',
            type: 'string'
          }
          // { title: 'upc', field: 'upc_code', type: 'string' },
          // { title: 'unf', field: 'unf', type: 'string' }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            console.log('query:', query)
            // let url = 'http://localhost:3000/products'
            // url += '?limit=' + query.pageSize
            // url += '&page=' + query.page
            // // #TODO: use query params lib
            // if (query.orderBy && query.orderBy.field) {
            //   url += '&orderBy=' + query.orderBy.field
            // }
            // if (query.orderDirection) {
            //   url += '&orderDirection=' + query.orderDirection
            // }
            // if (query.search) {
            //   url += '&q=' + query.search
            // }

            fetch('http://localhost:3000/products', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(query)
            })
              .then(response => response.json())
              .then(result => {
                console.log('result', result)
                resolve(result)
              })
          })
        }
        title="sorta-cart"
        options={{
          headerStyle: { position: 'sticky', top: 0 },
          maxBodyHeight: 'calc(100vh - 121px)',
          pageSize: 50,
          pageSizeOptions: [50, 100, 500],
          debounceInterval: 750,
          filtering: true
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Data',
            isFreeAction: true,
            onClick: () => setImportDialogOpen(!importDialogOpen)
          }
          // {
          //   icon: 'cart',
          //   tooltip: 'Cart',
          //   isFreeAction: true,
          //   onClick: () => console.log('#TODO cart!')
          // }
        ]}
      />
      <ImportDialog open={importDialogOpen} setOpen={setImportDialogOpen} />
    </>
  )
}

export default DataTable
