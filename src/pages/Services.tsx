import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useDarkMode } from "../hooks/useDarkMode";

const loadFont = async (doc: any, language: string) => {
  try {
    const langFontMap: Record<string, { url: string; name: string }> = {
      hi: { url: "/fonts/NotoSansDevanagari-Regular.ttf", name: "NotoSansDevanagari" },
      gu: { url: "/fonts/NotoSansGujarati.ttf", name: "NotoGujarati" },
      kn: { url: "/fonts/NotoSansKannada-Regular.ttf", name: "NotoSansKannada" },
      ta: { url: "/fonts/NotoSansTamil-Regular.ttf", name: "NotoSansTamil" },
      te: { url: "/fonts/NotoSansTelugu-Regular.ttf", name: "NotoSansTelugu" },
      mr: { url: "/fonts/NotoSansDevanagari-Regular.ttf", name: "NotoSansDevanagari" },
      ml: { url: "/fonts/NotoSansMalayalam-Regular.ttf", name: "NotoSansMalayalam" },
      bn: { url: "/fonts/NotoSansBengali-Regular.ttf", name: "NotoSansBengali" },
      pa: { url: "/fonts/NotoSansGurmukhi-Regular.ttf", name: "NotoSansGurmukhi" },
      or: { url: "/fonts/NotoSansOriya-Regular.ttf", name: "NotoSansOriya" },
      as: { url: "/fonts/NotoSansAssamese-Regular.ttf", name: "NotoSansAssamese" }
    };

    const fontMeta = langFontMap[language];
    if (!fontMeta) return;

    const buffer = await fetch(fontMeta.url).then((res) => {
      if (!res.ok) throw new Error(`Font load failed: ${fontMeta.url}`);
      return res.arrayBuffer();
    });
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    doc.addFileToVFS(`${fontMeta.name}.ttf`, base64);
    doc.addFont(`${fontMeta.name}.ttf`, fontMeta.name, "normal");
    doc.setFont(fontMeta.name);
  } catch (err) {
    console.warn("Font embedding error:", err);
  }
};

const downloadPDF = async (
  text: string,
  filename = "legal-document.pdf",
  language = "en"
) => {
  const doc = new jsPDF();
  await loadFont(doc, language);

  const margin = 10;
  const lineHeight = 10;
  const pageHeight = doc.internal.pageSize.height;
  const lines = doc.splitTextToSize(text, 180);
  let y = margin;

  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save(filename);
};

const documentFields: Record<string, string[]> = {
  NDA: ["partyOne", "partyTwo", "effectiveDate"],
  "Partnership Agreement": ["partnerOne", "partnerTwo", "startDate", "businessPurpose"],
  "Freelance Contract": ["freelancer", "client", "projectDescription", "paymentTerms"],
  "Employment Contract": ["employer", "employee", "jobTitle", "startDate", "salary"],
  "Lease Agreement": ["landlord", "tenant", "propertyAddress", "leaseStartDate", "rentAmount"],
  "Power of Attorney": ["grantor", "grantee", "authorityScope", "effectiveDate"],
  "Sales Agreement": ["seller", "buyer", "itemDescription", "price", "saleDate"],
  "Consulting Agreement": ["consultant", "client", "servicesProvided", "fee", "duration"],
  "Loan Agreement": ["lender", "borrower", "loanAmount", "interestRate", "repaymentDate"],
  "Service Agreement": ["provider", "recipient", "serviceDescription", "cost", "startDate"]
};

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
  { label: "Kannada", value: "kn" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Marathi", value: "mr" },
  { label: "Malayalam", value: "ml" },
  { label: "Bengali", value: "bn" },
  { label: "Punjabi", value: "pa" },
  { label: "Odia", value: "or" },
  { label: "Assamese", value: "as" }
];

