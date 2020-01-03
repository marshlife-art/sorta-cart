import React, { useState, useEffect, createRef } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import MaterialTable, { Action } from 'material-table'
import { Chip } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import TagFacesIcon from '@material-ui/icons/TagFaces'

import UserMenu from './UserMenu'
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

function DataTable(
  props: RouteComponentProps<{ cat?: string; subcat?: string }>
) {
  let tableRef = createRef<any>()

  // useEffect(() => {
  //   // tableRef.current && tableRef.current.onQueryChange()
  //   // console.log('tableRef.current', tableRef && tableRef.current)
  // }, [tableRef])
  const itemCount = useCartItemCount()

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [
    userMenuAnchorEl,
    setUserMenuAnchorEl
  ] = React.useState<null | HTMLElement>(null)

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
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

  const userAction = {
    icon: () => <TagFacesIcon />,
    tooltip: 'User',
    isFreeAction: true,
    onClick: handleUserMenuClick
  }

  const [actions, setActions] = useState<Action<any>[]>([userAction])

  useEffect(() => {
    if (itemCount) {
      setActions([cartAction, userAction])
    } else {
      setActions([userAction])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]) // note: adding 'cartAction' and 'userAction' to dep array is not pleasant :/

  const [categoryLookup, setCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/categories`)
      .then(response => response.json())
      .then(result => setCategoryLookup(result))
      .catch(console.warn)
  })

  const [subCategoryLookup, setSubCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/sub_categories`)
      .then(response => response.json())
      .then(result => setSubCategoryLookup(result))
      .catch(console.warn)
  })

  const catDefaultFilter = props.match &&
    props.match.params &&
    props.match.params.cat && [props.match.params.cat]
  const subCatDefaultFilter = props.match &&
    props.match.params &&
    props.match.params.subcat && [props.match.params.subcat]

  return (
    <>
      <MaterialTable
        tableRef={tableRef}
        columns={[
          {
            title: 'category',
            field: 'category',
            type: 'string',
            lookup: categoryLookup,
            filterPlaceholder: 'filter',
            defaultFilter: catDefaultFilter
          },
          {
            title: 'sub category',
            field: 'sub_category',
            type: 'string',
            lookup: subCategoryLookup,
            editComponent: arg => {
              console.log('editComponent arg:', arg)
              return <>subcat</>
            },
            filterPlaceholder: 'filter',
            defaultFilter: subCatDefaultFilter
          },
          {
            title: 'description',
            field: 'description',
            type: 'string',
            filtering: false,
            render: row => {
              if (row.name) {
                return `${row.name} -- ${row.description}`
              } else {
                return row.description
              }
            }
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
            filtering: false,
            render: row =>
              row.ws_price !== row.u_price ? `$${row.u_price}` : ''
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
                  <IconButton color="secondary" onClick={() => addToCart(row)}>
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
              .catch(err => {
                console.warn('onoz, caught err:', err)
                return resolve({ data: [], page: 0, totalCount: 0 })
              })
          })
        }
        title="MARSH COOP"
        options={{
          headerStyle: { position: 'sticky', top: 0 },
          filterCellStyle: { maxWidth: '132px' },
          maxBodyHeight: 'calc(100vh - 133px)',
          pageSize: 50,
          pageSizeOptions: [50, 100, 500],
          debounceInterval: 750,
          filtering: true,
          search: true,
          emptyRowsWhenPaging: false
        }}
        actions={actions}
      />
      <CartDrawer open={cartDrawerOpen} setOpen={setCartDrawerOpen} />
      <UserMenu anchorEl={userMenuAnchorEl} setAnchorEl={setUserMenuAnchorEl} />
    </>
  )
}

export default withRouter(DataTable)
