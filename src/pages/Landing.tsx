import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegPaperPlane, FaCogs, FaEdit } from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1653398597170-1e855f585ae9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEyfHxMZWdhbCUyMFRoZW1lJTIwJUUyJTgwJTkzJTIwRWxlZ2FudCUyMExhdyUyMEJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* semi-transparent overlay to darken the image */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Main Heading and Subtitle */}
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 z-10">
        AI Legal Documentation Assistant
      </h1>
      <p className="max-w-xl mb-8 text-lg md:text-xl text-gray-300 z-10">
        Draft and manage legal documents with ease. Empowered by AI to save your time, ensure
        accuracy, and stay compliant with legal standards.
      </p>

      {/* How It Works Section */}
      <div className="space-y-8 mb-10 text-gray-300 z-10">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>

        {/* Step 1 */}
        <div className="flex items-start gap-6">
          <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            <FaRegPaperPlane />
          </div>
          <div>
            <p className="font-semibold">Enter Information</p>
            <p>Fill out a simple form with the necessary details to tailor your document.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-6">
          <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            <FaCogs />
          </div>
          <div>
            <p className="font-semibold">Generate Document</p>
            <p>Let our AI process your input and create a ready-to-use legal document.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-6">
          <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            <FaEdit />
          </div>
          <div>
            <p className="font-semibold">Review and Edit</p>
            <p>Review the generated document, make any necessary edits, and finalize it.</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 z-10">
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition duration-300 transform hover:scale-105"
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          className="border border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-black transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Landing;
