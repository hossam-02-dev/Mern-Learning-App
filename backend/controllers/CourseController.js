import Course from "../models/CourseModel.js";

export const Getacourse = async (req, res) => { 
  try {
    const singleCourse = await Course.findById(req.params.id);
    if (!singleCourse) {
      return res.status(404).json({success: false, message: "Cours introuvable."});
    }

    // Transformer les fichiers pour le frontend
    const videos = singleCourse.videos.map(v => ({
      title: v.title,
      url: v.url,
      duration: v.duration,
    }));

    const pdfs = singleCourse.pdfs?.map(p => ({
      title: p.title,
      url: p.url,
    }));

    const thumbnail = singleCourse.thumbnail;

    const data = {
      _id: singleCourse._id,
      title: singleCourse.title,
      description: singleCourse.description,
      price: singleCourse.price,
      videos,
      pdfs,
      thumbnail,
      studentsEnrolled: singleCourse.studentsEnrolled,
      createdAt: singleCourse.createdAt,
      updatedAt: singleCourse.updatedAt,
    };

    // ✅ MODIFICATION : Vérifier si l'utilisateur a acheté le cours
    let isPurchased = false;
    if (req.user) {
      isPurchased = singleCourse.studentsEnrolled?.includes(req.user._id) || false;
    }

    return res.status(200).json({ 
      success: true,
      message: `Le cours ayant l'identifiant : ${req.params.id} est récupéré avec succès.`,
      data,
      isPurchased  // ✅ AJOUT CRITIQUE
    });

  } catch(error) {
    console.error("❌ Erreur Getacourse:", error);
    return res.status(500).json({
      success: false,
      message: `Échec de récupération du cours ayant l'identifiant : ${req.params.id}`,
      error: error.message
    });
  }
};

export const Getcourses = async (req, res) => {
  try {
    const allCourses = await Course.find();
    return res.status(200).json({
      success: true, 
      message: "Tous les cours sont récupérés.", 
      data: allCourses
    });
  } catch(error) {
    console.error("❌ Erreur Getcourses:", error);
    return res.status(500).json({
      success: false, 
      message: "Échec de récupération des cours.",
      error: error.message
    });
  }
};

export const Editcourse = async (req, res) => {
  try {
    const editingacourse = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {new: true}
    );

    if (!editingacourse) {
      return res.status(404).json({
        success: false, 
        message: "Cours introuvable."
      });
    }

    return res.status(200).json({
      success: true, 
      message: `Modification avec succès du cours ayant l'identifiant : ${req.params.id}.`,
      data: editingacourse,
    });
  } catch(error) {
    console.error("❌ Erreur Editcourse:", error);
    return res.status(500).json({
      success: false, 
      message: "Échec de modification du cours.",
      error: error.message
    });
  }
};

export const Createcourse = async (req, res) => {
  try {
    console.log("📋 Body reçu:", req.body);
    console.log("📁 Fichiers reçus:", req.files);

    const { title, description, price } = req.body;

    // Vérification des champs obligatoires
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires (title, description, price).",
      });
    }

    // ✅ Sauvegarde uniquement le nom du fichier (pas le chemin complet)
    const videos = (req.files?.videos || []).map((file) => ({
      title: file.originalname,
      url: file.filename, // ✅ Juste "1735123456789_video.mp4"
      duration: 0,
    }));

    const pdfs = (req.files?.pdfs || []).map((file) => ({
      title: file.originalname,
      url: file.filename, // ✅ Juste "1735123456789_doc.pdf"
    }));

    const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : ""; // ✅ Juste le nom

    console.log("✅ Données à sauvegarder:", { title, description, price, videos, pdfs, thumbnail });

    // Création du cours
    const newCourse = await Course.create({
      title,
      description,
      price,
      videos,
      pdfs,
      thumbnail,
    });

    return res.status(201).json({
      success: true,
      message: "Cours créé avec succès.",
      data: newCourse,
    });
  } catch (error) {
    console.error("❌ Erreur Createcourse:", error);
    console.error("❌ Stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Échec de création du cours.",
      error: error.message,
    });
  }
};

export const Deletecourse = async (req, res) => {
  try {
    const deleteacourse = await Course.findByIdAndDelete(req.params.id);

    if (!deleteacourse) {
      return res.status(404).json({
        success: false, 
        message: "Cours introuvable."
      });
    }

    return res.status(200).json({
      success: true, 
      message: `Suppression avec succès du cours ayant l'identifiant : ${req.params.id}.`,
      data: deleteacourse,
    });
  } catch(error) {
    console.error("❌ Erreur Deletecourse:", error);
    return res.status(500).json({
      success: false, 
      message: "Échec de suppression du cours.",
      error: error.message
    });
  }
};