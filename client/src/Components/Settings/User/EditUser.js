import React, { Component, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Tools/Context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ModalCustom from '../../ModalCustom'
import { Navigate, useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';


export default function EditUser() {

    const { authState, setAuthState, upUsername, updateProfilePicture, api } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState('')

    const [username, setUsername] = useState('')
    const [usernameFocus, setUsernameFocus] = useState(false)
    const [validUsername, setValidUsername] = useState(false)
    const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{3,14}$/

    const [pwd, setPwd] = useState('')
    const [validPwd, setValidPwd ] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)
    const [oldPwd, setOldPwd] = useState("")
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

    const navigate = useNavigate()
    const [image, setImage] = useState({ preview: '', data: '' })
    const [updateResponse, setUpdateResponse] = useState({status: true})

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
        }, [pwd, matchPwd])

    var user = {
        id: authState.id,
        username: username,
        type: 'usernameUpdate',
        role: authState.admin
    }

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username])




    const updateUsername = (e) => {
        e.preventDefault()

        if(username == "" || !validUsername) {
            setSuccess('')
            setErrMsg("Fill the input field and follow the instructions.")
        } else {
            upUsername(user)

            if (!authState.status) {
                console.log('Failed.')
                setErrMsg(authState.error)
            } else {
                setSuccess("Updated!")
            }
        }   
    }




    const pwdUpdate = async (e) => {
        e.preventDefault()

        var user = {
            id: authState.id,
            oldPwd: oldPwd,
            newPwd: pwd,
            type: 'pwdUpdate'
        }

        if(pwd && matchPwd && validMatch && oldPwd) {
            axios.put(`${api}/auth/update`, user, {
                headers: { token: localStorage.getItem('token')}
            })
            .then((response) => {
                if(response.data.error) {
                    setSuccess('')
                    navigate('/login')
                } else if(response.data.status.id) {
                    setErrMsg('')
                    setSuccess(response.data.status.text)
                } else {
                    setSuccess('')
                    setErrMsg(response.data.status.text)
                }
                
            })
        } else  {
            setSuccess('')
            setErrMsg("Fill the input fields correctly and follow the instructions.")
        }
    }

    const handleFileChange = (e) => {

        const img = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0]
        }

        setImage(img)
    }

    const updateProfileImage = (e) => {
        e.preventDefault()
    }

    

    
    return (
        <div className='edit-user-page animate__animated animate__fadeIn'>
            <h4 className='h5-response'>Edit your profile</h4>
            
            <section className='update-section'>
                <label className='sm-label'>Username </label>
                <h3 className='input-text'>{authState.username}</h3>
                <section className='modal-custom'>
                    <ModalCustom btnText='Update' btnClass='btn-primary'>
                    <h1 id='modal-title'>Update username</h1>
                    <p className='response-msg' id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                    <p className='response-msg' id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>
                        <form onSubmit={updateUsername}>
                            <p id='modal-lbl'>Your new username</p>
                            <input 
                                className='input-text-dark'
                                onChange={(e) => (
                                    setUsername(e.target.value),
                                    setErrMsg(''),
                                    setSuccess('')
                                )}
                                onFocus={() => setUsernameFocus(true)}
                                onBlur={() => setUsernameFocus(false)}
                            />
                            <p id="emConfNote" className={!validUsername ? "instructions" : "hide"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Minimum of 4 characters and maximum of 15. Must start with a letter and only accepts underscore.
                            </p>
                            <button 
                                className='btn-secondary'          
                            >Confirm update</button>
                        </form>
                    </ModalCustom>
                </section>
            </section>


                <section className='update-section'>
                    <label className='sm-label'>Password</label>
                    <h3 className='input-text'>••••••••</h3>
                    <section className='modal-custom'>
                        <ModalCustom btnText='Update' btnClass='btn-primary'>
                        <h1 id='modal-title'>Update password</h1>
                            <p id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                            <p id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>

                        <form onSubmit={pwdUpdate} id='pwd-update'>
                            <section>
                                <p id='modal-lbl'>Old password</p>
                                <input
                                    type='password' 
                                    onChange={(e) => (
                                        setOldPwd(e.target.value),
                                        setErrMsg(''),
                                        setSuccess(''),
                                        setPwd(''),
                                        setMatchPwd('')
                                    )}
                                    className='input-text-dark'
                                />
                            </section>
                                
                                
                            <section>
                                <p id='modal-lbl'>
                                    New password
                                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />                        
                                </p>
                                <input
                                    className='input-text-dark'
                                    id='i-pwd'
                                    type='password' 
                                    onChange={(e) => (
                                        setPwd(e.target.value),
                                        setErrMsg(''),
                                        setSuccess('')
                                    )}
                                    
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
                            <section>
                                <p id='modal-lbl'>
                                    Confirm your new password
                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                </p>
                                <input
                                    type='password' 
                                    className='input-text-dark'
                                    onChange={(e) => (
                                        setMatchPwd(e.target.value),
                                        setErrMsg(''),
                                        setSuccess('')
                                    )}
                                    id='input'
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
                                
                            <button className='btn-secondary'>Confirm update</button>
                        </form>
                        </ModalCustom>
                    </section> 
                </section>
        </div>
    )
}

