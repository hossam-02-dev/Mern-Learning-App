import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../jwt.js";
import { generateRefreshToken } from "../jwt.js";
import jwt from "jsonwebtoken";

export const Registeruser = async (req,res) => {
const {name , email , password , role } = req.body;

try {
if (!name || !email || !password || !role ) {
return res.status(400).json({success : false , message : "Veuillez remplir tous les champs."});
}
const ExistingUser = await User.findOne({email});
if (ExistingUser) {
return res.status(409).json({success : false , message : "Utilisateur déjà existant."});
}
const hashedpsswd = await bcrypt.hash(password , 10);

const createuser = await User.create({
name ,
email,
password : hashedpsswd,
role,

})
const accesToken = generateAccessToken(createuser);

const refreshtoken = generateRefreshToken(createuser);
res.cookie("refreshtoken", refreshtoken, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000 
});


return res.status(201).json({success : true , message : "Utilisateur créé avec succès." , data : accesToken})

} catch (error) {
console.error(error);
return res.status(500).json({success : false , message : "Echec de création du nouvel utilisateur." });

}
}



export const RefreshToken = async (req,res) => {
const refreshtoken = req.cookies.refreshtoken;
try {
    if (!refreshtoken) {
  return res.status(401).json({ success: false, message: "Aucun refresh token fourni" });
}

const user = jwt.verify(refreshtoken , process.env.JWT_REFRESH_SECRET);
const accesToken = generateAccessToken(user);
return res.status(200).json({success : true , message : "Token renouvelé avec succès" , data : accesToken})
} 

catch(error) {
console.error(error);
return res.status(403).json({ success: false, message: "Refresh token invalide ou expiré" });

}
}



export const Loginuser = async (req,res) => {

    const {email , password} = req.body;
    
try {
if (!email || !password) {

return res.status(401).json({success : false , message : "Veuillez remplir tous les champs"});
    }

const user = await User.findOne({email});
if (!user) {

return res.status(401).json({success : false ,
   message : "Utilisateur introuvable.",
  })
}

const matched = await bcrypt.compare(password , user.password );
if (!matched) {

return res.status(401).json({success : false , message : "Informations incorrectes"});
}
   const accesToken = generateAccessToken(user);
  res.cookie("refreshtoken", generateRefreshToken(user), {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000 
});
  return res.status(200).json({success : true , message : "Connexion avec succès" , data : accesToken})

} 
catch (error) {
  
console.error(error);
return res.status(500).json({success : false , message : "Echec de connexion"});

}

}


export const Logoutuser = async(req,res) => {

try {
    res.clearCookie("refreshtoken", {
  httpOnly: true,
  secure: true,
  sameSite: "Strict"
});

return res.status(200).json({success : true , message : "Deconnexion avec succès" })

} 

catch (error) {
console.error(error);
return res.status(500).json({success : false , message : "Echec de deconnexion"})

}


}