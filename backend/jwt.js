import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const token = jwt.sign({_id : user._id , role : user.role , email : user.email} , process.env.JWT_SECRET ,
     {
      expiresIn : process.env.ACCES_TOKEN_EXPIRES
    }
  );

return token;


}
export const generateRefreshToken = (user) => {
const token = jwt.sign({_id : user._id , role : user.role , email : user.email} , process.env.JWT_REFRESH_SECRET , 

  {
    expiresIn : process.env.REFRESH_TOKEN_EXPIRES
  }
);
return token;

}