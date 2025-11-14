import multer from "multer";
import path from "path";
import fs from "fs";

// 🗂️ Dossier de destination
const uploadPath = path.join(process.cwd(), "uploads");

// Vérifie que le dossier existe, sinon le crée
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ⚙️ Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // tous les fichiers seront enregistrés dans /uploads
  },
  filename: (req, file, cb) => {
    // nom unique → ex: 1691234567890_avatar.png
    const uniqueName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// 🧩 Filtre de validation des types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "video/mp4",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé. Formats acceptés : images, PDF, MP4."));
  }
};

// 🧰 Limite de taille (ex : 10 Mo)
const limits = { fileSize: 10 * 1024 * 1024 };

// 📦 Création du middleware
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
