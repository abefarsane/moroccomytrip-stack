import React, { Component, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Tools/Context/AuthContext';
import SearchBar from '../Tools/sComponents/SearchBar';
import axios from 'axios';
import CustomSlider from '../Tools/sComponents/CustomSlider';

export default function Home() {

    const { authState } = useContext(AuthContext)

    return (
        <div className='home-page'>
            <section className='home-header'>
                <h1>Plan your next trip with us</h1>
            </section>

            <section className='search-section'>
                <SearchBar />
            </section>

            <section className='slider'>
                <CustomSlider />
            </section>

            <section className='svg-section'>
            </section>
            
        </div>
    )
}