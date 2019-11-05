import React, { useState, useEffect } from 'react'
import MaterialTable, { MTableFilterRow } from 'material-table'
import ImportDialog from './ImportDialog'
import { Chip } from '@material-ui/core'

const PROPERTY_MAP: { [index: string]: string } = {
  a: 'Artificial ingredients',
  c: 'Low carb',
  d: 'Dairy free',
  f: 'Food Service items',
  g: 'Gluten free',
  k: 'Kosher',
  l: 'Low sodium/no salt',
  m: 'Non-GMO Project Verified',
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
    .map(code =>
      PROPERTY_MAP[code] ? (
        <Chip label={PROPERTY_MAP[code]} style={{ margin: 5 }} size="small" />
      ) : (
        ''
      )
    )
}

function DataTable() {
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const searchAction = {
    icon: searchExpanded ? 'zoom_out' : 'search',
    tooltip: searchExpanded ? 'Close Search' : 'Search',
    isFreeAction: true,
    onClick: () => setSearchExpanded(!searchExpanded)
  }

  const addAction = {
    icon: 'add',
    tooltip: 'Add Data',
    isFreeAction: true,
    onClick: () => setImportDialogOpen(!importDialogOpen)
  }

  const [actions, setActions] = useState([searchAction, addAction])

  useEffect(() => {
    setActions([searchAction, addAction])
  }, [searchExpanded])

  const [categoryLookup, setCategoryLookup] = useState<object>(() => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(result => setCategoryLookup(result))
  })

  const [subCategoryLookup, setSubCategoryLookup] = useState<object>(() => {
    fetch('http://localhost:3000/sub_categories')
      .then(response => response.json())
      .then(result => setSubCategoryLookup(result))
  })

  return (
    <>
      <MaterialTable
        columns={[
          {
            title: 'category',
            field: 'category',
            type: 'string',
            lookup: categoryLookup,
            filterPlaceholder: 'filter'
          },
          {
            title: 'sub category',
            field: 'sub_category',
            type: 'string',
            lookup: subCategoryLookup,
            filterPlaceholder: 'filter'
          },
          { title: 'name', field: 'name', type: 'string', filtering: false },
          {
            title: 'description',
            field: 'description',
            type: 'string',
            filtering: false
          },
          {
            title: 'pk',
            field: 'pk',
            type: 'numeric',
            filtering: false
          },
          { title: 'size', field: 'size', type: 'string', filtering: false },
          {
            title: 'unit type',
            field: 'unit_type',
            type: 'string',
            lookup: { CS: 'Case', EA: 'Each' },
            filterPlaceholder: 'filter'
          },
          {
            title: 'price',
            field: 'ws_price',
            type: 'currency',
            filtering: false
          },
          {
            title: 'unit price',
            field: 'u_price',
            type: 'currency',
            filtering: false
          },
          {
            title: 'properties',
            field: 'codes',
            type: 'string',
            lookup: PROPERTY_MAP,
            filterPlaceholder: 'filter',
            render: row => renderCodes(row.codes)
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
          filtering: true,
          search: searchExpanded
        }}
        actions={actions}
      />
      <ImportDialog open={importDialogOpen} setOpen={setImportDialogOpen} />
    </>
  )
}

export default DataTable
