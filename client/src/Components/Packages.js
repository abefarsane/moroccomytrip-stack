import axios, { all } from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../Tools/Context/AuthContext';
import SearchBar from '../Tools/sComponents/SearchBar'

export default function Packages() {
    
    let navigate = useNavigate()
    const [ allPackages, setAllPackages] = useState([])
    const [ urls, setUrls] = useState([])
    const [path, setPath] = useState("")

    const { api } = useContext(AuthContext)

    const defaultImg = `${api}/public/on-missing-image.jpg`

    const getPackages = () => {
        axios.get(`${api}/packages/all`)
            .then((response) => {
                if(response.data.status) {
                    setAllPackages(response.data.packages)
                } else {
                    setAllPackages(response.data.packages)
                }
            }) 
    }

    useEffect(() => {
        getPackages()
        console.log(allPackages)
    }, [])
    
    return (
        <div className='our-packages'>
            <h1 className='h1-header'>Our<br/>packages</h1>
            <SearchBar />
            <section className='our-packages-results'>
            {
                
                allPackages.length > 0 ? (
                    
                    allPackages.map((x, key) => {
                        
                        return (

                            <section className='single-package animate__animated animate__fadeIn section-style' key={key} onClick={() => {
                                navigate(`/package/${x.id}`)
                            }}>
                                <section className='pack-img'>
                                    {
                                        <img
                                            src={x.Images[0].urlPath}
                                        />          
                                    }
                                    
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
                    <h5>No packages available :(</h5>
                )
            }
            </section>
        </div>
    )
}