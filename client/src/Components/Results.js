import axios from 'axios';
import React, { Component, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Tools/Context/AuthContext';
import SearchBar from '../Tools/sComponents/SearchBar'

export default function Results() {

    
    const { api } = useContext(AuthContext)
    
    let { search } = useParams()

    const navigate = useNavigate()
    
    let found = []
    const [ results, setResults ] = useState([])

    const [ urls, setUrls] = useState([])


    const getResults = () => {

        axios.get(`${api}/packages/all`)
            .then((response) => {
                if (response.data.status) {
                    response.data.packages.map(x => {
                        if ((x.title.toLowerCase()).includes(search.toLowerCase())) {
                            found.push(x)
                        }
                    })
                    setResults(found)
                    
                } else {
                    
                }
            })
    }

    
    useEffect(() => {
        getResults()
    }, [])


    return (
        <div className='results-page'>
            <h1 className='h1-header'>Here's your results</h1>
            <SearchBar />
            <section className='our-packages-results'>
            {
                
                results.length > 0 ? (
                    
                    results.map((x, key) => {

                        
                        //setPath(urls[key])
                        
                        
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
                    <h5 className='h5-response'>No packages available :(</h5>
                )
            }
            </section>
        </div>
    )
}