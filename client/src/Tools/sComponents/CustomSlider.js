import axios from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../Context/AuthContext'

export default function CustomSlider () {


    const [packages, setPackages ] = useState([])
    const { api } = useContext(AuthContext)

    const getPackages = () => {
        axios.get(`${api}/packages/all`)
            .then((response) => {
                setPackages(response.data.packages)
            })
    }

    const navigate = useNavigate()


    useEffect(() => {
        getPackages()
    }, [])

    return (
        <section className='slider-section'>
            {
                packages.length > 0 ? (
                    packages.slice(0, 3).map((x, key) => {
                        return (
                            <section className='slider-item single-package' onClick={() => {
                                navigate(`/package/${x.id}`)
                            }}>
                                <section className='slider-img'>
                                    <img src={x.Images[0].urlPath} width="100px" height='70px'/>
                                </section>
                                <section className='pack-data'>
                                    <section className='pack-details-cl1'>
                                        <h4>{x.title}</h4>
                                        <h5>{x.duration} {x.duration > 1 ? "DAYS" : "DAY"}</h5>
                                    </section>
                                    
                                    <section className='pack-details-cl2'>
                                        <h4>€{x.price}</h4>
                                        <h5>{x.people + (x.people > 1 ? " PEOPLE " : " PERSON ")}</h5>
                                    </section>
                                </section>   
                            </section>
                        )
                    })
                ) : (
                    <></>
                )
            }
        </section>
    )
}


export function CustomSliderServices({ children }) {

    return (
        <section className='slider-section'>
            {children}
        </section>
    )


}