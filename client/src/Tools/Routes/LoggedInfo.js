import React, { useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';

export default function LoggedInfo() {

    return (
        <div className='already-logged'>
            <h1>You are already logged in, log out to login into another account or to create a new one. </h1>
        </div>
    )
}