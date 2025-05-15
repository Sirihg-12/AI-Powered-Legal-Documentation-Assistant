import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");  // New state for phone number
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (age === "" || age < 18) {
        setError("You must be 18 or older to register.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!email || !password || !acceptTerms || !phone) {  // Include phone check
        setError("Please fill in all fields and accept the terms and conditions.");
        return;
      }

      const user = { name, age, email, password, phone };  // Include phone in user object
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/login");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1685741149700-1c4e6403c7bb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxiYWNrZ3JvdW5kJTIwaW1hZ2VzJTIwZm9yJTIwcHJvZmlsZSUyMHBhZ2UlMjBvZiUyMGElMjBsZWdhbCUyMHRoZW1lZCUyMHdlYnNpdGV8ZW58MHx8MHx8fDA%3D)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        animation: "bgMove 20s ease-in-out infinite alternate",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-sm"></div>

      <div className="w-full max-w-sm bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight drop-shadow-sm">
          Register
        </h1>

        <form onSubmit={handleNext} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="p-3 w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="p-3 w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={0}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-md transition transform duration-300 ease-in-out"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="p-3 w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="p-3 w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="p-3 w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="accent-blue-500 w-4 h-4"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I accept the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline font-medium">
                    terms and conditions
                  </a>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:scale-105 hover:shadow-md transition transform duration-300 ease-in-out"
              >
                Register
              </button>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes bgMove {
            0% { background-position: center; }
            100% { background-position: top; }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Register;
