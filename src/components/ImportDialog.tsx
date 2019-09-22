import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'

import { ProductMap, ProductMeta, ProductMapPartial } from '../types/Product'
import {
  PRODUCT_KEYS,
  catz,
  productMapFn,
  productPropMapFn
} from '../util/utilz'
import { ProductMapSelect } from './ProductMapSelect'
import Papa from 'papaparse'
import { AppDatabase, IProduct } from '../appDatabase'

// demo

const TEST_MAP: ProductMap = {
  name: [2],
  description: [3],
  pk: [4],
  size: [5],
  unit_type: [6],
  price: [8],
  unit_price: [9],
  property: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  search: [2, 3, 10],
  category: [10]
}
interface AllData {
  header: string[]
  data: { [index: string]: string[][] }
  meta: { [index: string]: ProductMeta }
}

type Steps = 'upload' | 'map' | 'confirm' | 'done'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    }
  })
)

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
  }
)

interface ImportDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ImportDialog(props: ImportDialogProps) {
  const db = new AppDatabase()

  const classes = useStyles()
  const { open, setOpen } = props

  const [step, setStep] = useState<Steps>('upload')
  const [loading, setLoading] = useState(false)
  const [header, setHeader] = useState<string[]>([])
  const [productMap, setProductMap] = useState<ProductMapPartial>(TEST_MAP)

  const [productMapErrorMsg, setProductMapErrorMsg] = useState('')
  const [importProductsError, setImportProducsError] = useState()
  const [docsToSaveCount, setDocsToSaveCount] = useState(0)
  const [savedDocsCount, setSavedDocsCount] = useState(0)

  const [allData, setAllData] = useState<AllData>({
    header: [],
    data: {},
    meta: {}
  })

  let groupName: string

  function setProductMapForKey(key: keyof ProductMap, value: number[]) {
    // add things to the productMap object one key-at-a-time
    setProductMap({ ...productMap, ...{ [key]: value } })
  }

  function parse(file: File) {
    let mutAllData: AllData = {
      header: [],
      data: {},
      meta: {}
    }

    Papa.parse(file, {
      worker: true,
      step: ({ data }) => {
        if (mutAllData.header.length === 0) {
          mutAllData.header = data.map(d => d.trim())
          // setProductDoc({ _id: 'header', data: data })
          // setDoSave(true)
          console.log('set header')
          setHeader(data)
        } else if (
          data[0] &&
          data[0] !== '' &&
          data.slice(1, data.length).filter(x => x.trim() !== '').length === 0
        ) {
          groupName = data[0].trim()
          console.log('set groupName:', groupName)
        } else {
          groupName = groupName || 'default'

          const row: string[] = data.map(d => d.trim())

          const product: IProduct = {
            name: productMapFn('name', row, TEST_MAP),
            description: productMapFn('description', row, TEST_MAP),
            pk: parseInt(productMapFn('pk', row, TEST_MAP)),
            size: productMapFn('size', row, TEST_MAP),
            unit_type: productMapFn('unit_type', row, TEST_MAP),
            price: productMapFn('price', row, TEST_MAP),
            unit_price: productMapFn('unit_price', row, TEST_MAP),
            properties: productPropMapFn(row, TEST_MAP).join(''),
            category: productMapFn('category', row, TEST_MAP),
            search: productMapFn('search', row, TEST_MAP),
            upc: row[0],
            sku: row[1]
          }

          db.products
            .add(product)
            .then(() => console.log('added product:', product))
            .catch(e => {
              console.warn('db add Product error: ' + e.stack || e)
            })
        }
      },
      complete: function() {
        console.log('parsing done! mutAllData:', mutAllData)
        setAllData(mutAllData)
        setLoading(false)
        setStep('map')

        setOpen(false)
        // #TODO: cleanup  data?? like:
        // allData.data = {}
        // props.setActionModalOpen(false)
      },
      error: function(e) {
        console.warn('onoz, parse caught error:', e)
      }
    })
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true)
    if (event.target.files && event.target.files.length) {
      parse(event.target.files[0])
    } else {
      setLoading(false)
    }
  }

  function onSaveMapping() {
    const canGotoNextStep =
      productMap && Object.keys(productMap).length === PRODUCT_KEYS.length
    // console.log('next productMap:', productMap)
    // console.log('PRODUCT_KEYS === keys(productMap):', canGotoNextStep)
    setProductMapErrorMsg(
      canGotoNextStep ? '' : 'PLEASE SELECT AN OPTION FOR EACH PRODUCT KEY'
    )

    canGotoNextStep && setStep('confirm')

    if (canGotoNextStep) {
      let mutAllDataMeta: AllData['meta'] = allData.meta

      Object.keys(allData.data).forEach(group_name => {
        // #TODO: default index [10] probably not needed
        const catIdx =
          (productMap['category'] && productMap['category'][0]) || 10
        // console.log('catz:', catz(catIdx, allData.data[group_name]))
        mutAllDataMeta[group_name] = {
          data_length: allData.data[group_name].length,
          catz: catz(catIdx, allData.data[group_name]),
          date_added: Date.now(),
          header: allData.header
        }
      })

      // console.log('parsing done! mutAllData:', mutAllDataMeta)
      setAllData(prevAllData => ({ ...prevAllData, meta: mutAllDataMeta }))
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            upload .csv files:
          </Typography>
          <Button color="inherit" onClick={() => setOpen(false)}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        {step === 'upload' && (
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />

            {loading && 'L O A D I N G . . .'}
          </div>
        )}

        {step === 'map' && (
          <div>
            <p>
              Setup a mapping from the uploaded .csv data to the internal
              product model.
            </p>
            <p>
              Select one or more header cells for <b>every</b> product key
              below:
            </p>

            <div>
              <h5>PRODUCT KEY</h5>
              <h5>HEADER CELL</h5>
            </div>

            <div>
              {PRODUCT_KEYS.map(key => (
                <div key={`keymap${key}`}>
                  <p key={`keymap${key}`}>{key}</p>
                  <ProductMapSelect
                    optz={
                      header && header.length
                        ? header.map((k, i) => ({
                            lab: `[${i}] ${k}`,
                            val: i.toString(),
                            dis: false
                          }))
                        : undefined
                    }
                    pkey={key}
                    setProductMapForKey={setProductMapForKey}
                    productMap={productMap}
                  />
                </div>
              ))}
            </div>

            <div>
              {productMapErrorMsg && (
                <p color="status-critical">{productMapErrorMsg}</p>
              )}
              <Button
                onClick={() => {
                  onSaveMapping()
                }}
              >
                Save Mapping
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
