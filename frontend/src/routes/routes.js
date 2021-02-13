import React, { useContext } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {Auth as AuthContext} from '../context/AuthContext';
import {Main} from '../pages/Main';
import {Forms} from '../pages/Forms';

export const useRoutes = (isAuth) => {

    if(isAuth)
    {
        return(
            <Switch>
                <Route path="/" exact>
                    <Main/>
                </Route>
                <Redirect to="/" exact/>
            </Switch>
        )
    };
    return(
        <Switch>
            <Route path="/auth" exact>
                <Forms/>
            </Route>
            <Redirect to="/auth" exact/>
        </Switch>
    )
}