import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import ProductCard from '../ProductCard/ProductCard';
import axios from 'axios'
import { useState } from 'react';

export default function CheckoutForm({product}) {

    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })
        setLoading(true)

        if(!error /* && product.stock > 0 */) {
            const { id } = paymentMethod
            try {
                const {data} = await axios.post('http://localhost:3001/api/checkout', {
                id,
                amount: product.price * 100,
                description: product.description
            })
            console.log(data)
            elements.getElement(CardElement).clear()
            }
            catch(error) {
                console.log(error)
            }
            setLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button>
                Buy
            </button>
        </form>
    )
}