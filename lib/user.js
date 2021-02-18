const db=require('./db');

exports.login=function(request, response){
    let email=request.body.email;
    let password=request.body.password;
    db.query('SELECT * FROM user WHERE email = ?', [email],
    function( error, results, fields) {
        if (error) {
            response.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if(results.length > 0) {    //그 이메일로 된 pw가 있다는 것
                if(results[0].password == password) {
                    response.redirect('/home');
                } else {
                    response.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                response.send({
                    "code":204,
                    "success": "Email does not exists"
                });
            }
        }    
    });
}