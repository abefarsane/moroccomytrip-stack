import React, { useState, useRef, useEffect, useContext, Component } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Tools/Context/AuthContext';


export default function Login({ redirectInstructions }) {

    const [email, setEmailLog] = useState('')
    const [pwd, setPwdLog] = useState('')
    const [loginStatus, setLogin] = useState("Not logged");
    
    const navigate = useNavigate();
    const {setAuthState, api} = useContext(AuthContext)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState('')


    /*SETTING ERROR */ 
    useEffect(() => {
        setErrMsg('')
    }, [])
    /* SETTING SUCCESS */
    useEffect(() => {
        setSuccess('')
    }, [])

    const login = (e) => {
        e.preventDefault() 

        const data = {
            email: email,  
            pwd: pwd
        }
        Axios.post(`${api}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response)=> {
            if(response.data.error) {
                setErrMsg(response.data.error)
            } else {
                localStorage.setItem("token", response.data.token)
                setAuthState({email: response.data.email, id: response.data.id, status: true, username: response.data.username, admin: response.data.admin})

                if (redirectInstructions == null) {
                    navigate('/');
                } else {
                    navigate(redirectInstructions)
                }

            }
            
        })
    }
    

    return (
        <div className="log-form contain-desktop">

            <section className='header'>
                <section>
                    <h1 className='h1-header'>Login</h1>
                    <h2 className='sub-title'>Fill out your details</h2>
                </section>
                <p id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            </section>

                <form onSubmit={login}>
                    <section>
                        <h4 className='sm-label'>Email</h4>
                        <input
                            className='input-text'
                            type='email' 
                            onChange={(e) => {
                                setEmailLog(e.target.value);
                            }}
                            value={email}
                            required
                        />
                    </section>
                    <section className='pwd'>
                        <h4 className='sm-label'>Password</h4>
                        <input
                            className='input-text'
                            type='password'
                            onChange={(e) => {
                                setPwdLog(e.target.value);
                            }}
                            required
                        />
                    </section>
                    <section>
                        <h5 className='h5-response'>Don't have an account yet?<br/> <a href='/signup'>Sign up</a></h5>
                        <button className='btn-primary'>Login</button>
                    </section>
                    
                </form>
            </div>
    )
}