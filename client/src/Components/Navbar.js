import React, { Component, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Tools/Context/AuthContext';
import './ComponentsStyle.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavBar() {

    const {authState, setAuthState, logOut} = useContext(AuthContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        logOut()
        navigate('/')
    }


    return ( 
        <Navbar expand="lg">
                <Navbar.Brand sticky="top" href="/">MoroccoMyTrip</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/packages">Our packages</Link>
                        <Link to="/about">About us</Link>
                        {!authState?.status ? (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link>
                            </>
                            
                        ) : ( 
                            <>
                                <Link to="/settings">Settings</Link>
                                <Link onClick={handleLogout}>Logout</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    )
}