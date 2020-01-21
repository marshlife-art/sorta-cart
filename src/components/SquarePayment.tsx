import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'

import '../sq-payment-form.css'
import {
  SQUARE_APP_ID,
  SQUARE_LOCATION_ID,
  SQUARE_PAYMENT_JS
} from '../constants'
import Loading from './Loading'

declare const SqPaymentForm: any

const styles: { [key: string]: React.CSSProperties } = {
  name: {
    verticalAlign: 'top',
    display: 'none',
    margin: 0,
    border: 'none',
    fontSize: '16px',
    fontFamily: 'Helvetica Neue',
    padding: '16px',
    color: '#373F4A',
    backgroundColor: 'transparent',
    lineHeight: '1.15em'
  },
  leftCenter: {
    float: 'left',
    textAlign: 'center'
  },
  blockRight: {
    display: 'block',
    float: 'right'
  },
  center: {
    textAlign: 'center'
  },
  error: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    whiteSpace: 'pre-wrap',
    color: 'red'
  }
}

interface SquarePaymentFormProps {
  paymentForm: any
  handleNext: (nonce: string) => void
  amount: number
  loading: boolean
}
function SquarePaymentForm(props: SquarePaymentFormProps) {
  const [cardBrand, setCardBrand] = useState('')
  const [googlePay, setGooglePay] = useState(false)
  const [applePay, setApplePay] = useState(false)
  const [masterpass, setMasterpass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const config = {
    applicationId: SQUARE_APP_ID,
    locationId: SQUARE_LOCATION_ID,
    inputClass: 'sq-input',
    autoBuild: false,
    inputStyles: [
      {
        fontSize: '16px',
        fontFamily: 'Helvetica Neue',
        padding: '16px',
        color: '#373F4A',
        backgroundColor: 'transparent',
        lineHeight: '1.15em'
      }
    ],
    applePay: {
      elementId: 'sq-apple-pay'
    },
    masterpass: {
      elementId: 'sq-masterpass'
    },
    googlePay: {
      elementId: 'sq-google-pay'
    },
    cardNumber: {
      elementId: 'sq-card-number',
      placeholder: '• • • •  • • • •  • • • •  • • • •'
    },
    cvv: {
      elementId: 'sq-cvv',
      placeholder: 'CVV'
    },
    expirationDate: {
      elementId: 'sq-expiration-date',
      placeholder: 'MM/YY'
    },
    postalCode: {
      elementId: 'sq-postal-code',
      placeholder: 'Zip'
    },
    callbacks: {
      methodsSupported: (methods: any) => {
        if (methods.googlePay) {
          setGooglePay(true)
        }
        if (methods.applePay) {
          setApplePay(true)
        }
        if (methods.masterpass) {
          setMasterpass(true)
        }
        return
      },
      createPaymentRequest: () => {
        return {
          requestShippingAddress: false,
          requestBillingInfo: true,
          currencyCode: 'USD',
          countryCode: 'US',
          total: {
            label: 'MARSH COOP',
            amount: props.amount,
            pending: false
          },
          lineItems: [
            {
              label: 'Subtotal',
              amount: props.amount,
              pending: false
            }
          ]
        }
      },
      cardNonceResponseReceived: (errors: any, nonce: any, cardData: any) => {
        if (errors) {
          // Log errors from nonce generation to the Javascript console
          console.log('Encountered errors:')
          errors.forEach(function(error: any) {
            console.log('  ' + error.message)
          })
          setError(
            `Encountered errors:\n${errors
              .map((e: any) => e.message)
              .join('\n')}`
          )
          return
        }
        console.log('cardNonceResponseReceived nonce:', nonce)
        props.handleNext(nonce)
      },
      unsupportedBrowserDetected: () => {},
      inputEventReceived: (inputEvent: any) => {
        switch (inputEvent.eventType) {
          case 'focusClassAdded':
            break
          case 'focusClassRemoved':
            break
          case 'errorClassAdded':
            setError('Please fix card information errors before continuing.')
            break
          case 'errorClassRemoved':
            setError('')
            break
          case 'cardBrandChanged':
            if (inputEvent.cardBrand !== 'unknown') {
              setCardBrand(inputEvent.cardBrand)
            } else {
              setCardBrand('')
            }
            break
          case 'postalCodeChanged':
            break
          default:
            break
        }
      },
      paymentFormLoaded: function() {
        console.log('paymentFormLoaded!')
        setLoading(false)
        // document.getElementById('name').style.display = "inline-flex";
      }
    }
  }

  const paymentFormRef = useRef(new props.paymentForm(config))

  function requestCardNonce() {
    console.log(
      'requestCardNonce paymentFormRef:',
      paymentFormRef.current.requestCardNonce,
      ' props.paymentForm:',
      props.paymentForm.requestCardNonce
    )
    paymentFormRef.current.requestCardNonce &&
      paymentFormRef.current.requestCardNonce()
    // props.paymentForm.requestCardNonce()
  }

  useEffect(() => {
    console.log(
      '!!! SquarePaymentForm !!! fx, gonna paymentFormRef.current.build() !!!'
    )
    paymentFormRef.current.build()
    // paymentFormRef && paymentFormRef.current && paymentFormRef.current.build()
  }, [])

  return (
    <>
      {loading && <Loading />}
      <div style={{ display: loading ? 'hidden' : 'block' }}>
        <div className="container">
          <div id="form-container">
            <div id="sq-walletbox">
              <button
                style={{ display: applePay ? 'inherit' : 'none' }}
                className="button-google-pay"
                id="sq-apple-pay"
              ></button>
              <button
                style={{ display: masterpass ? 'block' : 'none' }}
                className="sq-apple-pay"
                id="sq-masterpass"
              ></button>
              <button
                style={{ display: googlePay ? 'inherit' : 'none' }}
                className="sq-masterpass"
                id="sq-google-pay"
              ></button>

              <div className="sq-wallet-divider">
                <span className="sq-wallet-divider__text">Or</span>
              </div>
            </div>

            <div id="sq-ccbox">
              <p>
                <span style={styles.leftCenter}>Enter Card Info Below </span>
                <span style={styles.blockRight}>{cardBrand.toUpperCase()}</span>
              </p>
              <div id="cc-field-wrapper">
                <div id="sq-card-number"></div>
                <input type="hidden" id="card-nonce" name="nonce" />
                <div id="sq-expiration-date"></div>
                <div id="sq-cvv"></div>
              </div>
              <input
                id="name"
                style={styles.name}
                type="text"
                placeholder="Name"
              />
              <div id="sq-postal-code"></div>
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={requestCardNonce}
              fullWidth
              disabled={props.loading}
            >
              Pay ${(props.amount / 100).toFixed(2)}
            </Button>
          </div>
          <p style={styles.error} id="error">
            {error}
          </p>
        </div>
      </div>
    </>
  )
}

interface SquarePaymentProps {
  handleNext: (nonce: string) => void
  amount: number
  loading: boolean
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
      paymentForm={SqPaymentForm}
      handleNext={props.handleNext}
      amount={props.amount || 0}
      loading={props.loading}
    />
  ) : (
    <Loading />
  )
}
