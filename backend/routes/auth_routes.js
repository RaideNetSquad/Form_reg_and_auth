const {Router, request} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (db, clientRedis) => {
    const secret_k = config.get("secret_key");
    const router = Router();
/*    //get data
    router.get('', async (req, res) => {
        const {userId, token} = req.body;

        const token_exitsts = await jwt.verify(token, secret_k);
        if(token_exitsts)
        {
            res.status(200).json({message: "Hello"});
        }
        res.status(401).redirect("/login");

    })*/
    //login
    router.post(
        '/login',
        async (req, res) => {
            try {
                const {login_user, password} = req.body;
 
                const results = await db.query("SELECT * FROM public.login WHERE login_user = $1", [login_user]);
                const {id, password_hash} = results.rows[0];
                const valid = await bcrypt.compare(password, password_hash);
            
                
                if(valid){
                    //jwt create token
                    const token = jwt.sign(
                        {userId: id}, 
                        secret_k,  
                        { expiresIn: '1h'}); 
                    //set token to radis  
                    clientRedis.set(id, token);  
                      
                    res.status(200).json({ access: true, userId: id, token: token, message: "Авторизация успешно пройдена"});
                }   

                
            } catch (error) {
                res.status(404).json({ access: false, message: 'Ошибка входа, проверьте правильность введенных данных.'})   
            }
        }
    );
    //register
    router.post(
        '/register',
        async (req, res) => {
            try { 
                console.log(req.body);
                const {name, login_user, email, phone, password} = req.body;
                
                const password_hash = await bcrypt.hash(password, 12);

                const results = await db.query('INSERT INTO public.login (name, email, phone, login_user, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                                                    [name, email, phone, login_user, password_hash]);
                if(results.rows[0].id){
                    res.status(201).json({ message: "Пользователь создан"})
                    return;
                }
                
                
            } catch (error) {
                console.log(error);
                res.status(200).json({ message: "Пользователь уже существует, введите другие данные" })   
            }
            
            
        }
    )
    
    router.post('/auth', async (req, res) => {
        const {token, userId} = req.body;

        let access_token = false;
        let id = await clientRedis.get(userId, async (err, data) => {
            if(data){
                const jwt_verify = await jwt.verify(data, secret_k); 
                if(jwt_verify)
                {
                    const results = await db.query("SELECT * FROM public.login WHERE id = $1", [userId]);
                    const {login_user, name} = results.rows[0]; 
                    console.log(results.rows);
                    res.json({access: true, data: {
                        login_user, name 
                    }}); 
                    return; 
                }  
            }  
            res.json({access: false});  
        }); 
    })               
    return router;    
} 