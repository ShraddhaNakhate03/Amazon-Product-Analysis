import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ReviewAnalysis = () => {
  const location = useLocation();
  const productUrl = location.state?.productUrl || "";

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productUrl) {
      fetchAnalysis();
    } else {
      setError("No product URL found. Please go back and enter a URL.");
    }
  }, [productUrl]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/scrape/products/analyze-product/",
        { url: productUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      setReviewData(response.data);
    } catch (err) {
      setError("Failed to analyze reviews. Please try again.");
      console.error("Error analyzing reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse structured review data
  const parseReviewData = (text) => {
    const sections = {};
    let currentSection = null;

    text.split("\n").forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("**")) {
        // Extract section title (remove ** from start and end)
        currentSection = trimmedLine.replace(/\*\*/g, "");
        sections[currentSection] = [];
      } else if (currentSection && trimmedLine.startsWith("*")) {
        // Remove the leading * and store as list item
        sections[currentSection].push(trimmedLine.replace("*", "").trim());
      } else if (currentSection && trimmedLine) {
        // Add additional text (like recommendation)
        sections[currentSection].push(trimmedLine);
      }
    });

    return sections;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
          🔍 AI Review Analysis
        </h1>

        {/* Loading Animation */}
        {loading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-lg font-medium">
              Analyzing reviews...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}

        {/* Product Details & Review Analysis */}
        {reviewData && !loading && (
          <div className="mt-6">
            {/* Product Title */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              {reviewData.product}
            </h2>

            {/* Product Image */}
            {reviewData.image ? (
              <img
                src={reviewData.image}
                alt={reviewData.product}
                className="w-full h-56 object-contain mx-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-lg rounded-lg shadow-md">
                No Image Available
              </div>
            )}

            {/* Product Price */}
            <p className="text-lg font-semibold text-center mt-4 text-gray-700">
              Price: <span className="text-green-600">{reviewData.price}</span>
            </p>

            {/* Parse and display review data */}
            {reviewData.filtered_reviews && (
              <div className="mt-6">
                {Object.entries(parseReviewData(reviewData.filtered_reviews)).map(
                  ([section, items], index) => (
                    <div key={index} className="mb-6 p-4 rounded-lg shadow-md">
                      {/* Section Title */}
                      <h3
                        className={`text-lg font-bold ${
                          section.includes("Pros")
                            ? "text-green-700 bg-green-100 border-l-4 border-green-500"
                            : section.includes("Cons")
                            ? "text-red-700 bg-red-100 border-l-4 border-red-500"
                            : section.includes("Recommendation")
                            ? "text-blue-700 bg-blue-100 border-l-4 border-blue-500"
                            : "text-gray-700 bg-gray-100 border-l-4 border-gray-500"
                        } p-2 rounded-md`}
                      >
                        {section}
                      </h3>

                      {/* Display List Items */}
                      {items.length > 1 ? (
                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                          {items.map((item, idx) => (
                            <li key={idx} className="mb-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-700">{items[0]}</p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
          >
            🔙 Back to Home
          </button>

          {reviewData && (
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-center"
            >
              🔗 View Product
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
