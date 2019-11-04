import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import ImportDialog from './ImportDialog'
import { AppDatabase, IProduct } from '../appDatabase'

// import { useAllDocumentsService } from '../services/useDocServices'
// import { useProductDocService } from '../services/useDocServices'
// import { productMapFn } from '../util/utilz'
// import { ProductDoc } from '../types/Product'

function DataTable() {
  // const db = new AppDatabase()

  const [importDialogOpen, setImportDialogOpen] = useState(false)

  /* 
  "id": 1,
    "unf": "012850-4",
    "upc_code": "0-75062-50214-4",
    "category": "Bulk Foods",
    "sub_category": "BULK SNACKS-TRAILMIXES-CEREALS",
    "name": null,
    "description": "Mix; Honeynut & Seed Crunch",
    "pk": 10,
    "size": "#",
    "unit_type": "CS",
    "ws_price": "33.64",
    "u_price": "3.36",
    "codes": "f, n",
    "createdAt": "2019-11-01T21:11:57.343Z",
    "updatedAt": "2019-11-01T21:11:57.343Z"
    */
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
          { title: 'codes', field: 'codes', type: 'string' },
          {
            title: 'category',
            field: 'category',
            type: 'string',
            defaultGroupOrder: 0
          },
          {
            title: 'sub category',
            field: 'sub_category',
            type: 'string',
            defaultGroupOrder: 1
          },
          { title: 'upc', field: 'upc_code', type: 'string' },
          { title: 'unf', field: 'unf', type: 'string' }
        ]}
        // data={query => {
        //   console.log('QUERY:', query)

        //   return new Promise(async (resolve, reject) => {
        //     const regex: RegExp = new RegExp(query.search, 'i')

        //     let data: any = await db.products.orderBy(
        //       (query.orderBy && query.orderBy.field) || ''
        //     )
        //     if (query.search && query.search !== '') {
        //       data = await data.filter((r: IProduct) => regex.test(r.search))
        //     }

        //     if (query.orderDirection === 'desc') {
        //       console.log('GONNA .reverse()!')
        //       data = await data.reverse()
        //     }

        //     data = await data
        //       .offset(query.page)
        //       .limit(query.pageSize)
        //       .toArray()

        //     resolve({
        //       data: data as IProduct[],
        //       page: query.page,
        //       totalCount: await db.products
        //         .filter(r => regex.test(r.search))
        //         .count()
        //     })
        //   })
        // }}
        data={query =>
          new Promise((resolve, reject) => {
            console.log('query:', query)
            let url = 'http://localhost:3000/products'
            url += '?limit=' + query.pageSize
            url += '&page=' + query.page
            // #TODO: use query params lib
            if (query.orderBy && query.orderBy.field) {
              url += '&orderBy=' + query.orderBy.field
            }
            if (query.orderDirection) {
              url += '&orderDirection=' + query.orderDirection
            }
            if (query.search) {
              url += '&q=' + query.search
            }

            fetch(url)
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
          grouping: true
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
