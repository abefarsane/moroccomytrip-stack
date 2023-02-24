import React, { createContext, useState , useEffect} from "react";
import axios from 'axios'

export const AuthContext = createContext("")


export const AuthContextProvider = ({children}) => {


    const api = "https://morocco-my-trip-api.herokuapp.com"
    

    const [authState, setAuthState] = useState({
        email: "",
        username: "",
        id: 0,
        status: false,
        admin: '0'
    })

    const logOut = () => {
        localStorage.removeItem('token')
        setAuthState({ ...authState, status: false})
    }

    const [socket, setSocket] = useState()

    const upUsername = (user) => {

        checkAuth()

        if (authState.status) {
            axios.put(`${api}/auth/update`, user, {
                headers: { token: localStorage.getItem("token") }
            })
            .then((response) => {
                if(response.data.error) {
                    
                } else {
                    setAuthState({...authState, 
                        username: response.data.username
                    })
                    return {
                        status: true
                    }
                }
            })
        } else {
            return {
                status: false
            }
        }
    }


    const checkAuth = () => {
        axios.get(`${api}/auth/check`, {
            headers: {
                token: localStorage.getItem("token")
            }
        }).then((response) => {
            
            if (response.data.error) {
                setAuthState({
                    status: false
                })
            } else {
                setAuthState({
                    id: response.data.id,
                    status: true,
                    admin: response.data.admin,
                    username: response.data.username,
                    email: response.data.email
                })
            }
        })
    }

    
    useEffect(() => {
        checkAuth()
        axios.get(`${api}/auth/check`, {
            headers: {
                token: localStorage.getItem("token")
            }
        }).then((response) => {
            
            if (response.data.error) {
                setAuthState({
                    status: false
                })
            } else {
                setAuthState({
                    id: response.data.id,
                    status: true,
                    admin: response.data.admin,
                    username: response.data.username,
                    email: response.data.email
                })
            }
        })
    }, [])
    
    return (
        <AuthContext.Provider value={{ authState, setAuthState, logOut, upUsername, socket, setSocket, api }}>
            { children }
        </AuthContext.Provider>
    )

}