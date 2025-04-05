const validator=require('validator');

const Validation=(el)=>{
    const{emailId,password,name,avatar}=el;

    if(emailId && !validator.isEmail(emailId)){
        return false;
    }
    if(password && !validator.isStrongPassword(password)){
        return false;
    }
    if (cleanName && !/^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(cleanName)) {
        return false;
    }
    if(avatar && !['boy1.webp','girl1.webp'].includes(avatar)){
        return false;
    }
    return true;

}

module.exports=Validation