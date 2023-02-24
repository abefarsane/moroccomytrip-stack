import React, { Component, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Tools/Context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {

    const { api } = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [usernameFocus, setUsernameFocus] = useState(false)
    const [validUsername, setValidUsername] = useState(false)

    axios.defaults.withCredentials = true

    const [email, setEmail] = useState('')


    const [emailConf, setEmailConf] = useState('')
    const [emailConfFocus, setEmailConfFocus] = useState(false)

    const [emailMatch, setEmailMatch] = useState(false)
    const [matchEmailFocus, setEmailFocus] = useState(false)




    const [pwd, setPwd] = useState('')
    const [validPwd, setValidPwd ] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)



    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    
    const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{3,14}$/
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext)

    /*VALIDATION FOR USERNAME, PASSWORD AND EMAIL*/ 

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username])


    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setEmailMatch(email === emailConf);
    }, [email, emailConf])

    /*SETTING ERROR */ 
    useEffect(() => {
        setErrMsg('')
    }, [pwd, matchPwd, email, emailConf])




    //onsubmit stuff that happens

    const handleSubmit = (e) => {

        const password = PWD_REGEX.test(pwd)


        if (!emailMatch || !password || !matchPwd || !username || !validMatch) {
            e.preventDefault()
            setErrMsg("Fill the inputs correctly by following the indications.");
            return;
        } else {
            e.preventDefault()
            const user = {
                email: email,
                username: username,
                pwd: pwd
            }
            axios.post(`${api}/auth/signup`, user ).then((response) => {
                if(response.data.status) {
                    navigate('/login');
                } 
            })
        }
    } 
    // FINISH TESTING STUFF
    


    return (
        <div className='signForm'>
            <section className='header'>
                <section>
                    <h1 className='h1-header'>Sign up</h1>
                    <h2 className='sub-title'>Fill out your details</h2>
                </section>
                <p id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            </section>

            <form onSubmit={handleSubmit}>

                <section id='username'>
                    <h4 className='sm-label'>
                        Your username
                        <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={!validUsername ? "invalid" : "hide"} />
                    </h4>
                    <input
                        type='text'
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        className='input-text'
                        required
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                        id='input'
                        ></input>
                        <p id="emConfNote" className={!validUsername   ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Minimum of 4 characters and maximum of 15. Must start with a letter and only accepts underscore.
                        </p>
                </section>






                <section id='email'>
                <h4 className='sm-label'>email</h4>
                    <input
                        type='email' 
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        className='input-text'
                        required
                    />
                </section>
                <section id='confemail'>
                <h4 className='sm-label'>
                        Confirm your email
                        <FontAwesomeIcon icon={faCheck} className={emailMatch && emailConf ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={!emailMatch ? "invalid" : "hide"} />
                    </h4>
                    <input
                        type='email'
                        onChange={(e) => {
                            setEmailConf(e.target.value)
                        }}
                        required
                        onFocus={() => setEmailConfFocus(true)}
                        onBlur={() => setEmailConfFocus(false)}
                        className='input-text'
                        ></input>
                        <p id="emConfNote" className={!emailMatch   ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first email input field.
                        </p>
                </section>



                <section id='pwd'>
                <h4 className='sm-label'>
                        Password
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />                        
                    </h4>
                    <input
                        type='password' 
                        onChange={(e) => {
                            setPwd(e.target.value);
                        }}
                        required
                        className='input-text'
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby='pwdnote'
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.
                        Must include uppercase and lowercase letters, a number and a special character.
                        Allowed special characters: 
                        <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                </section>
                <section id='confpwd'>
                <h4 className='sm-label'>
                        Confirm your password
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </h4>

                    <input
                        id='input'
                        type='password' 
                        className='input-text'
                        onChange={(e) => {
                            setMatchPwd(e.target.value);
                        }}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>
                </section>
                
                <h5 className='h5-response'>Already have an account? <a href='/login'>Login</a></h5>
                <button id='submit' className='btn-primary'>Sign up</button>
            </form>
        </div>
    )
}