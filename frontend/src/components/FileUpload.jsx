import React from "react";

const FileUpload = ({ fileUrl, title }) => {
  if (!fileUrl) return null;

  const isPDF = fileUrl.endsWith(".pdf");
  const isVideo = fileUrl.endsWith(".mp4");

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">{title}</h4>

      {isPDF && (
        <iframe
          src={fileUrl}
          title={title}
          className="w-full h-[500px] border rounded-lg"
        />
      )}

      {isVideo && (
        <video
          src={fileUrl}
          controls
          className="w-full h-[360px] rounded-lg"
        />
      )}

      {!isPDF && !isVideo && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Télécharger {title}
        </a>
      )}
    </div>
  );
};

export default FileUpload;
