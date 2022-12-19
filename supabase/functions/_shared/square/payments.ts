import { CreatePaymentRequest } from 'https://esm.sh/square@25.0.0'
import { randomUUID } from 'https://deno.land/std@0.168.0/node/crypto.ts'
import { client } from './client.ts'

const { paymentsApi } = client

export async function createPayment(props: {
  sourceId: string
  amountCents: number
  note?: string
  orderId?: string
  verificationToken?: string
  customerId?: string
  locationId?: string
  autocomplete?: boolean
}) {
  const {
    sourceId,
    verificationToken,
    amountCents,
    note,
    orderId,
    customerId,
    locationId,
    autocomplete
  } = props

  const amount = BigInt(amountCents)
  const payment: CreatePaymentRequest = {
    idempotencyKey: randomUUID(),
    sourceId,
    note,
    verificationToken,
    amountMoney: {
      amount,
      currency: 'USD'
    },
    locationId,
    customerId,
    orderId,
    autocomplete
  }
  try {
    const { result, statusCode } = await paymentsApi.createPayment(payment)

    // console.log('Payment succeeded!', { result, statusCode })

    return {
      id: result.payment?.id,
      status: result.payment?.status,
      receiptUrl: result.payment?.receiptUrl,
      orderId: result.payment?.orderId
    }
  } catch (error) {
    console.warn('zomg square createPayment threw up! error:', error)
    return {
      id: undefined,
      status: undefined,
      receiptUrl: undefined,
      orderId: undefined,
      error
    }
  }
}
