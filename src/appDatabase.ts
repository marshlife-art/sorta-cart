import Dexie from 'dexie'

export interface IProduct {
  id?: number
  name: string
  description: string
  pk: number
  size: string
  unit_type: string
  price: string
  unit_price: string
  properties: string
  category: string
  search: string
  upc: string
  sku: string
}

// UNF,UPC Code,Long Name,Advertising Description,PK,Size,Unit Type,M,W/S Price,U Price,Category Description,a,r,c,l,d,f,g,v,w,y,k,ft,m,og,s,n

export class AppDatabase extends Dexie {
  products: Dexie.Table<IProduct, number>

  constructor() {
    super('SortaCartDatabase')
    this.version(1).stores({
      products:
        '++id,name,description,pk,size,unit_type,price,unit_price,properties,category,search,upc,sku'
    })
    this.products = this.table('products')
  }
}
