import axios from 'axios';
import React, { useContext} from 'react'
import { Redirect } from 'react-router';
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
    const [loggedIn, toggleAuthentication] = useContext(AuthContext);
    function handleLogout() {
        axios.get('/auth/logout').then(response => {
            if(response.data.message === "Logout Succesful") {
                toggleAuthentication();
            }
        });
    }
    if(!loggedIn.Authenticated) return (<Redirect to="/"/>);
    return (
        <div>
            Dashboard
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
