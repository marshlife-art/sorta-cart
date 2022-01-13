import React, { useState, useEffect, useCallback } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MaterialTable, {
  Action,
  Query,
  MTableBodyRow,
  MTableFilterRow,
  MaterialTableProps,
  // MTableEditRow,
  MTableBody
} from 'material-table'
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
import { supabase } from '../lib/supabaseClient'
import {
  FixedSizeList as List,
  ListProps,
  ListChildComponentProps,
  areEqual
} from 'react-window'
import { getCategories, getSubCategories } from '../lib/productsService'

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
  if (!codes) {
    return ''
  }
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

// interface TableBodyProps extends MaterialTableProps<any>, ListProps {
//   tableHeight: number
//   headerHeight: number
//   tableWidth: number
//   scrollIndex: number
//   renderData: any
// }

// const Row = React.memo<ListChildComponentProps>(({ data, index, style }) => {

//   // Data passed to List as "itemData" is available as props.data
//   const { items, toggleItemActive } = data;
//   const item = items[index];

//   return (
//     <div
//       onClick={() => toggleItemActive(index)}
//       style={style}
//     >
//       {item.label} is {item.isActive ? 'active' : 'inactive'}
//     </div>
//   );
// }, areEqual);

// const TableBody = (props: TableBodyProps) => {
//   console.log('jebb TableBody props', props)
//   const Row = (listProps: ListChildComponentProps) => {
//     const { data, index, style } = listProps
//     console.log('jebb TableBody Row props', listProps)
//     // return (
//     //   <MTableBody
//     //     {...props}
//     //     components={{
//     //       Row: (rowProps: any) => (
//     //         // <div
//     //         //   key={index}
//     //         //   style={{ ...style, display: 'table', tableLayout: 'fixed' }}
//     //         // >
//     //         <MTableBodyRow {...rowProps} />
//     //         // </div>
//     //       )
//     //     }}
//     //   />
//     // )

//     return (
//       <div
//         key={index}
//         style={{ ...style, display: 'table', tableLayout: 'fixed' }}
//       >
//         {/* {props.components?.Row} */}

//         <MTableBodyRow
//           {...props}
//           data={{ ...props.renderData, tableData: { editCellList: undefined } }}
//         />
//         {/* <MTableBodyRow
//           // key={key}
//           index={index}
//           data={data[index]}
//           options={props.options}
//           // onToggleDetailPanel={props.onToggleDetailPanel}
//           icons={props.icons}
//           actions={props.actions}
//           components={props.components}
//           columns={props.columns}
//           // getFieldValue={props.getFieldValue}
//           onRowClick={props.onRowClick}
//         /> */}
//       </div>
//     )
//   }

//   //   <MTableBody
//   //   {...props}
//   //   components={{
//   //     ...props.components,
//   //     Row: MTableBodyRow
//   //   }}
//   // />

//   return (
//     <tbody>
//       {props.options?.filtering && <MTableFilterRow props={props} />}
//       <List
//         height={window.innerHeight - 300}
//         itemCount={props?.renderData?.length || 0}
//         itemData={props.renderData}
//         itemSize={50}
//         // itemSize={parseInt(`${props.height || 100}`)}
//         width={window.innerWidth}
//       >
//         {Row}
//       </List>
//     </tbody>
//   )
//   // return (
//   //   <tbody>
//   //     {props.options?.filtering && <MTableFilterRow props={props} />}

//   //   </tbody>
//   // )
// }

export default function DataTable() {
  const narrowWidth = useMediaQuery('(max-width:600px)')
  const itemCount = useCartItemCount()
  const navigate = useNavigate()
  // RouteComponentProps<{ cat?: string; subcat?: string; onhand?: string }>
  const match = useMatch('/products/:cat/:subcat')

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    React.useState<null | HTMLElement>(null)

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
    getCategories().then((result) => setCategoryLookup(result))
  })

  const [subCategoryLookup, setSubCategoryLookup] = useState<object>(() => {
    getSubCategories('').then((result) => setSubCategoryLookup(result))
  })

  const [catDefaultFilter, setCatDefaultFilter] = useState<
    '' | string[] | undefined
  >(() => match?.params?.cat && [decodeURIComponent(match.params.cat)])
  const [subCatDefaultFilter, setSubCatDefaultFilter] = useState<
    '' | string[] | undefined
  >(() => match?.params?.subcat && [decodeURIComponent(match.params.subcat)])

  const [onHandDefaultFilter] = useState<string | undefined>(
    () => undefined
    // !!(
    //   match?.params?.onhand &&
    //   decodeURIComponent(match.params.onhand)
    // )
    //   ? 'checked'
    //   : undefined
  )

  async function setSelectedCatsFromQuery(query: Query<any>) {
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

      let newSubCatz = {}

      for await (const cat of categories) {
        const result = await getSubCategories(cat)
        newSubCatz = {
          ...newSubCatz,
          ...result
        }
      }

      setCatDefaultFilter(categories)
      setSubCategoryLookup(newSubCatz)
      setSubCatDefaultFilter(subCatz)
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
            filtering: false,
            // filterPlaceholder: 'filter',
            // filterCellStyle: {
            //   paddingTop: '32px'
            // },
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
        // components={{
        //   Body: (props) => (
        //     <TableBody
        //       {...props}
        //       headerHeight={50}
        //       tableWidth={props.scrollWidth}
        //       tableHeight={100}
        //       scrollIndex={0}
        //     />
        //   )
        // }}
        data={(q) =>
          new Promise(async (resolve, reject) => {
            setSelectedCatsFromQuery(q)

            let query = supabase
              .from('products')
              .select('*', { count: 'exact' })

            if (q.filters.length) {
              q.filters.forEach((filter) => {
                // console.log('zomg filter:', filter)
                if (filter.column.field === 'count_on_hand') {
                  const or = `count_on_hand.${
                    filter.value === 'checked'
                      ? 'gt.0'
                      : 'is.null,count_on_hand.lte.0'
                  }`
                  query = query.or(or)
                } else if (filter.column.field && filter.value) {
                  if (filter.value instanceof Array && filter.value.length) {
                    const or = filter.value
                      .map((v) => `${String(filter.column.field)}.eq."${v}"`)
                      .join(',')
                    query = query.or(or)
                  } else if (filter.value.length) {
                    query = query.or(
                      `${String(filter.column.field)}.eq."${filter.value}"`
                    )
                  }
                }
              })
            }
            if (q.search) {
              // #todo consider q.search.split(' ')
              query = query.or(
                ['name', 'description']
                  .map((f) => `${f}.ilike."%${q.search}%"`)
                  .join(',')
              )
            }
            if (q.page) {
              query = query.range(
                q.pageSize * q.page,
                q.pageSize * q.page + q.pageSize
              )
            }
            if (q.pageSize) {
              query = query.limit(q.pageSize)
            }
            if (q.orderBy && q.orderBy.field) {
              query = query.order(q.orderBy.field, {
                ascending: q.orderDirection === 'asc'
              })
            }

            const { data, error, count } = await query

            // console.log('orders count:', count, ' q:', q, 'data:', data)
            if (!data || error) {
              resolve({ data: [], page: 0, totalCount: 0 })
            } else {
              resolve({ data, page: q.page, totalCount: count || 0 })
            }
          })
        }
        title={
          <Button variant="text" size="large" onClick={() => navigate('/')}>
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
