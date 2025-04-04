
const express=require('express');
const dbConnection=require('./models/dbConnection');
const bcrypt = require('bcrypt');
const userInfoModel=require('./models/Model');

const app=express();

app.post('/signup',async(req,res,next)=>{
    const{emailId,password,name,avatar}=req.body
    const saltRounds=10;
    
    if(!Validation(emailId,password,name,avatar)){
        const error=new Error('Invalid Credentials');
        error.statusCode=400;
        throw error;
    }
    try{
    const encryptedPassword=await bcrypt.hash(password,saltRounds);
    const check=await userInfoModel.findOne({emailId:emailId});

    if(check){
        return res.redirect('/login');
    }
    const data=new userInfoModel({emailId,password:encryptedPassword,name,avatar});
    await data.save()}
    catch(e){
        const error=new Error('Internal Server Error');
        error.statusCode=500;
        throw error;
    }
})




dbConnection().then(()=>{
    app.listen(3000,()=>{
        console.log('babe your app is listening ....');
    })
})
.catch((err)=>{
    console.log('Could not connect to db')
})



