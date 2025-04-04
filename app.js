
const express=require('express');
const dbConnection=require('./models/dbConnection')

const app=express();

app.use('/',async(err,req,res,next)=>{
    req.send('error happen')
    
})


dbConnection().then(()=>{
    app.listen(3000,()=>{
        console.log('babe your app is listening ....');
    })
})
.catch((err)=>{
    console.log('Could not connect to db')
})



