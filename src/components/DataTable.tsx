import React, { useState, useEffect } from 'react'
import MaterialTable, { Action } from 'material-table'
import { Chip } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import CartDrawer from './CartDrawer'
import { useCartItemCount, addToCart } from '../services/useCartService'
import { API_HOST } from '../util/utilz'

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
  w: 'Wheat free',
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
    .map((code, idx) =>
      PROPERTY_MAP[code] ? (
        <Chip
          label={PROPERTY_MAP[code]}
          style={{ margin: 5 }}
          size="small"
          key={`pprop${idx}`}
        />
      ) : (
        ''
      )
    )
}

function DataTable() {
  const itemCount = useCartItemCount()

  const [searchExpanded, setSearchExpanded] = useState(false)

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  const searchAction = {
    icon: searchExpanded ? 'zoom_out' : 'search',
    tooltip: searchExpanded ? 'Close Search' : 'Search',
    isFreeAction: true,
    onClick: () => setSearchExpanded(!searchExpanded)
  }

  const cartAction = {
    icon: () => (
      <Badge badgeContent={itemCount} max={99} color="primary">
        <ShoppingCartIcon />
      </Badge>
    ),
    tooltip: 'Cart',
    isFreeAction: true,
    onClick: () => setCartDrawerOpen(!cartDrawerOpen)
  }
  const [actions, setActions] = useState<Action<any>[]>([searchAction])

  useEffect(() => {
    if (itemCount) {
      setActions([searchAction, cartAction])
    } else {
      setActions([searchAction])
    }
  }, [searchExpanded, itemCount]) // note: adding 'cartAction' and 'searchAction' to dep array is not pleasant :/

  const [categoryLookup, setCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/categories`)
      .then(response => response.json())
      .then(result => setCategoryLookup(result))
  })

  const [subCategoryLookup, setSubCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/sub_categories`)
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
          },
          {
            title: undefined,
            field: undefined,
            type: 'string',
            render: row => {
              const inCart = true
              const label = inCart
                ? 'add to shopping cart'
                : 'remove from shopping cart'
              return (
                <Tooltip aria-label={label} title={label}>
                  <IconButton color="primary" onClick={() => addToCart(row)}>
                    {inCart ? (
                      <AddShoppingCartIcon />
                    ) : (
                      <RemoveShoppingCartIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )
            }
          },
          { title: 'upc', field: 'upc_code', type: 'string', hidden: true },
          // { title: 'unf', field: 'unf', type: 'string' },
          { title: 'id', field: 'id', type: 'string', hidden: true }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            console.log('query:', query)
            fetch(`${API_HOST}/products`, {
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
      <CartDrawer open={cartDrawerOpen} setOpen={setCartDrawerOpen} />
    </>
  )
}

export default DataTable
