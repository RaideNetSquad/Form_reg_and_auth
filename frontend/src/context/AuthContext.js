import {createContext} from 'react';

export const Auth = createContext({
    cookies: null,
    isAuth: null, 
    name: null
})