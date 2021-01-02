import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MaterialTable, { Action, Query } from 'material-table'
import Chip from '@material-ui/core/Chip'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import BackIcon from '@material-ui/icons/ArrowBack'

import UserMenu from './UserMenu'
import CartDrawer from './CartDrawer'
import { useCartItemCount, addToCart } from '../services/useCartService'
import { API_HOST } from '../constants'

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
  props: RouteComponentProps<{ cat?: string; subcat?: string; onhand?: string }>
) {
  const narrowWidth = useMediaQuery('(max-width:600px)')
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

  const resetAction = {
    icon: () => <DeleteSweepIcon />,
    tooltip: 'Reset Filters',
    isFreeAction: true,
    onClick: () => {
      window.location.href = '/products'
    }
  }

  const [actions, setActions] = useState<Action<any>[]>([userAction])

  useEffect(() => {
    if (itemCount) {
      setActions([resetAction, cartAction, userAction])
    } else {
      setActions([resetAction, userAction])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount, cartDrawerOpen]) // note: adding 'cartAction' and 'userAction' to dep array is not pleasant :/

  const [categoryLookup, setCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/categories`)
      .then((response) => response.json())
      .then((result) => setCategoryLookup(result))
      .catch(console.warn)
  })

  const [subCategoryLookup, setSubCategoryLookup] = useState<object>(() => {
    fetch(`${API_HOST}/sub_categories`)
      .then((response) => response.json())
      .then((result) => setSubCategoryLookup(result))
      .catch(console.warn)
  })

  const [catDefaultFilter, setCatDefaultFilter] = useState<
    '' | string[] | undefined
  >(
    () =>
      props.match &&
      props.match.params &&
      props.match.params.cat && [decodeURIComponent(props.match.params.cat)]
  )
  const [subCatDefaultFilter, setSubCatDefaultFilter] = useState<
    '' | string[] | undefined
  >(
    () =>
      props.match &&
      props.match.params &&
      props.match.params.subcat && [
        decodeURIComponent(props.match.params.subcat)
      ]
  )

  const [onHandDefaultFilter] = useState<string | undefined>(() =>
    !!(
      props.match &&
      props.match.params &&
      props.match.params.onhand &&
      decodeURIComponent(props.match.params.onhand)
    )
      ? 'checked'
      : undefined
  )

  function setSelectedCatsFromQuery(query: Query<any>) {
    try {
      const categories = query.filters
        .filter((f) => f.column.field === 'category')
        .reduce(
          (terms: string[], t: { value: string[] }) => [...terms, ...t.value],
          []
        )
      const subCatz = query.filters
        .filter((f) => f.column.field === 'sub_category')
        .reduce(
          (terms: string[], t: { value: string[] }) => [...terms, ...t.value],
          []
        )
      if (categories.length === 0) {
        return
      }

      fetch(`${API_HOST}/sub_categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categories })
      })
        .then((response) => response.json())
        .then((result) => {
          setCatDefaultFilter(categories)
          setSubCategoryLookup(result)
          setSubCatDefaultFilter(subCatz)
        })
        .catch((err) => {
          console.warn('onoz, caught err:', err)
          // setSubCategories([])
        })
    } catch (e) {
      console.warn('onoz caught err:', e)
    }
  }

  return (
    <>
      <MaterialTable
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
            filterPlaceholder: 'filter',
            defaultFilter: subCatDefaultFilter
          },
          {
            title: 'description',
            field: 'description',
            type: 'string',
            filterPlaceholder: 'filter',
            filterCellStyle: {
              paddingTop: '32px'
            },
            render: (row) => {
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
            render: (row) =>
              row.ws_price !== row.u_price ? `$${row.u_price}` : ''
          },
          {
            title: 'properties',
            field: 'codes',
            type: 'string',
            lookup: PROPERTY_MAP,
            filterPlaceholder: 'filter',
            render: (row) => renderCodes(row.codes)
          },
          {
            title: 'on hand',
            field: 'count_on_hand',
            type: 'boolean',
            filterCellStyle: {
              paddingTop: '32px'
            },
            // tableData: { checked: true },
            // lookup: { true: 'TRUE', false: 'FALSE' },
            defaultFilter: onHandDefaultFilter,
            render: (row) => row.count_on_hand
          },
          {
            title: undefined,
            field: undefined,
            type: 'string',
            render: (row) => {
              const inCart = true
              const label = inCart
                ? 'add to shopping cart'
                : 'remove from shopping cart'
              return (
                <Tooltip aria-label={label} title={label}>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      addToCart(row)
                      setCartDrawerOpen(true)
                    }}
                  >
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
        data={(query) =>
          new Promise((resolve, reject) => {
            setSelectedCatsFromQuery(query)
            fetch(`${API_HOST}/products`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(query)
            })
              .then((response) => response.json())
              .then((result) => {
                resolve(result)
              })
              .catch((err) => {
                console.warn('onoz, caught err:', err)
                return resolve({ data: [], page: 0, totalCount: 0 })
              })
          })
        }
        title={
          <Button
            variant="text"
            size="large"
            onClick={() => props.history.push('/')}
          >
            {narrowWidth ? (
              <BackIcon />
            ) : (
              <Typography variant="h6">MARSH COOP</Typography>
            )}
          </Button>
        }
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
