
const express=require('express');
const dbConnection=require('./models/dbConnection');
const bcrypt = require('bcrypt');
const userInfoModel=require('./models/Model');
const jwt=require('jsonwebtoken');
const userAuth = require('./userAuth');
require('dotenv').config();
const Validation = require('./Validation')

const app=express();

app.post('/signup',async(req,res,next)=>{
    const{emailId,password,name,avatar}=req.body
    const saltRounds=10;
    
    if(!emailId|| !password|| !name||!avatar||!Validation({emailId,password,name,avatar})){
        const error=new Error('Invalid Credentials');
        error.statusCode=400;
        next(error);
    }
    const cleanName = name.trim().replace(/\s+/g, ' ');
    try{
    const encryptedPassword=await bcrypt.hash(password,saltRounds);
    const check=await userInfoModel.findOne({emailId:emailId});

    if(check){
        return res.redirect('/login');
    }
    const data=new userInfoModel({emailId,password:encryptedPassword,name:cleanName,avatar});
    await data.save();
    res.status(201).json({message:"SignUp successfull"});
}
    catch(e){
        const error=new Error('Internal Server Error');
        error.statusCode=500;
        return next(error);
    }
})

app.post('/login',async(req,res,next)=>{
    try{
    const{emailId,password}=req.body;
    if(!email ||!password ||!Validation({emailId,password})){
        const error=new Error('Invalid Credentials');
        error.statusCode=400;
        return next(error);
    }
    const data = await userInfoModel.findOne({emailId:emailId});
    if(!data){
        const error=new Error('Wrong credentials');
        error.statusCode=400;
        return next(error);
    }
    const check = await bcrypt.compare(password,data.password)
    if(!check){
        const error=new Error('Wrong Credentials');
        error.statusCode=400;
        return next(error);
    };
    const secretKey=process.env.SECRET_KEY;
    const jwtToken=jwt.sign({userId:data._id},secretKey,{expiresIn:'7d'})
    res.cookie('token',jwtToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        maxAge:7*24*60*60*1000,
        sameSite:'strict',
    })
    res.status(201).json({message:'login successfully'});
}
    catch(err){
        const error=new Error('Internal Server Error');
        error.statusCode=500;
        return next(error);
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



