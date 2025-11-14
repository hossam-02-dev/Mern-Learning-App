import User from "../models/UserModel.js";

export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ✅ Ne pas renvoyer les mots de passe
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun utilisateur trouvé."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Tous les utilisateurs sont récupérés avec succès.",
      data: users,
    });
  } catch (error) {
    console.error("❌ Erreur GetAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération des utilisateurs.",
    });
  }
};

export const GetMyProfile = async (req, res) => {
  try {
    // ✅ Utiliser req.user._id depuis le middleware
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Profil récupéré avec succès.",
      data: user,
    });
  } catch (error) {
    console.error("❌ Erreur GetMyProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération du profil."
    });
  }
};

export const UpdateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // ✅ SÉCURITÉ : Empêcher la modification du mot de passe et du rôle via cette route
    delete updates.password;
    delete updates.role;
    
    // ✅ CORRECTION : req.user._id au lieu de req.user_id
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,  // ✅ CORRIGÉ
      updates,
      { new: true, runValidators: true }  // ✅ Retourner le document mis à jour
    ).select("-password");
    
    if (!updateUser) {  // ✅ CORRIGÉ : logique inversée
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès.",
      data: updateUser,
    });
  } catch (error) {
    console.error("❌ Erreur UpdateMyProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de mise à jour du profil.",
      error: error.message
    });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const deleteone = await User.findByIdAndDelete(req.params.id);
    
    if (!deleteone) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès.",
      data: deleteone,
    });
  } catch (error) {
    console.error("❌ Erreur DeleteUser:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de suppression d'utilisateur.",
    });
  }
};