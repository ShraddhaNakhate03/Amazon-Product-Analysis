// About.js
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-6">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
          About MyApp
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          MyApp is a cutting-edge platform designed to help users make better
          purchasing decisions. We use artificial intelligence to analyze product
          reviews from Amazon and filter out fake reviews, providing you with
          only trustworthy insights.
        </p>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Features
          </h2>
          <ul className="mt-6 list-inside list-disc text-left text-gray-600 dark:text-gray-300">
            <li>AI-powered review analysis</li>
            <li>Fake review detection</li>
            <li>Sentiment analysis on product reviews</li>
            <li>Intuitive and easy-to-use interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
