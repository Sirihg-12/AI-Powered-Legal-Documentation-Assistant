import { useNavigate } from "react-router-dom";

const LandingSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-blue-900 px-6 py-16 md:px-20 lg:px-40">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        AI-Powered Legal Documentation Assistant
      </h1>
      <p className="text-lg md:text-xl mb-10">
        Generate legal documents in minutes with our AI-powered assistant.
        Simplify your workflow, reduce errors, and ensure compliance with ease.
      </p>

      <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

      <div className="space-y-6 mb-10">
        <div className="flex items-start gap-4">
          <div className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <p className="font-bold">Enter Information</p>
            <p>Fill out a simple form with the necessary details to tailor your document.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <p className="font-bold">Generate Document</p>
            <p>Let our AI process your input and create a ready-to-use legal document.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <p className="font-bold">Review and Edit</p>
            <p>Review the generated document, make any necessary edits, and finalize it.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800"
        >
          Register
        </button>
        <button
          onClick={() => navigate("/login")}
          className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md font-semibold hover:bg-blue-100"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LandingSection;
