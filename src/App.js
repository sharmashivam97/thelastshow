import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";

function App() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(JSON.parse(localStorage.getItem("userProfile")));
    const direct = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );
    

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout(); // Fix: import `googleLogout` from `@react-oauth/google`
        setProfile(null);
        direct(`/`, {replace:true});
        localStorage.setItem("username", null);
        localStorage.setItem("userProfile", null);
    };
  return (
      <div>
          {profile ? (
              <div>
                <Layout logOut={logOut} profile={profile} user={user}/>
              </div>
          ) : (
            <>
              <header>
                <aside>
                  <button id="menu-button">
                    &#9776;
                  </button>
                </aside>
                <div id="app-header">
                  <h1>
                    <Link to="/notes">Lotion</Link>
                  </h1>
                  <h6 id="app-moto">Like Notion, but worse.</h6>
                </div>
                <aside>&nbsp;</aside>
              </header>
              <button id="sign-in" onClick={() => login()}>Sign in to Lotion with <img src="https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227" alt="Google logo" height="13px" width="13px"/></button>
            </>
          )}
      </div>
  );
}
export default App;
