import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Types for document data
interface Document {
  id: string;
  filename: string;
  content: string;
  createdAt: string;
}

const MyDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load documents from localStorage when the component mounts
  useEffect(() => {
    const savedDocuments = JSON.parse(localStorage.getItem("my_documents") || "[]");
    setDocuments(savedDocuments);
  }, []);

  const handleDownload = (doc: Document) => {
    const pdf = new jsPDF();

    // Set metadata
    pdf.setProperties({
      title: doc.filename,
      subject: "AI-Generated Legal Document",
      author: "AI Legal Assistant",
      keywords: "legal, document, AI, assistant",
    });

    // Set default font
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 7;
    let y = margin + 10;

    // Add header
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text(doc.filename, pageWidth / 2, margin, { align: "center" });

    // Add content
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    const lines = pdf.splitTextToSize(doc.content, pageWidth - margin * 2);

    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin + 10;

        // Re-add header for each page
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text(doc.filename, pageWidth / 2, margin, { align: "center" });

        pdf.setFontSize(12);
        pdf.setTextColor(0);
      }

      pdf.text(line, margin, y);
      y += lineHeight;
    });

    // Add footer with page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    }

    // Save the PDF
    pdf.save(doc.filename.endsWith(".pdf") ? doc.filename : `${doc.filename}.pdf`);
  };

  const handlePreview = (doc: Document) => {
    // Open a new window with the document content
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Document Preview</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
              }
              h1 {
                text-align: center;
                color: #333;
              }
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                background-color: #f9f9f9;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <h1>Document Preview</h1>
            <pre>${doc.content}</pre>
          </body>
        </html>
      `);
      previewWindow.document.close(); // Close the document to finish rendering
    }
  };

  const handleDelete = (doc: Document) => {
    const updatedDocuments = documents.filter((document) => document.id !== doc.id);
    setDocuments(updatedDocuments);
    localStorage.setItem("my_documents", JSON.stringify(updatedDocuments));
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white/90 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">My Documents</h1>

        {documents.length === 0 ? (
          <p className="text-center text-gray-500">
            No documents found. Please generate a document from the Services page.
          </p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border-b pb-4">
                <h2 className="font-semibold">{doc.filename}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  {/* Preview Document Button */}
                  <button
                    onClick={() => handlePreview(doc)}
                    className="text-blue-500 hover:underline"
                  >
                    Preview
                  </button>

                  {/* Download Button */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </button>

                  {/* Delete Button */}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                    onClick={() => handleDelete(doc)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
