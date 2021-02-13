import React, { useContext, useState } from 'react';
import {Auth as AuthContext} from '../context/AuthContext';
import { AppBar, Container, IconButton, makeStyles, Toolbar } from '@material-ui/core';
import {useRequest} from '../hooks/request.hook';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAuth } from '../hooks/auth.hook';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
  }));

export const Menu = () => {
    const {cookies, name} = useContext(AuthContext);
    const {logout} = useAuth();

    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                {name}
                </Typography>
                <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}