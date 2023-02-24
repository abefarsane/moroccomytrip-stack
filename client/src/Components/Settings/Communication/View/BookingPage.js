import axios from 'axios';
import React, { Component, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcPaypal, faPaypal } from "@fortawesome/free-brands-svg-icons"
import PayPalProvider from '../../../../Tools/Transactions/PayPal/PayPalProvider';
import { AuthContext } from '../../../../Tools/Context/AuthContext';
import io from 'socket.io-client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingPage() {

    const { id } = useParams()
    const [bookingData, setBookingData] = useState({})
    const [message, setMessage] = useState("")
    const [chatId, setChatId] = useState()
    const [status, setStatus] = useState("PENDING_PAYMENT")

    const { authState, setSocket, api } = useContext(AuthContext)
    const socket = io.connect(api)
    const navigate = useNavigate()

    const retrieveBooking = () => {

        axios.get(`${api}/bookings/retrieveSingleById/${id}`, {
            headers: { token: localStorage.getItem('token')}
        }).then((response) => {
            if (response.data.error) {
                
            } else {
                if (response.data.status) {
                    console.log(response.data.data)
                    setBookingData(response.data.data)
                    setStatus(bookingData.status)
                } else {
                    setMessage(response.data.message)
                }
            }
        })

    }


    useEffect(() => {
        retrieveBooking()
        // /getChatId()
    }, [])

    var date1 = new Date();
    var date2 = new Date(bookingData.dateFrom);

    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    const [clientId, setClientId] = useState("")

    const getClientId = () => {

        axios.get(`${api}/bookings/paypal-client-id`, {
            headers: { token: localStorage.getItem('token')}
        }).then((response) => {
            setClientId(response.data)
        })

    }

    const updateBookingState = () => {
        axios.put(`${api}/bookings/update-status/${bookingData.id}`).then((response) => {
            if (response.data.error) {
                console.log(response.data.error)
            } else {
                retrieveBooking()
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
        <section className='booking-page'>
            <section className='booking-header'>
                <h1 className='h5-response'> {bookingData.Package?.title} </h1>
                <button className='btn-secondary' onClick={() => {
                    navigate(`/chat/${chatId}`)
                    socket.emit('join_chat', chatId)
                    setSocket(socket)
                }}>Chat</button>
            </section>

            <section className='contain-booking'>
                <section className='notes'>
                    <h4>Additional notes</h4>
                    <p>{bookingData.notes !== "" ? bookingData.notes : "No additional notes."}</p>
                </section>

                <section className='price-s'>
                    <h4>Total price</h4>
                    <p><strong>{bookingData.totalPrice}</strong> {bookingData.currency}</p>
                </section>

                <section className='date'>
                    <h4>Dates</h4>
                    <p>From <strong>{bookingData.dateFrom}</strong> to <strong>{bookingData.dateTo}</strong></p>
                </section>
            </section>
                {

                    !authState.admin && (
                        <section className='payment'>
                            {
                        bookingData.status == "PENDING_PAYMENT" ? (
                            <section>
                                <p className='warning'>You still have a pending payment for this booking.</p>
                                <button className='pay-btn'>
                                <PayPalScriptProvider options={{ "client-id": initialOptions }}>
                                    <PayPalButtons
                                        style={{ layout: "horizontal" }} 
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: bookingData.totalPrice,
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
                                </button>
                            </section>
                        ) : ( 
                            <p>Countdown till departure <br/><strong>-{parseInt(Difference_In_Days)}</strong></p>
                        )
                        }
                        </section>
                        )

                    
                }

            
        </section>
    )
}