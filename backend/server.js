(
    async () => {
        const config = require('config');
        const express = require('express');
        const redis = require('redis');
        const connector = require('./db/connect_db');

        const app = express();

        app.use(express.json());

        const clientRedis = redis.createClient();

        clientRedis.on('connect', () => {
            console.log('Connectn with redis');
        }); 

        app.use(function (req, res, next){
            try {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            } catch (error) {
                next();
            }
        });  
         
        try {
            const db = await connector();

            app.use('/', require('./routes/auth_routes')(db, clientRedis));

            app.listen(config.get("port_app"), () => {
                console.log(`I listen port on ${config.get("port_app")}`);
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
)();