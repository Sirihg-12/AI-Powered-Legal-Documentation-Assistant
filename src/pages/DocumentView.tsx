import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Document interface
interface Document {
  id: string;
  filename: string;
  content: string; // base64 or blob string
  createdAt: string;
}

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedDocuments = JSON.parse(localStorage.getItem("my_documents") || "[]");
    const found = savedDocuments.find((doc: Document) => doc.id === id);
    if (found) {
      setDocument(found);

      // Convert base64 or plain content into Blob URL
      const blob = new Blob([atob(found.content)], { type: "application/pdf" }); // if base64
      // const blob = new Blob([found.content], { type: "application/pdf" }); // if already blob content
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  }, [id]);

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="text-center bg-white/90 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-red-600">Document not found</h2>
          <p className="text-gray-500 mt-2">
            Please check if the document exists in "My Documents".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">{document.filename}</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Created on {new Date(document.createdAt).toLocaleDateString()}
        </p>

        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[700px] border rounded-md"
          />
        ) : (
          <p>Loading PDF...</p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
