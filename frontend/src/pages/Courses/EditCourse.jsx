import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editcourse, Getcourse } from "../../apis/Courses";
import { Upload, Video, FileText, Image, DollarSign, X, Trash2 } from "lucide-react";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  // Nouveaux fichiers à ajouter
  const [newVideos, setNewVideos] = useState([]);
  const [newPdfs, setNewPdfs] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Fichiers existants à supprimer
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [pdfsToDelete, setPdfsToDelete] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await Getcourse(id);
        if (res.data.success) {
          const data = res.data.data;
          setCourse(data);
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price);
        } else {
          setError("Cours introuvable");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération du cours");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setNewThumbnail(null);
    setThumbnailPreview(null);
  };

  const removeNewVideo = (indexToRemove) => {
    setNewVideos(newVideos.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewPdf = (indexToRemove) => {
    setNewPdfs(newPdfs.filter((_, idx) => idx !== indexToRemove));
  };

  const markVideoForDeletion = (videoUrl) => {
    setVideosToDelete([...videosToDelete, videoUrl]);
  };

  const markPdfForDeletion = (pdfUrl) => {
    setPdfsToDelete([...pdfsToDelete, pdfUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      setError("⚠️ Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    // Nouveaux fichiers
    newVideos.forEach((file) => formData.append("videos", file));
    newPdfs.forEach((file) => formData.append("pdfs", file));
    if (newThumbnail) formData.append("thumbnail", newThumbnail);

    // Fichiers à supprimer
    if (videosToDelete.length > 0) {
      formData.append("videosToDelete", JSON.stringify(videosToDelete));
    }
    if (pdfsToDelete.length > 0) {
      formData.append("pdfsToDelete", JSON.stringify(pdfsToDelete));
    }

    try {
      setSaving(true);
      setError("");
      const res = await Editcourse(id, formData);
      
      if (res.data.success) {
        setSuccess("✅ Cours modifié avec succès ! Redirection...");
        setTimeout(() => navigate(`/courses/${id}`), 2000);
      } else {
        setError(res.data.message || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de la modification du cours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-600 text-xl">{error}</p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  if (!course) return null;

  const existingVideos = course.videos?.filter(v => !videosToDelete.includes(v.url)) || [];
  const existingPdfs = course.pdfs?.filter(p => !pdfsToDelete.includes(p.url)) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Modifier le cours
          </h1>
          <p className="text-gray-600">
            Mettez à jour les informations de votre cours
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre du cours *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition resize-none"
                required
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix (DH) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
                  required
                />
              </div>
            </div>

            {/* Thumbnail actuel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2  items-center gap-2">
                <Image className="w-5 h-5" />
                Image de couverture
              </label>

              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Nouvelle preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <p className="mt-2 text-sm text-gray-600">Nouvelle image (non sauvegardée)</p>
                </div>
              ) : course.thumbnail ? (
                <div className="space-y-3">
                  <img
                    src={`http://localhost:4000${course.thumbnail}`}
                    alt="Thumbnail actuel"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <label className="block">
                    <span className="sr-only">Changer l'image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-600">Cliquez pour télécharger</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Vidéos existantes */}
            {existingVideos.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2  items-center gap-2">
                  <Video className="w-5 h-5" />
                  Vidéos actuelles
                </label>
                <div className="space-y-2">
                  {existingVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700">{video.title || `Vidéo ${idx + 1}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => markVideoForDeletion(video.url)}
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Supprimer</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajouter nouvelles vidéos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                <Video className="w-5 h-5" />
                Ajouter des vidéos (MP4)
              </label>
              <input
                type="file"
                multiple
                accept="video/mp4"
                onChange={(e) => setNewVideos([...newVideos, ...Array.from(e.target.files)])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />

              {newVideos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {newVideos.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewVideo(idx)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDFs existants */}
            {existingPdfs.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2  items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents PDF actuels
                </label>
                <div className="space-y-2">
                  {existingPdfs.map((pdf, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700">{pdf.title || `Document ${idx + 1}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => markPdfForDeletion(pdf.url)}
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Supprimer</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajouter nouveaux PDFs */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2  items-center gap-2">
                <FileText className="w-5 h-5" />
                Ajouter des PDFs
              </label>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => setNewPdfs([...newPdfs, ...Array.from(e.target.files)])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />

              {newPdfs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {newPdfs.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewPdf(idx)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/courses/${id}`)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;