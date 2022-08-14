const express = require('express');
const app = express();

const DatosArray = require('./api.js');
const DbUser = new DatosArray();

/*testing*/

DbUser.guardar({username:'enrique'});
DbUser.guardar({username:'gabriel'});
DbUser.guardar({username:'tere'});

DbUser.guardarExcercise(1,new Date().toDateString(),10,'hablar');
DbUser.guardarExcercise(1,new Date(Date.now() + (3600 * 1000 * 24)).toDateString(),20,'comer');
DbUser.guardarExcercise(1,new Date(Date.now() + (3600 * 1000 * 48)).toDateString(),30,'nadar');
DbUser.guardarExcercise(1,new Date(Date.now() + (3600 * 1000 * 72)).toDateString(),40,'dormir');

/* ----------- middleware ----------- */

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ------------- mehtods ------------ */


app.get('/api/users',(req,res)=>{

    res.json(DbUser.listarTodoUsers());

});

app.post('/api/users',(req,res)=>{
    let {username} = req.body;

    let newId = DbUser.guardar({username:username});

    res.json({
        username: username,
        _id: newId.toString()
    })
});

app.post('/api/users/:_id/exercises',(req,res)=>{

    let {_id} = req.params;
    let {description,duration,date} = req.body;

    if(!date){
        date=new Date().toDateString();
    }else{
        date=new Date(date).toDateString();
    }

    let id=parseInt(_id);

    let exercise = DbUser.guardarExcercise(id,date,duration,description);

    res.json(
        exercise
    );

});

app.get('/api/users/:_id/logs',(req,res)=>{
    let {_id} = req.params;

    let {from,to,limit} = req.query;

    res.json(
        DbUser.listarPorId(parseInt(_id),from,to,limit)
    );

});

/* ------------ listener ------------ */

const port = 8080;

const server = app.listen(port,()=>console.log('escuchando el puerto '+port));
server.on('error',error =>console.log('ocurrio un error'+error));