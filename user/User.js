const express = require('express');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const db = require('../lib/db');
const app = express();

app.use(session({
    key:"sid",
    secret:'Secret',
    resave:false,
    saveUninitialized:true,
    store:new MySQLStore({
        host:'localhost',
        port:3306,
        user:'root',
        password:'111111',
        database:'diary'
    })
}));

function User() {

    /////////////////////////////// CREATE ////////////////////


    ////////////////////////////// READ //////////////////////


    /**
     * idx 로 User를 가져온다.
     */
    this.getUserByIdx = function(idx) {
        // #. db Query로 User 객체 하나를 가져온다.
        // #. User를 리턴하되, 없으면 null을 가져온다.
    }

    this.getUserByEmail = function(email) {
        let user = null;
        let data = await db.query(`SELECT * FROM user WHERE email = ?`, [email], function(error, results, fields){
            if(error) {
                throw error;
            }
            console.log(results[0]);
            user = results[0];
        });
        console.log(data);
        return user;
    }


    ///////////////////////////// UPDATE ////////////////////////


    ///////////////////////////// DELETE ////////////////////////


}


module.exports=User;