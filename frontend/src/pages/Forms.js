import React, { useContext, useState } from 'react';
import {Auth as AuthContext} from '../context/AuthContext';
import { Container, makeStyles } from '@material-ui/core';
import {useRequest} from '../hooks/request.hook';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAuth } from '../hooks/auth.hook';
import { Redirect } from 'react-router-dom';
import { useMessage } from '../hooks/message.hook';


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
      margin: '0 auto'
    },
  }));

export const Forms = () => {
    const {cookies} = useContext(AuthContext);
    const {login} = useAuth();
    const [data, setData] = useState({
        name: '',
        login_user: '',
        password: '',
        email: '',
        phone: ''
    })
    //i check user
    let [auth, setAuth] = useState(false);
    const [message_watch, setMessage] = useState(false);
    const [res_data, setDataMessage] = useState(false);

    const classes = useStyles();
    //function for request to node.js
    const {requests} = useRequest();
    const message = useMessage();

    const registerHandler = async () => {
        //register authorizate
        const res = await requests("/register",'POST',data, {'Content-Type': 'application/json'});
        setMessage(true);
        setDataMessage(res);
    };

    const loginHandler = async () => {
        const res = await login(data);
        setMessage(true);
        setDataMessage(res);
        cookies.set('token', res.token, { path: "/"});
        cookies.set('userId', res.userId, { path: "/"});
        console.log(res);
        if(res.access){
            setTimeout(() => {
                window.location.reload();
            }, 500)
        }
    };
    
    const setLoginRed = () => {
        if(!auth){return 'secondary'};
    };
    const setRegisterRed = () => {
        if(auth){return 'secondary'};
    };
    const checkHandlerLogin = (event) => {
        event.preventDefault();
        if(auth === true)
        {
            setMessage(false)
            setAuth(false);
        }else{
            loginHandler(event);
        }
    };
    const checkHandlerRegister = (event) => {
        event.preventDefault();
        if(auth === false)
        {
            setMessage(false)
            setAuth(true);
        }else{
            registerHandler();
        }
    };

    return (
        <Container maxWidth="sm">
            <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <Typography gutterBottom variant="h5" component="h2">
                            {auth || 'Login'}
                            {auth && 'Register'}
                            {message_watch && message(res_data)}
                        </Typography>
                    </div>
                    <div>
                        <TextField 
                            label="Your login" 
                            name="login" 
                            id="login" 
                            onChange={(e) => setData({...data, login_user: e.target.value})}
                            required
                        />
                    </div>
                {auth && 
                    <div>
                        <TextField 
                            label="Your name" 
                            name="name" 
                            id="name" 
                            onChange={(e) => setData({...data, name: e.target.value})}
                            required
                        />
                    </div>
                }
                <div>
                    <TextField 
                        label="Your password" 
                        name="password" 
                        id="password" 
                        onChange={(e) => setData({...data, password: e.target.value})}
                        required
                    />
                </div>
                {auth && 
                    <div>
                        <TextField label="Your password (repeat)" name="password_next" id="password_next" required/>
                    </div>
                }
                {auth && 
                    <div>
                        <TextField 
                            label="Your phone" 
                            name="phone" 
                            id="phone" 
                            onChange={(e) => setData({...data, phone: e.target.value})}    
                        />
                    </div>
                }
                <div>
                    <Button variant="outlined" color={setLoginRed()} onClick={(e) => {checkHandlerLogin(e)}}>
                        Login
                    </Button>
                    <Button variant="outlined" color={setRegisterRed()} style={{'marginLeft': '5px'}} onClick={(e) => {checkHandlerRegister(e)}}>
                        Register
                    </Button>
                </div>
            </form>
        </Container>
    )
}