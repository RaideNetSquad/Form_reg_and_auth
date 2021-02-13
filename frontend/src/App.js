import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import {Auth as AuthContext} from './context/AuthContext';
import './App.css';
import {useRoutes} from './routes/routes';
import { useAuth } from './hooks/auth.hook';

import Cookies from 'universal-cookie';
import {Menu} from './components/Menu';
import { CircularProgress } from '@material-ui/core';

function App() { 
  let {cookies, isAuth, name} = useContext(AuthContext);

  const [auth_first, setAuthFirst] = useState(false);
  const [name_user, setNameUser] = useState(null);

  let {auth_once} = useAuth();

  cookies = new Cookies();

  
  useEffect(() => {
    const auth = async () => {
      //first check auth
      let res = await auth_once(cookies.get('token'), cookies.get('userId'));
      if(res){
        setNameUser(res.name);
        setAuthFirst(true);
      }

      setAuthFirst(res);
      console.log('useEffect')
    };

    auth();
  }, []);

  name = name_user;
  isAuth = auth_first;


  const routes = useRoutes(isAuth);
  
  return ( 
    <AuthContext.Provider value={{isAuth, cookies, name}}>
      <BrowserRouter>
        {isAuth && <Menu/>}
        <div>
        {
          routes
        }
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
