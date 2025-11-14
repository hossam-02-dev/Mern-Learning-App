import Progress from "../models/ProgressionModel.js";

// ✅ Récupérer la progression de l'utilisateur connecté dans TOUS ses cours
export const GetProgressionAllcourses = async (req, res) => {
  try {
    // ✅ Utiliser req.user._id au lieu de req.params.id pour plus de sécurité
    const userId = req.user._id;

    const progressinall = await Progress.find({ studentId: userId }) // ✅ CORRECTION : studentId au lieu de userId
      .populate("courseId", "title description price thumbnail"); // ✅ Récupérer les infos du cours

    if (progressinall.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune progression trouvée.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Toutes vos progressions ont été récupérées avec succès.",
      data: progressinall,
    });
  } catch (error) {
    console.error("❌ Erreur GetProgressionAllcourses:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération des progressions.",
    });
  }
};

// ✅ Récupérer la progression de TOUS les étudiants dans un cours (Prof/Admin)
export const GetProgressionIncourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const progressinone = await Progress.find({ courseId })
      .populate("studentId", "name email"); // ✅ Récupérer nom et email des étudiants

    if (progressinone.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucune progression trouvée pour ce cours.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Les progressions des étudiants ont été récupérées.`,
      data: progressinone,
    });
  } catch (error) {
    console.error("❌ Erreur GetProgressionIncourse:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération des progressions du cours.",
    });
  }
};

// ✅ Créer ou mettre à jour une progression
export const Createprogression = async (req, res) => {
  try {
    const { courseId, progresspourcent, completedChapters } = req.body;
    const studentId = req.user._id; // ✅ Utiliser l'utilisateur connecté

    if (!courseId || progresspourcent === undefined) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir courseId et progresspourcent.",
      });
    }

    // ✅ Vérifier si une progression existe déjà
    const existingProgress = await Progress.findOne({ studentId, courseId });

    if (existingProgress) {
      // ✅ Mettre à jour la progression existante
      existingProgress.progresspourcent = progresspourcent;
      if (completedChapters) {
        existingProgress.completedChapters = completedChapters;
      }
      await existingProgress.save();

      return res.status(200).json({
        success: true,
        message: "Progression mise à jour avec succès.",
        data: existingProgress,
      });
    } else {
      // ✅ Créer une nouvelle progression
      const createprgss = await Progress.create({
        studentId,
        courseId,
        completedChapters: completedChapters || [],
        progresspourcent,
      });

      return res.status(201).json({
        success: true,
        message: "Progression créée avec succès.",
        data: createprgss,
      });
    }
  } catch (error) {
    console.error("❌ Erreur Createprogression:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de création/mise à jour de la progression.",
    });
  }
};

// ✅ NOUVELLE FONCTION : Récupérer la progression d'un étudiant dans UN cours spécifique
export const GetMyProgressInCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseId = req.params.id;

    const progress = await Progress.findOne({ studentId, courseId })
      .populate("courseId", "title description");

    if (!progress) {
      // Si aucune progression, retourner 0%
      return res.status(200).json({
        success: true,
        message: "Aucune progression pour ce cours.",
        data: {
          studentId,
          courseId,
          progresspourcent: 0,
          completedChapters: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progression récupérée avec succès.",
      data: progress,
    });
  } catch (error) {
    console.error("❌ Erreur GetMyProgressInCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération de la progression.",
    });
  }
};