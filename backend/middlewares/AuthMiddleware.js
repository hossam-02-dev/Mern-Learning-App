import jwt from "jsonwebtoken";

const authmiddle = async (req, res, next) => {


// Middleware d'authentification

  // 1️⃣ Vérifier si un header Authorization existe et commence par "Bearer"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Accès refusé, aucun token fourni" });
  }
     
  const token = authHeader.split(" ")[1];

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
  //  req.user = decoded;  ce que j'avais avant
   req.user = {
      _id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email,
      role: decoded.role
    };  // ce que j'ai mis pour que ca marche avec les deux types de token 
    next();
  }
   catch (error) {

    return res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  };


    
}




export default authmiddle;