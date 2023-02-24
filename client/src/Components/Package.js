import { faPeopleArrows, faPeopleGroup, faCheck, faPersonWalking, faCircleXmark, faComments } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Tools/Context/AuthContext';
import ModalCustom from './ModalCustom'
import Login from './Login'
import RequestForm from './Settings/Communication/View/RequestForm';
import { CustomSliderServices } from '../Tools/sComponents/CustomSlider';
import Badge from 'react-bootstrap/Badge';

export default function Package() {

    const {id} = useParams()
    const [pack, setPack] = useState({
        Images: []
    })
    const [error, setError] = useState("")
    const [ booked, setBooked ] = useState(false)

    const { authState, api } = useContext(AuthContext)

    const getPackageDetails = () => {
        axios.get(`${api}/packages/byID/${id}`)
            .then((response) => {
                if (response.data.error) {
                    setPack(null)
                    setError(response.data.error)
                } else {
                    setPack(response.data)
                }
            })
    }

    const checkIfAlreadyBooked = () => {

        axios.get(`${api}/chat/check-if-already-sent/${id}/${authState.id}`)
            .then((response) => {
                if (response.data.status) {
                    setBooked(true)
                } else {
                    setBooked(false)
                }
            })
            
    }


    useEffect(() => {
        getPackageDetails()
        checkIfAlreadyBooked()
    }, [])


    return (
        <div className='package animate__animated animate__fadeIn'>

            { 
                pack == null ? (
                    <h1>{error}</h1>
                ) : (
                    <>
                        <section className='package-header'>
                            <section className='header-details'>
                                <img src={pack.Images[0]?.urlPath}/>
                                <h2 className='h5-response'>{pack.title}</h2>
                                <p className='animate__animated animate__flash animate__delay-2s'>Hover here to see the image!</p>
                                
                            </section>
                        </section>
                        <section className='package-data'>
                            <section className='days'>
                                <h3>For <strong>{pack.duration + (pack.duration > 1 ? " days" : " day")}</strong></h3>
                            </section>
                            <section className='people'>
                                <h3>{pack.people + (pack.people > 1 ? " people" : " person")}</h3>
                            </section>
                            <section className='price'>
                                <h3>Starting from <strong>€{pack.price}</strong></h3>
                            </section>
                        </section>

                        <section className='request'>
                                <ModalCustom btnText={"Start a booking request"} btnClass='chat-btn'>

                                {
                                    authState.status ? (
                                        <>
                                        {
                                            booked ? (
                                                <h3 className='status-booking'>Already <strong> booked!</strong></h3>
                                            ) : (
                                                <>
                                                    <h1 id='modal-title'>Booking request</h1>
                                                    <RequestForm packageId={id} />
                                                </>

                                            )
                                        }

                                        </>
                                    ) : (
                                        <>
                                            <h1 id='modal-title'></h1>
                                            <Login redirectInstructions={`/package/${id}`}/>
                                        </>
                                    )
                                }
                                </ModalCustom>
                            </section>
                        <section className='description'>
                            <h2>About this package</h2>
                            <p>{pack.description}</p>
                        </section>

                        <section className='service-contain'>

                            <section className='services'>
                                <h2>What services are included?</h2>
                                <section className='included'>
                                    {
                                        pack.Services?.length > 0 ? (
                                            pack.Services.map(x => {
                                                return x.included && (
                                                    <Badge>{x.serviceBody}</Badge>
                                                )
                                                
                                            })
                                        ) : (
                                            <h5>No Services</h5>
                                        )
                                    }
                                </section>
                            </section>
                            <section className='services'>
                                <h2>What services are not included?</h2>
                                <section className='not-included'>
                                    {
                                        pack.Services?.length > 0 ? (
                                            pack.Services.map(x => {
                                                return !x.included && (
                                                    <Badge>{x.serviceBody}</Badge>
                                                )
                                                
                                            })
                                        ) : (
                                            <h5>No Services</h5>
                                        )
                                    }
                                </section>
                            </section>
                        </section>
                    </>
                )
            }
        </div>
    )
}