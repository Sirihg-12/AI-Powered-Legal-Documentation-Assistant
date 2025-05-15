// src/components/DocumentForm.tsx
import React, { useState } from 'react';

interface Props {
  type: string;
  onGenerate: (docText: string, formData: { date: string }) => void;
}

const DocumentForm: React.FC<Props> = ({ type, onGenerate }) => {
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docText = `Legal Document Type: ${type}

Prepared For: ${fullName}
Date: ${date}

Details:
${details}

--- End of ${type} Document ---`;

    onGenerate(docText, { date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Details</label>
        <textarea
          rows={4}
          required
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder={`Enter details for the ${type.toLowerCase()}...`}
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Generate Document
      </button>
    </form>
  );
};

export default DocumentForm;
