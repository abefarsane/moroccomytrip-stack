import React, { Component, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../Tools/Context/AuthContext';

export default function DeleteChat({chatId}) {

    const [ errMsg, setErrMsg] = useState("")
    const [ success, setSuccess] = useState("")

    const { api } = useContext(AuthContext)

    useEffect(() => {
        console.log(chatId)
    }, [])

    const handleRequest = (e) => {
        e.preventDefault()
        
        axios.delete(`${api}/chat/deleteById/${chatId}`)
            .then((response) => {
                if (response.data.error) {
                    setErrMsg(response.data.error)
                } else {
                    setSuccess('Chat deleted!')
                }
            })

    }


    return (
        <section className='delete-chat'>
            <p className='response-msg' id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            <p className='response-msg' id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>
            <button className='delete-chat-btn' onClick={(e) => {
                handleRequest(e)
            }}>Delete</button>
        </section>
    )

}