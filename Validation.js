const validator=require('validator');

const AvatarOptionsSrc = [
    'boy1.webp',
    'boy2.webp',
    'boy3.webp',
    'boy4.webp',
    'boy5.webp',
    'boy6.webp',
    'boy7.webp',
    'boy8.webp',
    'boy9.webp',
    'boy10.webp',
    'girl1.webp',
    'girl2.webp',
    'girl3.webp',
    'girl4.webp',
    'girl5.webp',
    'girl6.webp',
    'girl7.webp',
    'girl8.webp',
    'girl9.webp',
];
const Validation=(el)=>{
    const{emailId,password,name,avatar}=el;
    

    if(emailId && !validator.isEmail(emailId)){
        return false;
    }
    
    if(password && !validator.isStrongPassword(password)){
        return false;
    }
    
    if (name && !/^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(name)) {
        return false;
    }
    
    if(avatar && !AvatarOptionsSrc.includes(avatar)){
        return false;
    }
    
    return true;

    
}

module.exports=Validation