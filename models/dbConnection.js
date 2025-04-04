

const dbConnection=async()=>{
    
const mongoose=require('mongoose');
    require('dotenv').config();
    const uri=process.env.MONGOOSE_URI;
    try{
        await mongoose.connect(uri); }
    catch(err){
        console.log("could not connect to db");
    }
}
module.exports=dbConnection;