const Services = () => {
  const [docType, setDocType] = useState("NDA");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("en");
  const [filename, setFilename] = useState("Legal_Document.pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [editedDoc, setEditedDoc] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { isDarkMode: darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const fields = documentFields[docType] || [];
    const initial: Record<string, string> = {};
    fields.forEach((f) => (initial[f] = ""));
    setFormData(initial);
    setGeneratedDoc(null);
    setEditedDoc(null);
    setIsEditing(false);
    setError("");
  }, [docType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "language") setLanguage(value);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const field of documentFields[docType] || []) {
      if (!formData[field]?.trim()) {
        setError(`Please fill in the "${field}" field.`);
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    setError("");
    if (!validateForm()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, language, ...formData })
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedDoc(data.generatedText);
        setEditedDoc(data.generatedText);
        setIsEditing(false);

        // Get current date in "dd-mm-yyyy" format
        const currentDate = new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        localStorage.setItem(
          "legal_doc",
          JSON.stringify({ type: docType, text: data.generatedText })
        );
        const docs = JSON.parse(localStorage.getItem("my_documents") || "[]");
        docs.push({ id: Date.now(), filename, content: data.generatedText, createdAt: currentDate });
        localStorage.setItem("my_documents", JSON.stringify(docs));
      } else {
        setError(data.error || "Failed to generate document.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error occurred.");
    }
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    if (!editedDoc) return;
    const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    try {
      await downloadPDF(editedDoc, safeName, language);
    } catch (e) {
      console.error("Download error:", e);
      setError("Failed to download PDF. Check console for details.");
    }
  };

  return (
    <div
      className={`min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 ${
        darkMode ? "bg-black text-white" : ""
      }`}
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/4c/c9/f3/4cc9f3a1e58f5180275a16d094925e1c.jpg')"
      }}
    >
      <div
        className={`max-w-4xl w-full p-8 rounded-xl shadow-xl relative ${
          darkMode ? "bg-gray-900" : "bg-white/90"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center ${
            darkMode ? "text-white" : "text-indigo-900"
          }`}
        >
          Generate Legal Document
        </h1>

        <div className="mb-4">
          <label
            className={`block mb-1 font-semibold ${darkMode ? "text-white" : "text-indigo-900"}`}
          >
            Document Type
          </label>
          <select
            name="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className={`border px-3 py-2 w-full rounded ${
              darkMode ? "text-white bg-gray-800" : "text-gray-900"
            }`}
          >
            {Object.keys(documentFields).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className={`block mb-1 font-semibold ${darkMode ? "text-white" : "text-indigo-900"}`}
          >
            Language
          </label>
          <select
            name="language"
            value={language}
            onChange={handleChange}
            className={`border px-3 py-2 w-full rounded ${
              darkMode ? "text-white bg-gray-800" : "text-gray-900"
            }`}
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {documentFields[docType]?.map((field) => (
          <div className="mb-4" key={field}>
            <label
              className={`block font-semibold mb-1 capitalize ${
                darkMode ? "text-white" : "text-indigo-900"
              }`}
            >
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field.toLowerCase().includes("date") ? "date" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className={`border px-3 py-2 w-full rounded ${
                darkMode ? "text-white bg-gray-800" : "text-gray-900"
              }`}
            />
          </div>
        ))}

        <div className="mb-4">
          <label
            className={`block mb-1 font-semibold ${darkMode ? "text-white" : "text-indigo-900"}`}
          >
            File Name
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className={`border px-3 py-2 w-full rounded ${
              darkMode ? "text-white bg-gray-800" : "text-gray-900"
            }`}
          />
        </div>

        <button
          onClick={handleGenerate}
          className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800 disabled:opacity-50"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Document"}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {editedDoc && (
          <div className="mt-8">
            <h2
              className={`text-xl font-semibold mb-4 ${
                darkMode ? "text-white" : "text-indigo-900"
              }`}
            >
              Generated Document
            </h2>
            {isEditing ? (
              <textarea
                className="w-full h-64 border p-4 rounded mb-4 text-gray-900"
                value={editedDoc}
                onChange={(e) => setEditedDoc(e.target.value)}
              />
            ) : (
              <div className="whitespace-pre-wrap border p-4 rounded bg-gray-50 text-gray-900 shadow">
                {editedDoc}
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Download as PDF
              </button>
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
              >
                {isEditing ? "Save" : "Edit Document"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
