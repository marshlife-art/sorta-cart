import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'

const DB_URL = 'http://localhost:5984/'

const useProductDocService = (collection: string, id: string | undefined) => {
  const [result, setResult] = useState<Service<ProductDoc>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!collection || collection.length === 0 || !id || id.length === 0) {
      return
    }
    const db = new PouchDB(DB_URL + collection, {
      skip_setup: true
    })
    db.get(id)
      .then(doc => setResult({ status: 'loaded', payload: doc as ProductDoc }))
      .catch(error => {
        console.log('useDocumentService db.get error:', error)
        if (error.name === 'not_found') {
          console.log('not_found! ...try harder?!')
        }
        setResult({ ...error })
      })
  }, [collection, id])

  return result
}

// Promise<Core.AllDocsResponse<Content & Model>>
type AllDocsResponse = Service<PouchDB.Core.AllDocsResponse<any>>

const useAllDocumentsService = (
  collection: string,
  include_docs: boolean = false,
  use_changes: boolean = false
) => {
  const [result, setResult] = useState<AllDocsResponse>({
    status: 'loading'
  })

  useEffect(() => {
    if (!collection || collection.length === 0) {
      return
    }
    const db = new PouchDB(DB_URL + collection, {
      skip_setup: true
    })
    db.allDocs({ include_docs: include_docs })
      .then(docs => setResult({ status: 'loaded', payload: docs }))
      .catch(error => setResult({ ...error }))

    const changes = db
      .changes({
        since: 'now',
        live: true,
        include_docs: include_docs
      })
      .on('change', change => {
        if (change.deleted) {
          db.allDocs({ include_docs: include_docs })
            .then(docs => setResult({ status: 'loaded', payload: docs }))
            .catch(error => setResult({ ...error }))
        }
        if (use_changes) {
          db.allDocs({ include_docs: include_docs })
            .then(docs => setResult({ status: 'loaded', payload: docs }))
            .catch(error => setResult({ ...error }))
        }
      })
      .on('complete', info => {
        // changes() was canceled
      })
      .on('error', err => {
        console.warn('useCartDocService caught error:', err)
      })

    return () => changes.cancel()
  }, [collection, include_docs, use_changes])

  return result
}

export { useProductDocService, useAllDocumentsService }
