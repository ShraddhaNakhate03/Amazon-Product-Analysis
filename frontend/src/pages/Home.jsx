import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <section className="bg-blue-600 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Welcome to MyApp!
        </h1>
        <p className="mt-4 text-xl max-w-lg mx-auto">
          Your one-stop solution for analyzing product reviews and making
          informed purchasing decisions.
        </p>
        <div className="mt-8">
          <Link
            to="/about"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We use advanced AI to filter through fake reviews, helping you make
            confident buying decisions. Our system is fast, accurate, and
            trustworthy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <p className="text-lg font-semibold">MyApp</p>
              <p className="text-sm">© 2025 MyApp. All Rights Reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm hover:text-gray-400">
                About
              </Link>
              <Link to="/contact" className="text-sm hover:text-gray-400">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm hover:text-gray-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-gray-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
