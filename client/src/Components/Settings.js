import React, { Component, useContext, useState, useEffect} from 'react';
import { Modal, Button } from 'react-bootstrap'
import { AuthContext } from '../Tools/Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPackage, faEnvelope, faCubes } from '@fortawesome/free-solid-svg-icons'
import EditUser from './Settings/User/EditUser'
import EditPackage from './Settings/Package/EditPackage';
import Messages from './Settings/Communication/Messages';

export default function Settings( {target}, {trg}) {

    const { authState } = useContext(AuthContext)
    const [ toDisplay, setToDisplay ] =  useState(target || <EditUser />)


    useEffect(() => {
        document.getElementById('user').classList.add('selected')
    }, [])

    return (
        <div className='settings-page'>
            <h1 className='h1-header'>Settings</h1>
            <p className='sm-comment'>Manage all of your affairs here</p>

            <section className={authState.admin ? 'settings-options' : 'settings-options options-normal'}>
                <section id='user' onClick={() => {
                        setToDisplay(<EditUser />)
                        document.getElementById('user').classList.add('selected')
                        document.getElementById('messages').classList.remove('selected')
                        document.getElementById('package')?.classList.remove('selected')
                    }}>
                    <FontAwesomeIcon icon={faUser} />
                </section>
                {authState.admin && (
                    <section id='package' onClick={() => {
                        setToDisplay(<EditPackage />)
                        document.getElementById('package')?.classList.add('selected')
                        document.getElementById('user').classList.remove('selected')
                        document.getElementById('messages').classList.remove('selected')
                    }}> 
                        <FontAwesomeIcon icon={faCubes} />
                    </section>
                )}
                <section id='messages' onClick={() => {
                        setToDisplay(<Messages />)
                        document.getElementById('messages').classList.add('selected')
                        document.getElementById('user').classList.remove('selected')
                        document.getElementById('package')?.classList.remove('selected')
                }}>
                    <FontAwesomeIcon icon={faEnvelope} />
                </section>
            </section>


            <section className='settings-display'>
                {toDisplay}
            </section>
        </div>
    )
}