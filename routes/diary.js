const express=require('express');
const router=express.Router();
const app=express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

router.get('/create', function(request, response){
});

module.exports=router;