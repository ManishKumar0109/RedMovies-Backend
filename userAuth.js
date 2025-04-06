
const userInfoModel=require('./models/Model');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
      if(!req.cookies ||!req.cookies.token){
        throw new Error("");
      }
      const jwtToken = req.cookies.token;
      const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);
  
      const userData = await userInfoModel.findOne({ _id: decoded.userId })
        .select('name avatar _id emailId');
  
      if (!userData) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }
  
      req.userData = userData;
      return next();
    } catch (err) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }
  };
  
  module.exports = userAuth;
  