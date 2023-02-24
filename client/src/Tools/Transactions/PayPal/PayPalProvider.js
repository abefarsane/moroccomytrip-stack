import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useEffect, useState } from "react";
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default function PayPalProvider ({ totalPrice, currency, bookingId}) {

    const [clientId, setClientId] = useState("")

    const getClientId = () => {

        axios.get('http://localhost:3001/bookings/paypal-client-id', {
            headers: { token: localStorage.getItem('token')}
        }).then((response) => {
            setClientId(response.data)
        })

    }

    const updateBookingState = () => {
        axios.put(`http://localhost:3001/bookings/update-status/${bookingId}`).then((response) => {
            if (response.data.error) {
                console.log(response.data.error)
            } else {
                alert(response.data.message)
            }
        })
    }

    useEffect(() => {
        getClientId()
    }, [])

    const initialOptions = {
        "client-id": clientId,
        currency: "EUR",
        intent: "capture"
    };

    return (
        <PayPalScriptProvider options={{ "client-id": initialOptions }}>
            <PayPalButtons
                style={{ layout: "horizontal" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: totalPrice,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        const name = details.payer.name.given_name;
                        alert(`Transaction completed by ${name}`);
                        updateBookingState()
                    });
                }}
            />
        </PayPalScriptProvider>
    )
}