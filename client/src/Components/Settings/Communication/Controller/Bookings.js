import axios from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../Tools/Context/AuthContext';
import ModalCustom from '../../../ModalCustom';

export default function Bookings() {

    const [bookings, setBookings] = useState([])
    const { authState, api } = useContext(AuthContext)
    const navigate = useNavigate()

    const [ errMsg, setErrMsg] = useState("")
    const [ success, setSuccess] = useState("")

    const [message, setMessage] = useState("")

    const retrieveBookings = () => {

        if (authState.admin) {
            axios.get(`${api}/bookings/allBookings`, {
                headers: { token: localStorage.getItem('token')}
            }).then((response) => {
                if (response.data.error) {
                    navigate('/login')
                } else {
                    setBookings(response.data.data)
                }
            })
        } else {
            axios.get(`${api}/bookings/retrieveById/${authState.id}`, {
                headers: { token: localStorage.getItem('token')}
            }).then((response) => {
                if (response.data.error) {
                    navigate('/login')
                } else {
                    if (response.data.status) {
                        setBookings(response.data.data)
                    } else {
                        setMessage(response.data.message)
                    }
                }
            })
        }
    }

    const handleBookingDelete = (id) => {

        axios.delete(`${api}/bookings/deleteById/${id}`, {
            headers: { token: localStorage.getItem('token')}
        })
            .then((response) => {
                if (response.data.error) {
                    navigate('/login')
                } else {
                    setSuccess(response.data.message)
                }
            })

    }

    useEffect(() => {
        retrieveBookings()
    }, [])
    

    return (
        <section className='bookings'>

            {
                authState.admin ? (
                    <h2 className='h5-response'>Clients bookings</h2>
                ) : (
                    <h2 className='h5-response'>Your bookings</h2>
                )
            }


            <section>
                {

                    bookings.length < 1 ? (
                        <h5 className='h5-response'>No bookings available</h5>
                    ) : (
                        bookings.map((x, key) => {
                            return (
                                <section className='single-booking'>
                                    <section  onClick={() => {
                                    navigate(`/booking/${x.id}`)
                                }}>
                                    <h5>{x?.Package?.title}<br></br><span className={x.status == "PENDING_PAYMENT" ? "pending" : "confirmed"}>{x.status == "PENDING_PAYMENT" ? (
                                        "PENDING PAYMENT"
                                    ) : (
                                        "CONFIRMED"
                                    )}</span></h5>
                                    </section>
                                    
                                    
                                    <ModalCustom btnText={"Delete"} btnClass="delete-btn">
                                        <h1 id='modal-title'>Delete chat</h1>
                                        <p className='response-msg' id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                                        <p className='response-msg' id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>
                                        <p>Are you sure you want to delete this booking?</p>
                                        <button className='btn-primary' onClick={() => {
                                            handleBookingDelete(x.id)
                                            setSuccess("")
                                        }}>Confirm deletion</button>
                                    </ModalCustom>
                                </section>
                            )
                        })
                    )


                    
                }
            </section>
        </section>
    )
}