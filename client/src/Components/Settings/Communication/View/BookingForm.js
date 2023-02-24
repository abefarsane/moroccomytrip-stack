import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../Tools/Context/AuthContext';
import ModalCustom from '../../../ModalCustom';
import { IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react';


export default function BookingForm({ clientId, packageId, chatId}) {

    const [notes, setNotes] = useState("")
    const [dateFrom, setDateFrom] = useState(new Date)
    const [dateTo, setDateTo] = useState(new Date)
    const [totalPrice, setTotalPrice] = useState(0)
    const [currency, setCurrency] = useState('euro')

    
    const [ errMsg, setErrMsg] = useState("")
    const [ success, setSuccess] = useState("")

    const { authState, api } = useContext(AuthContext)


    const handleBooking = (e) => {

        e.preventDefault()

        const data = {
            notes: notes,
            dateFrom: dateFrom,
            dateTo: dateTo,
            totalPrice: totalPrice,
            currency: currency,
            clientId: clientId,
            packageId: packageId,
            chatId: chatId
        }

        if (!dateFrom || !dateTo || !totalPrice) {
            setErrMsg("Fill all the details")
        } else {
            axios.post(`${api}/bookings/add`,data, {
                headers: { token: localStorage.getItem('token')}
            }).then((response) => {
                if (response.data.error) {
                    setErrMsg(response.data.error)
                } else {
                    if (response.data.status) {
                        setErrMsg("")
                        setSuccess(response.data.message)
                    } else {
                        setSuccess("")
                        setErrMsg(response.data.message)
                    }
                } 
            })
        }
    }


    return (

        <>
            <section>
                <h1 id='modal-title'>Make booking</h1>
                <p className='response-msg' id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                <p className='response-msg' id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>
            </section>
            <div className='booking-form'>
            <form onSubmit={handleBooking}>
            <section>
                <h4 className='input-label'>
                    Notes
                </h4>
                <textarea
                    type='text'
                    placeholder='Add details to the booking'
                    className='input-text-dark'
                    onChange={(e) => {
                        setNotes(e.target.value)
                    }}
                />
            </section>
            <section>
                <h4 className='input-label'>
                    From
                </h4>
                <input
                    onChange={(e) => {
                        setDateFrom(e.target.value)
                    }}
                    type='date'
                    className='input-text-dark'
                />
            </section>
                
            <section>
                <h4 className='input-label'>
                    To
                </h4>
                <input
                    onChange={(e) => {
                        setDateTo(e.target.value)
                    }}
                    type='date'
                    min={dateFrom}
                    className='input-text-dark'
                />
            </section>
            <section className='price-booking'>
                <h4 className='input-label'>
                    Total price
                </h4>
                <section>
                    <select id="currencie" name="currencie" className='input-text-dark' onChange={(e) => {
                        setCurrency(e.target.value)
                    }}>
                      <option value="EURO">Euros</option>
                      <option value="MAD">MAD</option>
                    </select>
                    
                    <input
                        onChange={(e) => {
                            setTotalPrice(e.target.value)
                        }}
                        type='number'
                        min='1'
                        className='input-text-dark'
                    />
                </section>
                
            </section>
            <button className='btn-secondary'>
                Create booking
            </button>
        </form>
            </div>
            </>
    )
}