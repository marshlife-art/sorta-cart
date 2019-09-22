import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import ImportDialog from './ImportDialog'
import { AppDatabase, IProduct } from '../appDatabase'

// import { useAllDocumentsService } from '../services/useDocServices'
// import { useProductDocService } from '../services/useDocServices'
// import { productMapFn } from '../util/utilz'
// import { ProductDoc } from '../types/Product'

function DataTable() {
  const db = new AppDatabase()

  const [importDialogOpen, setImportDialogOpen] = useState(false)

  //
  return (
    <>
      <MaterialTable
        columns={[
          { title: 'name', field: 'name', type: 'string' },
          { title: 'description', field: 'description', type: 'string' },
          {
            title: 'pk',
            field: 'pk',
            type: 'string',
            render: rowData => parseInt(rowData.pk)
          },
          { title: 'size', field: 'size', type: 'string' },
          { title: 'unit_type', field: 'unit_type', type: 'string' },
          { title: 'price', field: 'price', type: 'string' },
          { title: 'unit_price', field: 'unit_price', type: 'string' },
          { title: 'properties', field: 'properties', type: 'string' },
          { title: 'category', field: 'category', type: 'string' },
          { title: 'search', field: 'search', type: 'string' },
          { title: 'upc', field: 'upc', type: 'string' },
          { title: 'sku', field: 'sku', type: 'string' }
        ]}
        data={query => {
          console.log('QUERY:', query)

          return new Promise(async (resolve, reject) => {
            const regex: RegExp = new RegExp(query.search, 'i')

            let data: any = await db.products.orderBy(
              (query.orderBy && query.orderBy.field) || ''
            )
            if (query.search && query.search !== '') {
              data = await data.filter((r: IProduct) => regex.test(r.search))
            }

            if (query.orderDirection === 'desc') {
              console.log('GONNA .reverse()!')
              data = await data.reverse()
            }

            data = await data
              .offset(query.page)
              .limit(query.pageSize)
              .toArray()

            resolve({
              data: data as IProduct[],
              page: query.page,
              totalCount: await db.products
                .filter(r => regex.test(r.search))
                .count()
            })
          })
        }}
        title="sorta-cart"
        options={{
          headerStyle: { position: 'sticky', top: 0 },
          maxBodyHeight: 'calc(100vh - 121px)',
          pageSize: 10,
          pageSizeOptions: [10, 50, 100, 500]
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Data',
            isFreeAction: true,
            onClick: () => setImportDialogOpen(!importDialogOpen)
          }
        ]}
      />
      <ImportDialog open={importDialogOpen} setOpen={setImportDialogOpen} />
    </>
  )
}

export default DataTable
