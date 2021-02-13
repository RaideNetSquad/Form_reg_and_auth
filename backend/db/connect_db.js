module.exports = async () => {
    //создание клиента для подключения к базе данных (через этот объект будет взаимодействие)
    const config = require('config');
    const {Client} = require('pg');
    
    const client = new Client({
        user: config.get('username'), 
        host: config.get('host'),
        database: config.get('database'),
        password: config.get('password'),
        port: config.get('port'),
    });
    await client.connect();
    return client;
}