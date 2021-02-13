import { useCallback, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Auth as AuthContext } from '../context/AuthContext';
import { useRequest } from './request.hook';

export const useAuth = () => {
    
    let {requests} = useRequest();

    const {cookies} = useContext(AuthContext);

    const auth_once = useCallback(async (token, userId) => {
        let d = {token: token, userId: userId};
        let data = await requests('auth', 'POST', d, {'Content-Type': 'application/json'});
        if(data.access === true){
            return data.data;
        };
        return false;
    }, []);

    const login = useCallback(async (data) => {
        //login authentificate
        const res = await requests("/login", 'POST', data, {'Content-Type': 'application/json'});
    
        return res;
    });

    const logout = useCallback(() => {
        cookies.remove('token');
        cookies.remove('userId');
        window.location.reload();
    })
    
    return {login, logout, auth_once};
};