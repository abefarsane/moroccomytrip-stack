import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoutes = ({ allowedRoles }) => {
    
    const { authState } = useContext(AuthContext)
    console.log(authState)
    

    if (allowedRoles == 2000) {
        return authState.status ? <Outlet /> : <Navigate to='/login' />
    } else if (allowedRoles == 2001) {
        return authState.status && authState.admin ? <Outlet /> : <Navigate to='/not-authorized' />
    }
        

}


export default PrivateRoutes