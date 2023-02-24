import { text } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../Tools/Context/AuthContext'
import UseEmail from "./UseEmail";

export default function RequestForm({ packageId } ) {

    const { authState , api} = useContext(AuthContext)

    const [ groupSize, setGroupSize ] = useState()
    const [ duration, setDuration ] = useState()
    const [ textBody, setTextBody ] = useState("")

    const [ errMsg, setErrMsg] = useState("")
    const [ success, setSuccess] = useState("")

    const {
        loading,
        submitted,
        error,
        sendEmail
      } = UseEmail("https://public.herotofu.com/v1/c45dede0-a791-11ed-a31e-753411848f80");

    const handleRequest = (e) => {
        e.preventDefault()
        
        if ( !groupSize || !duration || !textBody) {
            setErrMsg("Fill all the fields.")
        } else {

            const requestData = textBody + "_" + duration + "_" + groupSize + "_" + authState.email 

            const body = {
                packageId: packageId,
                textBody: requestData,
                sender: authState.id
            }
            
            axios.post(`${api}/messages/new`, body, {
                headers: { token: localStorage.getItem('token')}
            }).then((response) => {
                if (response.data.error) {
                    setSuccess('')
                    setErrMsg(response.data.error)
                } else {


                      sendEmail("You have a new booking request from " + (authState.username + "(" + authState.email + ")") + " " + textBody);

                      setSuccess(response.data.message)

                    
                }
            })

        }


    }

    useEffect(() => {
        
    }, [])




    return (
        <div className='request-form'>

            <p className='response-msg' id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            <p className='response-msg' id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>

            <form onSubmit={handleRequest}>
                <section>
                    <h4 className='input-label'>
                        Message
                    </h4>
                    <textarea
                        value={textBody}
                        className='input-text-dark'
                        onChange={(e) => {
                            setTextBody(e.target.value)
                        }}
                    />
                </section>
                
                <section>
                    <h4 className='input-label'>
                        Preferred number of days
                    </h4>
                    <input
                        value={duration}
                        onChange={(e) => {
                            setDuration(e.target.value)
                        }}
                        type='number'
                        min='2'
                        max='8'
                        className='input-text-dark'
                    />
                </section>
                <section>
                    <h4 className='input-label'>
                        Size of your group
                    </h4>
                    <input
                        onChange={(e) => {
                            setGroupSize(e.target.value)
                        }}
                        value={groupSize}
                        type='number'
                        min='1'
                        max='60'
                        className='input-text-dark'
                    />
                </section>
                <button className='btn-secondary'>
                    Send request
                </button>
            </form>
        </div>
    )
}