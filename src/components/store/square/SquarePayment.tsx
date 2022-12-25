import React, { useState, useEffect, useRef, useCallback } from 'react'
import Button from '@material-ui/core/Button'

import './sq-payment-form.css'
import {
  API_HOST,
  SQUARE_APP_ID,
  SQUARE_LOCATION_ID,
  SQUARE_PAYMENT_JS
} from '../../../constants'
import Loading from '../../Loading'
import { supabase } from '../../../lib/supabaseClient'

declare const Square: any

interface SquarePaymentFormProps {
  paymentForm: any
  handleNext: (sourceId: string) => void
  amount: number
  loading: boolean
  autocompletePayment?: boolean
  captureCardOnly?: boolean
}

function SquarePaymentForm(props: SquarePaymentFormProps) {
  const {
    paymentForm,
    amount,
    loading,
    handleNext,
    autocompletePayment,
    captureCardOnly
  } = props

  const appId = SQUARE_APP_ID
  const locationId = SQUARE_LOCATION_ID

  async function initializeCard(payments: any) {
    const card = await payments.card()
    await card.attach('#card-container')

    return card
  }

  async function createPayment(token: string) {
    if (captureCardOnly) {
      console.log('ZOMG captureCardOnly gonna skip invoking square-payment!')
      return { id: token }
    }

    const { data, error } = await supabase.functions.invoke('square-payment', {
      body: {
        sourceId: token,
        amountCents: amount,
        autocomplete: !!autocompletePayment
      }
    })

    console.log('zomg square-payment error,data:', error, data)

    if (error) {
      throw new Error(error)
    }

    if (data.success) {
      return data.paymentResponse
    }

    throw new Error(data.error)
  }

  async function tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize()
    if (tokenResult.status === 'OK') {
      // console.log('okayyyy tokenResult:', tokenResult)
      return tokenResult.token
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`
      }

      throw new Error(errorMessage)
    }
  }

  // status is either SUCCESS or FAILURE;
  function displayPaymentFailResults() {
    const statusContainer = document.getElementById(
      'payment-status-container'
    ) as HTMLDivElement
    if (!statusContainer) {
      return
    }
    statusContainer.classList.remove('is-success')
    statusContainer.classList.add('is-failure')
    statusContainer.style.visibility = 'visible'
  }

  const init = useCallback(async () => {
    if (!paymentForm) {
      // throw new Error('Square.js failed to load properly');
      console.warn('onoz no paymentForm!')
    }

    let payments
    try {
      payments = paymentForm.payments(appId, locationId)
    } catch {
      const statusContainer = document.getElementById(
        'payment-status-container'
      ) as HTMLDivElement
      if (!statusContainer) {
        return
      }
      statusContainer.className = 'missing-credentials'
      statusContainer.style.visibility = 'visible'
      return
    }

    let card: any
    try {
      card = await initializeCard(payments)
    } catch (e) {
      console.error('Initializing Card failed', e)
      return
    }

    // Checkpoint 2.
    async function handlePaymentMethodSubmission(
      event: any,
      paymentMethod: any
    ) {
      event.preventDefault()

      try {
        // disable the submit button as we await tokenization and make a payment request.
        if (cardButton) {
          cardButton.disabled = true
        }

        const token = await tokenize(paymentMethod)
        console.log('zomg gonna try to createPayment')
        const paymentResponse = await createPayment(token)

        console.log(
          'zomg createPayment done, gonna handleNext token, paymentResponse:',
          token,
          paymentResponse
        )
        handleNext(paymentResponse.id)
        // displayPaymentResults('SUCCESS')
      } catch (e: any) {
        cardButton.disabled = false
        displayPaymentFailResults()
        console.error(e.message)
      }
    }

    const cardButton = document.getElementById(
      'card-button'
    ) as HTMLButtonElement
    cardButton &&
      cardButton.addEventListener('click', async function (event) {
        await handlePaymentMethodSubmission(event, card)
      })
  }, [paymentForm])

  useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <form id="payment-form">
        <div id="card-container"></div>
        <Button
          id="card-button"
          variant="contained"
          color="primary"
          // onClick={requestCardNonce}
          fullWidth
          disabled={loading}
        >
          Pay ${(amount / 100).toFixed(2)}
        </Button>
      </form>
      <div id="payment-status-container"></div>
    </div>
  )
}

/*
 */

interface SquarePaymentProps {
  handleNext: (sourceId: string) => void
  amount: number
  loading: boolean
  autocompletePayment?: boolean
  captureCardOnly?: boolean
}

export default function SquarePayment(props: SquarePaymentProps) {
  const [jsloaded, setJsloaded] = useState(false)

  useEffect(() => {
    let sqPaymentScript = document.createElement('script')
    sqPaymentScript.src = SQUARE_PAYMENT_JS
    sqPaymentScript.type = 'text/javascript'
    sqPaymentScript.async = false
    sqPaymentScript.onload = () => setJsloaded(true)
    document.getElementsByTagName('head')[0].appendChild(sqPaymentScript)
  }, [])

  return jsloaded ? (
    <SquarePaymentForm
      paymentForm={Square}
      handleNext={props.handleNext}
      amount={props.amount || 0}
      loading={props.loading}
      autocompletePayment={props.autocompletePayment}
      captureCardOnly={props.captureCardOnly}
    />
  ) : (
    <Loading />
  )
}
