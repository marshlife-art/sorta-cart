import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core'

import { SupaProduct } from '../../../types/SupaTypes'
import LineItemAutocomplete from '../orders/LineItemAutocomplete'
import WholesaleOrdersSelect from './WholesaleOrdersSelect'
import { upsertSquareImport } from '../../../services/mutations'
import { Json } from '../../../types/supabase'
import { supabase } from '../../../lib/supabaseClient'
// import { useSquareImports } from '../../../services/hooks/squareimport'

export interface SquareImportItem {
  name: string
  product: SupaProduct
  qty: number
  imported?: boolean
  error?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      maxWidth: '100vw',
      minHeight: '100vh'
    },
    actions: {
      display: 'flex',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      justifyContent: 'space-between'
    },
    items: {
      marginTop: theme.spacing(4)
    },
    importAction: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
    }
  })
)

function ItemsTable(props: {
  items: SquareImportItem[]
  setItems: React.Dispatch<React.SetStateAction<SquareImportItem[]>>
}) {
  const { items, setItems } = props
  if (!items || !items.length) return null

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>product</TableCell>
            <TableCell>qty</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={`item${idx}`}>
              <TableCell>
                <IconButton
                  aria-label="close"
                  onClick={() =>
                    setItems((prev) => prev.filter((_, i) => i !== idx))
                  }
                  title="remove product"
                >
                  <Icon>clear</Icon>
                </IconButton>
              </TableCell>
              <TableCell>{`${item.product.name} ${item.product.description}`}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  value={item.qty}
                  onChange={(e) => {
                    setItems((prev) =>
                      prev.map((i, index) => {
                        if (index === idx) {
                          return { ...item, qty: Number(e.target.value) }
                        }
                        return i
                      })
                    )
                  }}
                />
              </TableCell>
              <TableCell>{item.error}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default function SquareImport() {
  const classes = useStyles()

  // const { squareImports, isError, isLoading, mutate } = useSquareImports()
  const [id, setId] = useState<string>()
  const [items, setItems] = useState<SquareImportItem[]>([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   if (squareImports?.data?.items?.length) {
  //     console.log(
  //       'fx have squareImport?.data?.items:',
  //       squareImports?.data?.items
  //     )
  //     setItems(squareImports?.data?.items)
  //   }
  // }, [squareImports])

  function onAddLineitem(value: { name: string; product: SupaProduct }) {
    if (!value) {
      return
    }
    const { product, name } = value
    if (name && product) {
      setItems((prev) => [...prev, { name, product, qty: 1 }])
    }
  }

  function onAddWholesaleOrderItems(items: SquareImportItem[]) {
    if (!items) {
      return
    }

    setItems((prev) => [...prev, ...items])
  }

  async function onSaveSquareImport() {
    const { data, error } = await upsertSquareImport({
      id,
      data: { items } as unknown as Json // #TODO: ugh tsc :/
    })
    if (data?.id) {
      setId(data.id)
    }
  }

  async function onImportToSquare() {
    setLoading(true)
    onSaveSquareImport()

    // fetch('http://localhost:54321/functions/v1/square-import', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization:
    //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    //   },
    //   body: JSON.stringify({ id })
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log('response:', response)
    //   })
    //   .catch((e) => {
    //     console.warn('onoz! caught error calling square-import:', e)
    //   })

    try {
      const { data, error } = await supabase.functions.invoke('square-import', {
        body: { id }
      })

      if (error) {
        console.warn('onoz! got error from square-import:', error)
        setError(`${error}`)
      }
      if (!!(data && data.ok)) {
        setDone(true)
        setError(undefined)
      }
      setLoading(false)
    } catch (err) {
      console.warn('onoz! square-import err:', err)
      setError(`${err}`)
      setLoading(false)
    }
  }

  return (
    <div className={classes.root}>
      <h1>Square Import</h1>

      <div className={classes.actions}>
        <WholesaleOrdersSelect
          onAddWholesaleOrderItems={onAddWholesaleOrderItems}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSaveSquareImport}
        >
          Save
        </Button>
      </div>
      <LineItemAutocomplete onItemSelected={onAddLineitem} />
      <div className={classes.items}>
        <ItemsTable
          items={items.filter((i) => i.imported)}
          setItems={setItems}
        />
      </div>
      <div className={classes.items}>
        <ItemsTable
          items={items.filter((i) => !i.imported)}
          setItems={setItems}
        />
      </div>
      <div className={classes.importAction}>
        {items.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={onImportToSquare}
            disabled={!id || loading}
          >
            {done
              ? 'Complete!'
              : `Import ${items.length} item${
                  items.length > 1 ? 's' : ''
                } to Square`}
          </Button>
        )}

        {error && (
          <div>
            <h3>Error!</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
