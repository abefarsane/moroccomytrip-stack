import React, { Component, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faBoxArchive, faCircleUser, faCommentDots, faCropSimple, faDotCircle, faEllipsis, faListDots } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../../../Tools/Context/AuthContext'
import ModalCustom from '../../../ModalCustom';
import DeleteChat from '../View/DeleteChat';
import { io } from 'socket.io-client';

export default function Incoming() {

    const [chat, setChat] = useState([])
    const [senderInfo, setSenderInfo] = useState([])
    const navigate = useNavigate()
    const { authState, setSocket, api } = useContext(AuthContext)
    const socket = io.connect(api)

    const [toRead, setToRead] = useState(true)


    const getMessages = () => {
        axios.get(`${api}/chat/byUserId/${authState.id}`)
            .then((response) => {
                if (response.data.error) {

                } else {
                    setChat(response.data)
                }
            })
    }

    const updateToRead = (id) => {
        axios.put(`${api}/chat/updateToRead/${id}`)
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error)
                } else {
                    console.log('Updated!')
                }
            })
    }

    const test = (x) => {

        if (x.toRead) {
            if (x.Messages[x.Messages.length - 1].UserId == authState.id) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    useEffect(() => {
        getMessages()
    }, [])



    //x.textBody.split('_')[0].slice(0, 30).concat('...')

    return (
        <section className='incoming-messages'>
            <h2 className='h5-response'>Booking requests</h2>
            <section className='messages'>
            {
                chat.length > 0 ? (
                    
                    chat.map(  (x, key) => {


                        return (
                            <section className='single-message'>
                                    <section className='message-details' onClick={() => {
                                navigate(`/chat/${x.id}`)
                                socket.emit('join_chat', x.id)
                                setSocket(socket)
                                updateToRead(x.id)
                            }}>
                                {
                                    authState.admin ? (
                                        <h5>{x?.Package?.title}</h5>
                                    ) : (
                                        <h5>{x?.Package?.title}</h5>
                                    )
                                }

                                    </section>

                                    <ModalCustom btnText={<FontAwesomeIcon icon={faEllipsis} />} btnClass="options-chat">
                                    <h1 id='modal-title'>Delete chat</h1>
                                        <DeleteChat chatId={x.id}/>
                                    </ModalCustom>

                                    {
                                        test(x) && (
                                            <span className='notification animate__animated animate__flash'></span>
                                        )
                                    }
                            </section>
                        )
                    })

                ) : (
                    <p>No booking requests to show.</p>
                )
            }
    
            </section>
        </section>
    )
}