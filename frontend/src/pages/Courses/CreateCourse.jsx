import React, { useState } from "react";
import { Createcourse } from "../../apis/Courses";
import { useNavigate } from "react-router-dom";
import { Upload, Video, FileText, Image, DollarSign, X } from "lucide-react";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = (indexToRemove) => setVideos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  const removePdf = (indexToRemove) => setPdfs((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !description || price === "") return setError("⚠️ Veuillez remplir tous les champs obligatoires");
    if (Number(price) < 0) return setError("⚠️ Le prix ne peut pas être négatif");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    videos.forEach((file) => formData.append("videos", file));
    pdfs.forEach((file) => formData.append("pdfs", file));
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      await Createcourse(formData);
      setSuccess("✅ Cours créé avec succès ! Redirection...");
      setTimeout(() => navigate("/courses"), 1200);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "❌ Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Créer un nouveau cours</h1>
          <p className="text-gray-600">Partagez vos connaissances avec vos étudiants</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre du cours *</label>
              <input
                type="text"
                placeholder="Ex: Introduction à React.js"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                placeholder="Décrivez le contenu et les objectifs de votre cours..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (DH) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="0 pour un cours gratuit"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Entrez 0 pour rendre le cours gratuit</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Image className="w-5 h-5" /> Image de couverture
              </label>
              {thumbnailPreview ? (
                <div className="relative">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                  <button type="button" onClick={removeThumbnail} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-600">Cliquez pour télécharger</span>
                  <span className="text-sm text-gray-400">PNG, JPG ou JPEG</span>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Video className="w-5 h-5" /> Vidéos du cours (MP4)
              </label>
              <input
                type="file"
                multiple
                accept="video/mp4"
                onChange={(e) => setVideos((prev) => [...prev, ...Array.from(e.target.files)])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />
              {videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {videos.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeVideo(idx)} className="text-red-500 hover:text-red-700 transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Documents PDF
              </label>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => setPdfs((prev) => [...prev, ...Array.from(e.target.files)])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />
              {pdfs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pdfs.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removePdf(idx)} className="text-red-500 hover:text-red-700 transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={() => navigate("/courses")} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Création en cours..." : "Créer le cours"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;