import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) return null;

  const handlePayment = () => {
    navigate(`/paiement/${course._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail.startsWith("http") ? course.thumbnail : course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Course Info */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <p className="text-indigo-600 font-semibold mb-4">Prix : {course.price} €</p>

        {/* Fichiers du cours */}
        <div className="mb-4">
          {course.videos?.map((video, index) => (
            <FileUpload key={index} fileUrl={video.url} title={video.title} />
          ))}
          {course.pdfs?.map((pdf, index) => (
            <FileUpload key={index} fileUrl={pdf.url} title={pdf.title} />
          ))}
        </div>

        {/* Bouton Paiement */}
        <button
          onClick={handlePayment}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
        >
          Accéder au paiement
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
