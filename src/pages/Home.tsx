import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/d4/dd/2e/d4dd2e35174008aa568b4c8573fe0a65.jpg')", // legal-themed dark background
      }}
    >
      <div className="bg-black bg-opacity-70 min-h-screen flex flex-col justify-center items-center px-6 text-center">
        {/* LegalEase AI Header with Unique Font and Color */}
        <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-legal-purple via-legal-pink to-red-500 mb-6 animate-slide-up">
          LegalEase AI
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl mb-6 max-w-2xl animate-fade-in">
          Simplify your legal documentation with AI-powered tools designed for accuracy, clarity, and peace of mind.
        </p>

        {/* Get Started Button */}
        <Link
          to="/services"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 animate-slide-up"
        >
          Get Started
        </Link>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-12 space-y-6 md:space-y-0 md:space-x-12 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="text-blue-400 text-4xl mb-2">📄</div>
            <h3 className="text-lg font-semibold">Clarity & Protection</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-cyan-400 text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold">Avoid Legal Pitfalls</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-yellow-400 text-4xl mb-2">😊</div>
            <h3 className="text-lg font-semibold">Peace of Mind</h3>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-sm text-gray-400 animate-fade-in">
          <p>© 2025 LegalEase AI, All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-1">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
