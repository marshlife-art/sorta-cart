import React, { Component } from 'react'
import Select from '@material-ui/core/Select'

import { PRODUCT_KEYS } from '../util/utilz'
import { ProductMap } from '../types/Product'

export interface ProductSelectOption {
  lab: string
  val: string
  dis: boolean
}

const PRODUCT_KEYS_FOR_SELECT: ProductSelectOption[] = PRODUCT_KEYS.map(
  key => ({ lab: key, val: key, dis: false })
)

interface ProductMapSelectProps {
  optz: ProductSelectOption[]
  pkey: keyof ProductMap
  setProductMapForKey: (key: keyof ProductMap, value: number[]) => void
  productMap?: Partial<ProductMap>
}

interface ProductMapSelectState {
  options: ProductSelectOption[]
  value: ProductSelectOption[]
  selected: number[]
}

export class ProductMapSelect extends Component<
  ProductMapSelectProps,
  ProductMapSelectState
> {
  static defaultProps = {
    optz: PRODUCT_KEYS_FOR_SELECT
  }

  defaultValues = (): ProductSelectOption[] => {
    const { productMap, pkey } = this.props
    const values = productMap && productMap[pkey]
    if (values) {
      return values.map(
        item =>
          ({
            lab: `${item}`,
            val: `${item}`,
            dis: false
          } as ProductSelectOption)
      )
    } else {
      return []
    }
  }
  state: ProductMapSelectState = {
    options: this.props.optz, // :/
    value: this.defaultValues(),
    selected: []
  }

  // function handleChange(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
  //   setValues(oldValues => ({
  //     ...oldValues,
  //     [event.target.name as string]: event.target.value,
  //   }));
  // }

  render() {
    return (
      <Select
        multiple
        value={this.state.value}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          const value = event.target.value as ProductSelectOption[]
          // const selected = value.map((v: ProductSelectOption) =>
          //   parseInt(v)
          // )
          this.setState({ value })
        }}
        onClose={() => {
          this.props.setProductMapForKey(this.props.pkey, this.state.selected)
        }}
      />
    )
  }
}
